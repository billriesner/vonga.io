#!/bin/bash
# Daily knowledge base update script
# This script updates the knowledge base by indexing new documents

# Get the directory where this script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

# Log file
LOG_FILE="$SCRIPT_DIR/knowledge_base_update.log"

# Function to log messages
log_message() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

log_message "Starting knowledge base update..."

# Run the indexing script (option 1 = index all docs)
python3 index_knowledge_base.py 1 >> "$LOG_FILE" 2>&1

# Check exit status
if [ $? -eq 0 ]; then
    log_message "Knowledge base update completed successfully"
else
    log_message "ERROR: Knowledge base update failed"
    exit 1
fi

