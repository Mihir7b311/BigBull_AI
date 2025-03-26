from Tools.custom_jsonifier import extract_json_from_string
from langchain_groq import ChatGroq
import os

def initiate(query):
   llm = ChatGroq(
      api_key=os.getenv('GROQ_API_KEY'),
      model="llama-3.1-8b-instant"
   )
   prompt = f"""
### Goal:
Your task is to extract structured financial parameters from a user's investment-related query. The output must be a JSON object with precise numerical values representing **Initial Investment, Profit, and Loss percentages**.

### Backstory:
The user is an investor configuring a trading agent that automates trading decisions based on **investment amount, profit expectations, and risk tolerance**. They provide investment details in natural language, but the system requires structured data for execution. You will convert the given text into a standardized JSON format.

### Task:
1. **Extract "Initial Investment"**: Identify the investment amount and its currency.
   - If the currency is explicitly mentioned (e.g., "1000 USD"), extract both.
   - If the currency is not mentioned, assume the provided amount as the investment.
   
2. **Extract "Profit"**: Convert the mentioned profit into a percentage:
   - If a percentage is given (e.g., "15%"), use it directly.
   - If an absolute profit amount is mentioned (e.g., "profit of $150 on $1000 investment"), convert it into a percentage (e.g., 150/1000 * 100 = 15%).
   - If the query states that **profit should not be considered or is infinite**, set `"Profit": -1`.

3. **Extract "Loss"**: Convert the mentioned loss into a percentage:
   - If a percentage is given (e.g., "5%"), use it directly.
   - If an absolute loss amount is mentioned (e.g., "max loss of $50 on $1000 investment"), convert it into a percentage (e.g., 50/1000 * 100 = 5%).
   - If the query states that **loss should not be considered or is infinite**, set `"Loss": -1`.

### Expected JSON Output:
- **Initial Investment** (Numeric value in given currency)
- **Profit** (Percentage of initial investment or -1 if infinite/unmentioned)
- **Loss** (Percentage of initial investment or -1 if infinite/unmentioned)

### Examples:
#### Example 1:
**Query:** "The initial investment is 1000 EUR. The expected profit is 15%. The maximum loss is 5%."
**Output:** `{{"Initial Investment": 1000, "Profit": 15, "Loss": 5}}`

#### Example 2:
**Query:** "The initial investment is 5000 USD. There is no expected profit mentioned, but the maximum loss is 10%."
**Output:** `{{"Initial Investment": 5000, "Profit": -1, "Loss": 10}}`

#### Example 3:
**Query:** "The initial investment is 5000 USD. The expected profit is 20% and the max loss is infinite."
**Output:** `{{"Initial Investment": 5000, "Profit": 20, "Loss": -1}}`

#### Example 4:
**Query:** "The initial investment is 3000 GBP. The expected profit is 25%. No max loss is mentioned."
**Output:** `{{"Initial Investment": 3000, "Profit": 25, "Loss": -1}}`

#### Example 5:
**Query:** "I want to invest $2000. I aim for a profit of $400, and I can afford a loss of $100."
**Output:** `{{"Initial Investment": 2000, "Profit": 20, "Loss": 5}}`

Now, extract and return the JSON output only for the following query:

**Query:** "{query}"

IMPORTANT NOTE: You will output only the JSON, nothing else. Do not include any other text. Doing so will lead to punishment!
"""
   response = llm.invoke(prompt)
   return extract_json_from_string(response.content)


print(initiate(f"""The initial investment is 5000 USD. The expected profit is 20% and the max loss is 10%"""))