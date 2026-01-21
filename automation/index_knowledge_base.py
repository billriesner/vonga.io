#!/usr/bin/env python3
"""
Script to index Google Drive documents into the knowledge base.
Run this periodically to keep the knowledge base up-to-date.
"""

import sys
from auth import get_credentials
from knowledge_base import initialize_knowledge_base


def main():
    """Index documents into the knowledge base."""
    import sys
    
    print("Initializing knowledge base...")
    
    # Get credentials
    creds = get_credentials()
    
    # Initialize knowledge base
    kb = initialize_knowledge_base(creds)
    
    # Check for command-line arguments
    if len(sys.argv) > 1:
        choice = sys.argv[1]
    else:
        print("\n" + "="*60)
        print("Vonga Knowledge Base Indexer")
        print("="*60)
        print("\nOptions:")
        print("1. Index all Google Docs and Sheets in My Drive")
        print("2. Index documents in a specific folder (enter folder ID)")
        print("3. Index documents matching a search query (enter query)")
        print("4. Show knowledge base statistics")
        print("5. Exit")
        print("\nTip: Run with argument for non-interactive mode:")
        print("  python3 index_knowledge_base.py 1  (index all)")
        print("  python3 index_knowledge_base.py 4  (show stats)")
        
        try:
            choice = input("\nEnter choice (1-5): ").strip()
        except EOFError:
            print("\nFor non-interactive mode, run with argument:")
            print("  python3 index_knowledge_base.py 1")
            return
    
    if choice == "1":
        print("\nIndexing all Docs and Sheets in My Drive...")
        kb.index_folder()
    elif choice == "2":
        if len(sys.argv) > 2:
            folder_id = sys.argv[2]
            folder_name = sys.argv[3] if len(sys.argv) > 3 else "Folder"
        else:
            folder_id = input("Enter Google Drive folder ID: ").strip()
            folder_name = input("Enter folder name (for logging): ").strip() or "Folder"
        print(f"\nIndexing documents in {folder_name}...")
        kb.index_folder(folder_id=folder_id, folder_name=folder_name)
    elif choice == "3":
        if len(sys.argv) > 2:
            query = sys.argv[2]
        else:
            query = input("Enter Google Drive search query: ").strip()
        print(f"\nIndexing documents matching query...")
        kb.index_folder(query=query)
    elif choice == "4":
        stats = kb.get_stats()
        print("\nKnowledge Base Statistics:")
        print(f"  Total documents indexed: {stats['total_documents']}")
        print(f"  Total chunks: {stats['total_chunks']}")
        if stats['indexed_files']:
            print(f"\n  Indexed files: {len(stats['indexed_files'])}")
    elif choice == "5":
        print("Exiting...")
        return
    else:
        print("Invalid choice.")
        return
    
    # Show final stats
    stats = kb.get_stats()
    print(f"\n✓ Complete. Total documents in knowledge base: {stats['total_documents']}")


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\nInterrupted by user.")
        sys.exit(0)
    except Exception as e:
        print(f"\nError: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)

