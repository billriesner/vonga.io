"""
Knowledge Base system for continuously learning from Google Drive documents.
Uses ChromaDB for vector storage and retrieval.
"""

import os
import json
from typing import List, Dict, Any, Optional
from datetime import datetime
from pathlib import Path

try:
    import chromadb
    from chromadb.config import Settings
    from sentence_transformers import SentenceTransformer
    CHROMADB_AVAILABLE = True
except ImportError:
    CHROMADB_AVAILABLE = False

from google.oauth2.credentials import Credentials
from tools.drive_tools import get_drive_service, get_docs_service, get_sheets_service


class KnowledgeBase:
    """Knowledge base system that indexes and retrieves information from Google Drive."""
    
    def __init__(self, creds: Credentials, persist_directory: str = "./knowledge_base"):
        """
        Initialize the knowledge base.
        
        Args:
            creds: Google credentials for accessing Drive
            persist_directory: Directory to store the ChromaDB database
        """
        if not CHROMADB_AVAILABLE:
            raise ImportError("chromadb and sentence-transformers are required. Install with: pip install chromadb sentence-transformers")
        
        self.creds = creds
        self.persist_directory = Path(persist_directory)
        self.persist_directory.mkdir(exist_ok=True)
        
        # Initialize ChromaDB
        self.client = chromadb.PersistentClient(
            path=str(self.persist_directory),
            settings=Settings(anonymized_telemetry=False)
        )
        
        # Get or create collection
        self.collection = self.client.get_or_create_collection(
            name="vonga_knowledge_base",
            metadata={"description": "Vonga business knowledge base from Google Drive"}
        )
        
        # Initialize embedding model (using a free, local model)
        print("Loading embedding model...")
        self.embedding_model = SentenceTransformer('all-MiniLM-L6-v2')
        print("✓ Embedding model loaded")
        
        # Load index tracking file
        self.index_file = self.persist_directory / "indexed_files.json"
        self.indexed_files = self._load_indexed_files()
    
    def _load_indexed_files(self) -> Dict[str, Dict[str, Any]]:
        """Load the tracking file for indexed documents."""
        if self.index_file.exists():
            with open(self.index_file, 'r') as f:
                return json.load(f)
        return {}
    
    def _save_indexed_files(self):
        """Save the tracking file for indexed documents."""
        with open(self.index_file, 'w') as f:
            json.dump(self.indexed_files, f, indent=2)
    
    def _extract_text_from_doc(self, file_id: str) -> str:
        """Extract text from a Google Doc."""
        try:
            docs_service = get_docs_service(self.creds)
            doc = docs_service.documents().get(documentId=file_id).execute()
            content = doc.get('body', {}).get('content', [])
            
            text_parts = []
            for element in content:
                if 'paragraph' in element:
                    para = element['paragraph']
                    for elem in para.get('elements', []):
                        if 'textRun' in elem:
                            text_parts.append(elem['textRun'].get('content', ''))
            
            return ''.join(text_parts)
        except Exception as e:
            print(f"Error extracting text from doc {file_id}: {e}")
            return ""
    
    def _extract_text_from_sheet(self, file_id: str) -> str:
        """Extract text from a Google Sheet (first tab)."""
        try:
            sheets_service = get_sheets_service(self.creds)
            spreadsheet = sheets_service.spreadsheets().get(spreadsheetId=file_id).execute()
            sheets = spreadsheet.get('sheets', [])
            
            if not sheets:
                return ""
            
            first_sheet_name = sheets[0].get('properties', {}).get('title', 'Sheet1')
            result = sheets_service.spreadsheets().values().get(
                spreadsheetId=file_id,
                range=f"{first_sheet_name}!A1:Z1000"
            ).execute()
            
            values = result.get('values', [])
            # Convert rows to text
            text_lines = []
            for row in values:
                text_lines.append(" | ".join(str(cell) for cell in row))
            
            return "\n".join(text_lines)
        except Exception as e:
            print(f"Error extracting text from sheet {file_id}: {e}")
            return ""
    
    def index_document(self, file_id: str, file_name: str, file_type: str, force_reindex: bool = False):
        """
        Index a single document from Google Drive.
        
        Args:
            file_id: Google Drive file ID
            file_name: Name of the file
            file_type: MIME type of the file
            force_reindex: If True, reindex even if already indexed
        """
        # Check if already indexed (unless forcing reindex)
        if not force_reindex and file_id in self.indexed_files:
            existing = self.indexed_files[file_id]
            # Could check modification time here to see if reindex needed
            print(f"Document {file_name} already indexed. Use force_reindex=True to reindex.")
            return
        
        print(f"Indexing {file_name} ({file_id})...")
        
        # Extract text based on file type
        text = ""
        if file_type == 'application/vnd.google-apps.document':
            text = self._extract_text_from_doc(file_id)
        elif file_type == 'application/vnd.google-apps.spreadsheet':
            text = self._extract_text_from_sheet(file_id)
        else:
            print(f"Unsupported file type: {file_type}")
            return
        
        if not text.strip():
            print(f"No text extracted from {file_name}")
            return
        
        # Split text into chunks (simple approach - can be improved)
        chunk_size = 1000
        chunks = []
        words = text.split()
        current_chunk = []
        current_length = 0
        
        for word in words:
            word_length = len(word) + 1  # +1 for space
            if current_length + word_length > chunk_size and current_chunk:
                chunks.append(' '.join(current_chunk))
                current_chunk = [word]
                current_length = word_length
            else:
                current_chunk.append(word)
                current_length += word_length
        
        if current_chunk:
            chunks.append(' '.join(current_chunk))
        
        # Generate embeddings and add to collection
        if chunks:
            embeddings = self.embedding_model.encode(chunks).tolist()
            
            # Create IDs and metadata
            ids = [f"{file_id}_chunk_{i}" for i in range(len(chunks))]
            metadatas = [
                {
                    "file_id": file_id,
                    "file_name": file_name,
                    "file_type": file_type,
                    "chunk_index": i,
                    "indexed_at": datetime.utcnow().isoformat()
                }
                for i in range(len(chunks))
            ]
            
            # Add to ChromaDB
            self.collection.add(
                embeddings=embeddings,
                documents=chunks,
                ids=ids,
                metadatas=metadatas
            )
            
            # Track in indexed files
            self.indexed_files[file_id] = {
                "file_name": file_name,
                "file_type": file_type,
                "indexed_at": datetime.utcnow().isoformat(),
                "chunks": len(chunks)
            }
            self._save_indexed_files()
            
            print(f"✓ Indexed {file_name} ({len(chunks)} chunks)")
    
    def index_folder(self, folder_id: str = None, folder_name: str = "My Drive", query: str = None):
        """
        Index all documents in a folder or matching a query.
        
        Args:
            folder_id: Google Drive folder ID (if None, searches all files)
            folder_name: Name for logging
            query: Optional Drive search query
        """
        drive_service = get_drive_service(self.creds)
        
        # Build search query
        if folder_id:
            search_query = f"'{folder_id}' in parents"
        elif query:
            search_query = query
        else:
            # Default: search for Docs and Sheets
            search_query = "(mimeType='application/vnd.google-apps.document' or mimeType='application/vnd.google-apps.spreadsheet')"
        
        print(f"Searching for files in {folder_name}...")
        
        page_token = None
        total_indexed = 0
        
        while True:
            try:
                results = drive_service.files().list(
                    q=search_query,
                    pageSize=100,
                    pageToken=page_token,
                    fields="nextPageToken, files(id, name, mimeType, modifiedTime)"
                ).execute()
                
                files = results.get('files', [])
                
                if not files:
                    break
                
                for file in files:
                    file_id = file['id']
                    file_name = file['name']
                    file_type = file['mimeType']
                    
                    # Only index Docs and Sheets
                    if file_type in ['application/vnd.google-apps.document', 'application/vnd.google-apps.spreadsheet']:
                        try:
                            self.index_document(file_id, file_name, file_type)
                            total_indexed += 1
                        except Exception as e:
                            print(f"Error indexing {file_name}: {e}")
                
                page_token = results.get('nextPageToken')
                if not page_token:
                    break
                    
            except Exception as e:
                print(f"Error during indexing: {e}")
                break
        
        print(f"✓ Indexing complete. Total documents indexed: {total_indexed}")
    
    def search(self, query: str, n_results: int = 5) -> List[Dict[str, Any]]:
        """
        Search the knowledge base.
        
        Args:
            query: Search query
            n_results: Number of results to return
            
        Returns:
            List of results with document chunks and metadata
        """
        if self.collection.count() == 0:
            return []
        
        # Generate embedding for query
        query_embedding = self.embedding_model.encode([query]).tolist()[0]
        
        # Search in ChromaDB
        results = self.collection.query(
            query_embeddings=[query_embedding],
            n_results=n_results
        )
        
        # Format results
        formatted_results = []
        if results['documents'] and len(results['documents'][0]) > 0:
            for i in range(len(results['documents'][0])):
                formatted_results.append({
                    "content": results['documents'][0][i],
                    "file_name": results['metadatas'][0][i].get('file_name', 'Unknown'),
                    "file_id": results['metadatas'][0][i].get('file_id', ''),
                    "file_type": results['metadatas'][0][i].get('file_type', ''),
                    "distance": results['distances'][0][i] if results.get('distances') else None
                })
        
        return formatted_results
    
    def get_stats(self) -> Dict[str, Any]:
        """Get statistics about the knowledge base."""
        count = self.collection.count()
        return {
            "total_chunks": count,
            "total_documents": len(self.indexed_files),
            "indexed_files": list(self.indexed_files.keys())
        }


def initialize_knowledge_base(creds: Credentials) -> KnowledgeBase:
    """Initialize and return a KnowledgeBase instance."""
    return KnowledgeBase(creds)

