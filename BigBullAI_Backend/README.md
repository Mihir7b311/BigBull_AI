# FastAPI Investment & Crypto Query Handler

## Setup and Installation

To set up and run this FastAPI application, follow these steps:

1. **Create a virtual environment:**
   ```sh
   python -m venv venv
   ```
2. **Activate the virtual environment:**
   - On Windows:
     ```sh
     venv\Scripts\activate
     ```
   - On macOS/Linux:
     ```sh
     source venv/bin/activate
     ```
3. **Install the required dependencies:**
   ```sh
   pip install -r requirements.txt
   ```
4. **Run the FastAPI server using Uvicorn:**
   ```sh
   uvicorn main:app --reload --port 8000 --host 0.0.0.0
   ```
   *(You can change the host and port as needed.)*

---

## API Endpoints

### **1. Chat Endpoint**
**Endpoint:** `/chat`

**Method:** `POST`

**Description:** This endpoint processes user queries related to cryptocurrency investment, deposits/withdrawals, and web scraping for token conversions.

**Request Format:**
```json
{
    "query": "<user_query>"
}
```

**Response Format 1:**
```json
{
    "category": "investment",
    "amount": <amount>,
    "profit": <profit>,
    "loss": <loss>,
    "profit_margins": "<% | USD | NIL>",
    "loss_margins": "<% | USD | NIL>"
}
```

**Meanings:**
- **"investment"** - Indicates an investment-related query, returning amount, profit, loss, and margin types:
  - `profit_margins`:
    - `%` - Profit margin is percentage-based.
    - `USD` - Profit is in absolute USD value.
    - `NIL` - Profit margin not specified.
  - `loss_margins`:
    - `%` - Loss margin is percentage-based.
    - `USD` - Loss is in absolute USD value.
    - `NIL` - No loss specified.
  - `profit/loss`:
    - `Non-negative number` - indicating a margin (in USD or %)
    - `-1` - indicating no bounds, infinite allowable profit or loss
    - `NIL` - not specified

**Response Format 2:**
```json
{
    "category": "send_cryptos",
    "transfer_type": "send/swap",
    "units": <tokens to swap or send>,
    "src": <token_id>,
    "dest": <token_id>,
    "receiver_id": <receiver_id>,
}
```

**Meanings:**
- **"send_cryptos"** - Indicates a transfer of tokens or NFTs into wallets
- **"transfer_type"** - Transfer type: "send" or "swap"
- **"units"** - Number of tokens to send or swap, "NIL" indicates not mentioned
- **"src"** - Source token ID, "NIL" indicates not mentioned
- **"dest"** - Destination token ID, "NIL" indicates not mentioned
- **"receiver_id"** - Receiver's wallet address, "NIL" indicates not mentioned

**Response Format 3:**
```json
{
    "category": "web_scrape",
    "bot_answer": "<answer_to_query>"
}
```

**Meanings:**
- **"web_scrape"** - Indicates a request for cryptocurrency prices, trends, conversions, or market data.
- **"bot_answer"** - Response generated to user's query/queries.


**Response Format 4:**
```json
{
    "category": "general",
    "bot_answer": "<answer_to_query>"
}
```

**Meanings:**
- **"general"** - Indicates a request for general queries, includes guard railing and general information.
- **"bot_answer"** - Response generated to user's query/queries.

**Response Format 5:**
```json
{
    "category": "personality",
    "bot_answer": "<answer_to_query>"
}
```

**Meanings:**
- **"personality"** - Indicates a request for the application's/framework's capabilities, developers and agentic systems.
- **"bot_answer"** - Response generated to user's query/queries.
---

### **2. WebSocket Investment Endpoint**  
**Endpoint:** `/inv`  

**Method:** `WebSocket`  

**Description:** Establishes a WebSocket connection between the user and server to invest USD into Electronic Gold (EGLD/USDT). Returns High-Frequency Trading (HFT)/Scalping-based responses every 2 seconds.  

**How It Works:**  
1. The client sends initial investment details in JSON format:  
   ```json
   {
       "amount": <investment_amount>,
       "profit": <profit_target>,
       "loss": <loss_limit>
   }
   ```
2. The WebSocket continuously returns trading updates every 2 seconds in JSON format.  
3. The client can send a `"stop"` message to liquidate assets and end the session.  


### **Response Format:**  
Every 2 seconds, the server sends a JSON response with the following structure:  
```json
{
    "decision": "<buy/sell/hold>",
    "tkn_val": "<current_token_value>",
    "immediate_profit": "<profit_from_current_trade>",
    "accumulated_profit": "<total_profit_since_start>",
    "net_returns": "<current_total_value_of_investment>"
}
```

Termination Response (from frontend):
```json
{
  "decision": "Stopping Token Investment. Liquidating Assets."
}
```

For example, if the initial investment was **1000 USD**, a sample response could be:  
```json
{
    "decision": "sell",
    "tkn_val": "2147.36",
    "immediate_profit": "0.005",
    "accumulated_profit": "14.798",
    "net_returns": "1014.798"
}
```
### **3. Chat Endpoint**
**Endpoint:** `/erase`

**Method:** `POST`

**Description:** Clears memory of chat history. 
---  

## Notes  
- The chat endpoint is designed to automatically classify and extract structured information from user queries.  
- The WebSocket endpoint runs real-time trading logic and provides market updates every 2 seconds.  
- CORS is enabled to allow cross-origin requests.  

This project is built using FastAPI and leverages AI-driven categorization for investment queries, crypto transactions, and market data retrieval.