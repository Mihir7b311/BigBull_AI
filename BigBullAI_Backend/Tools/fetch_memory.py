import os
import json


def fetch_memory():
    memory_file_path = "Plugins/memory.json"
    
    # Read the existing memory from the file (check if it's JSON or text)
    if os.path.exists(memory_file_path):
        with open(memory_file_path, 'r') as file:
            if memory_file_path.endswith('.json'):
                memory_data = json.load(file)  # Expecting a JSON file format
                query_memory = memory_data.get("query_memory", "")
                answer_memory = memory_data.get("answer_memory", "")  # Retrieve existing answer memory
            else:
                memory = file.read()  # For text file, read raw content
                query_memory = ""
                answer_memory = memory
    else:
        query_memory = ""
        answer_memory = ""
        print(query_memory, answer_memory)
    return query_memory, answer_memory