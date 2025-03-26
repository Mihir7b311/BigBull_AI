import os
import json
from langchain_groq import ChatGroq
from Tools.custom_jsonifier import extract_json_from_string

def fetch_memory_and_update(query, answer, query_memory, answer_memory):
    """
    This function uses the LLM to process the memory and query, summarizing and updating it with only the necessary information.
    It ensures the memory doesn't exceed the 150-word limit for both query and answer memories.
    """
    # Initialize the LLM (ChatGroq)
    llm = ChatGroq(
        api_key=os.getenv("GROQ_API_KEY"),
        model="llama-3.1-8b-instant"
    )

    # Construct the prompt with emphasis on being a superior and premium agent
    prompt = f"""
### Goal:
You are a superior and premium memory updater agent capable of handling memories within a certain word limit constraint. You must calculate the most relevant parts of the conversation to retain and remove any irrelevant information. Your goal is to produce a memory that is always correct, clear, and concise while adhering to the word limit.

### Instructions:
- Your task is to update the current memory based on the user's query. 
- You should always ensure that both "updated_query_memory" and "updated_answer_memory" do **NOT exceed 150 words** each.
- When updating the memories, make sure to focus on keeping the **most important and relevant information**.
- You must decide what to remove from the memory and what to add, ensuring the added information is always correct and clear.
- **Always make sure to use correct facts**, and keep only the necessary context while making sure the memory remains understandable.
- If you are unsure about the relevance, assume that **only relevant information** must remain.
- Maintain a memory that is able to summarise the last 3 conversation chats, at least to ensure that the agent is able to recall the conversation history and answer the user's query.

### Output Format:
- Your output will only be a JSON, anything else will lead to severe punishment.
- Do NOT use json tags.
- The JSON should be in the following format:
```json
{{
    "updated_query_memory": "<new memory for query>",
    "updated_answer_memory": "<new memory for answer>"
}}
```
- The memory for each part should be a **maximum of 150 words**.

### Current Memory:
---
User Query Memory: {query_memory}
---
Answer Memory: {answer_memory}
---

### Current User Query:
{query}

### Current Agent Answer:
{answer}


Now return the updated memory in JSON format.
"""
    
    # Invoke the model with the prompt
    response = llm.invoke(prompt)
    return extract_json_from_string(response.content)
