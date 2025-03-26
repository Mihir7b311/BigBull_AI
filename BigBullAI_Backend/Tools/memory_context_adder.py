import os
import json
from Agents.memory_updater import fetch_memory_and_update

def manage_conversation_memory(query, answer):
    """
    This function manages the memory of the conversation. It reads the memory from a file,
    updates it based on the current query and answer, and writes the updated memory back to the same file.
    
    Args:
    - query (str): The current user query.
    - answer (str): The response to the user query.
    """
    
    # Path to the memory file
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
        answer_memory = ""  # Initialize empty memory if no file exists

    # Process and update memory based on the current query and answer
    updated_memory = fetch_memory_and_update(query, answer, query_memory, answer_memory)
    
    # Extract updated query and answer memory from the response
    updated_query_memory = updated_memory.get("updated_query_memory", "")
    updated_answer_memory = updated_memory.get("updated_answer_memory", "")
    
    # Write the updated memory back to the file (overwrite existing memory)
    with open(memory_file_path, 'w') as file:
        if memory_file_path.endswith('.json'):
            # If JSON, save the memory with a structured format
            json.dump({
                "query_memory": updated_query_memory,
                "answer_memory": updated_answer_memory
            }, file, indent=4)
        else:
            # For text files, just overwrite the raw content
            file.write(updated_query_memory + "\n" + updated_answer_memory)
