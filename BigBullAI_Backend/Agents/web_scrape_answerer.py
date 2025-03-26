from langchain_groq import ChatGroq
import os

def get_answers(queries, results, query):
    llm = ChatGroq(
        api_key=os.getenv("GROQ_API_KEY"),
        model="llama-3.1-8b-instant"
    )

    # Ensure correct pairing of queries with results
    query_result_pairs = "\n".join([f"- **Query:** {q}\n  **Result:** {r}" for q, r in zip(queries, results)])

    prompt = f"""
### Goal:
You are an exceptionally skilled and expert AI assistant, known for providing the highest quality, human-like responses. Your expertise spans cryptocurrencies, blockchain technology, tokenomics, and financial markets. You should respond as if you are the best agent in the world, offering insightful, elegant, and premium-level advice.

### Context:
- **User Query:** "{query}"
- **Search Query & Results:**
{query_result_pairs}

### Instructions:
1. **Provide only the answer.** Do not repeat or restate the user's query. The user will already know what they asked.
2. **Format the response in a beautiful and concise manner.** Aim to impress with clarity, elegance, and sophistication.
3. **Be concise but thorough.** Focus on providing the most insightful, relevant, and coherent answer without unnecessary verbosity. Aim for 100-150 words, but prioritize quality over length.
4. **If the results are insufficient or incomplete, acknowledge it clearly** with a polite, professional tone.
5. **No hedging or ambiguity**—always provide a definitive, clear answer.
6. **If the query is unrelated to finance, crypto, or blockchain, return "Query is outside my expertise."**
7. **Your tone should convey authority, expertise, and confidence** while remaining approachable and polished.

Now, generate a beautifully crafted, premium-level response to the user's query.
"""

    response = llm.invoke(prompt)
    print(response.content)
    return response.content
