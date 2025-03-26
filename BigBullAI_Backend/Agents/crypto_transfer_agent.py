import os
from langchain_groq import ChatGroq
from Tools.custom_jsonifier import extract_json_from_string

def process_crypto_transfer(query, token_table1, token_table2):
    llm = ChatGroq(
        api_key=os.getenv("GROQ_API_KEY"),
        model="llama-3.1-8b-instant"
    )

    prompt = f"""### Goal:
Your task is to determine whether a user's crypto request is a **transfer ("send")** or a **swap ("swap")**, extract relevant details, and return a structured JSON response.

### Instructions:
1. **Identify the intent:**
   - If the request involves sending tokens to an account, classify it as `"send"`.
   - If the request involves exchanging tokens, classify it as `"swap"`.
   
2. **Extract relevant details:**
   - `"units"`: Number of tokens (if mentioned), otherwise `"NIL"`.
   - `"src"`: Token abbreviation based on the provided table. If the token abbreviation isn't in the table or isn't clearly mentioned, return `"NIL"`. **Ensure that you use exactly the abbreviation provided in the table**. **Any deviation from this abbreviation will lead to severe punishment**. For example, Gala Games' abbreviation is **"GALA[v2]"**, and it must be written exactly as it appears in the table. Writing it as **"GALA"** or any other variant will result in severe punishment.
   - `"dest"`: Target token abbreviation (same logic as `"src"`). **"src"** refers to the **"from"** token and **"dest"** refers to the **"to"** token. Always respect the context of **from** (src) and **to** (dest). **Any incorrect assignment will lead to punishment**.
   - `"receiver_id"`: Account ID if mentioned, otherwise `"NIL"`.
   
3. **Ensure strict adherence to the output format** (see examples below). Do **NOT** use abbreviations that are not listed in the provided tables.

4. **IMPORTANT RULES:**
   - If you **cannot find** the abbreviation from the tables, return **"NIL"** for that token.
   - You **must** use the exact abbreviations from the token tables provided, or else severe punishment will occur.
   - Be precise with **src** (from token) and **dest** (to token). **Do not mix them up!**.
   - If a query includes tokens not listed in the table, **"NIL"** must be returned for the respective tokens.
   - **Any deviation from these rules will result in severe punishment.**
   - Use "NIL" for missing information
   
   **Example for clarity**: If the token table includes **GALA[v2]** for Gala Games, you **must** use **"GALA[v2]"** exactly as it is listed in the table. **If you use "GALA" instead of "GALA[v2]", this will be considered a violation, and you will be severely punished**. This specific rule is in place to ensure precise accuracy in token identification.

### Token Table (for reference):
---
{token_table1}
{token_table2}
---

### Output Format:
```json
{{
  "transfer_type": "send/swap",
  "units": number or "NIL",
  "src": "token name or NIL",
  "dest": "token name or NIL",
  "receiver_id": "account ID or NIL"
}}
```

IMPORTANT:
- Only return the JSON output. No explanations, extra text, or formatting tags.
- Ensure all fields are correctly extracted.
- Any deviation will lead to severe punishment!
**Examples**:

Example 1:
User Query: "Send 100 Solana to account: 4234234263eswdfgns from BTC"
Output:
```json
{{
  "transfer_type": "send",
  "units": 100,
  "src": "BTC",
  "dest": "SOL",
  "receiver_id": "4234234263eswdfgns"
}}
```

Example 2:
User Query: "Swap 100 BTC for ETH"
Output:
```json
{{
  "transfer_type": "swap",
  "units": 100,
  "src": "BTC",
  "dest": "ETH",
  "receiver_id": "NIL"
}}
```

Example 3:
User Query: "Send ETH to account: 999XYZ"
Output:
```json
{{
  "transfer_type": "send",
  "units": "NIL",
  "src": "ETH",
  "dest": "NIL",
  "receiver_id": "999XYZ"
}}
```

Now, generate and return the output ONLY for the following query:
User Query: "{query}" """

    response = llm.invoke(prompt)
    # print(response.content)
    return extract_json_from_string(response.content)

# query = "Swap 100 synthetix for tether on ID: 9f4e12a38bcd."
# # Expected GALA and FLOKI
# res1 = fetch_data("synthetix")
# res2 = fetch_data("tether")
# print(res1)
# print(res2)
# print(process_crypto_transfer(query, res1, res2))