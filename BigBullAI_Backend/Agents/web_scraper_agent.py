from langchain_groq import ChatGroq
from Tools.custom_jsonifier import extract_json_from_string
import os

def generate_questions(user_query):
    llm = ChatGroq(
        api_key=os.getenv("GROQ_API_KEY"),
        model="llama-3.1-8b-instant"
    )
    
    prompt = f"""
### Goal:
Your task is to generate the most efficient set of search queries that can retrieve all necessary information to answer a user's query. **Each search should perform exactly one simple task** to minimize total searches.

### Instructions:
1. **Break down the user query** into minimal, independent search tasks.
2. **Ensure each search retrieves only one specific type of information.**
3. **Minimize the number of searches** while ensuring completeness.
4. **Output format**: **Return only a json with a single list inside** in the format: {{["q1", "q2", ..., "qn"]}}
5. **DO NOT** return anything except the formatted list. **No explanations, no extra text, nothing.**
6. **If you fail to follow this, the system will break, and you will be severely punished.**

### Output Format
```json
{{"queries": ["query_1", "query_2", "query_3", ... , "query_n"]}}
```

IMPORTANT POINT: Any deviation from the output format will lead to severe punishment, ignore JSON tags from the output format.

### Examples:
#### Example 1:
**User Query:** "What is the conversion rate of Ethereum to EGLD?"
**Output:** `{{"queries": ["What is current Ethereum token price in USD?", "What is current EGLD token price in USD?"]}}`

#### Example 2:
**User Query:** "Find the market cap and total supply of Solana."
**Output:** `{{"queries": ["What is the current Solana market capitalization?", "What is the current Solana total supply?"]}}`

#### Example 3:
**User Query:** "What is the weather in New York and the current USD to EUR exchange rate?"
**Output:** `{{"queries": ["What is the Current weather in New York?", "What is the current USD to EUR exchange rate?"]}}`

#### Example 4:
**User Query:** "Get the latest Tesla stock price and Bitcoin price in USD."
**Output:** `{{"queries": ["what is the current Tesla stock price?", "What is the current Bitcoin price in USD?"]}}`

Now, generate and return the output **ONLY** for the following query:

**User Query:** "{user_query}"

**IMPORTANT NOTE:**  
- **Return only the list in the exact format specified.**  
- **DO NOT include any extra text, explanations, or formatting tags.**  
- **DO NOT use JSON tags, but do enclose the list in a JSON.**
- **Use double quotes only as JSON requires double quotes.**
- **Failure to follow these rules will result in severe punishment!**
"""
    
    response = llm.invoke(prompt)
    print(response.content)
    return extract_json_from_string(response.content)