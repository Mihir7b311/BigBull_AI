import os
import json

def flush_memory():
    memory_file_path = "Plugins/memory.json"
    
    # Check if the memory file exists
    if os.path.exists(memory_file_path):
        # Open the memory file and reset its contents
        with open(memory_file_path, 'w') as file:
            # Overwrite the file with empty memory
            json.dump({"query_memory": "", "answer_memory": ""}, file, indent=4)
            print("Memory flushed successfully.")
    else:
        print("Memory file does not exist.")