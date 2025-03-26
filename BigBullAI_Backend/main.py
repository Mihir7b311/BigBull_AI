from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException, Request
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import asyncio
import json
from utils import investment_logic, handle_chat
from Tools.flush_memory import flush_memory

# Initialize the FastAPI app
app = FastAPI()

# Allow all origins using CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)

@app.post("/chat")
async def chat(request: Request):
    try:
        data = await request.json()
        query = data.get("query")
        # Call the custom function with the query
        response = await handle_chat(query)
        return response
    except ValueError as e:
        # Handle specific error and raise HTTPException with 400 status code (Bad Request)
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        # Handle any other unexpected errors and raise HTTPException with 500 status code (Internal Server Error)
        raise HTTPException(status_code=500, detail="Internal Server Error: " + str(e))

# WebSocket Endpoint: /inv
@app.websocket("/inv")
async def inv(websocket: WebSocket):
    await websocket.accept()
    
    try:
        # Receive the initial investment details from the frontend
        init_message = await websocket.receive_text()
        init_data = json.loads(init_message)  # Parse JSON

        amt = init_data.get("amount", 1000)
        profit = init_data.get("profit", amt * 1.001)
        loss = init_data.get("loss", amt * 0.999)

        print(amt, profit, loss)
        stop_event = asyncio.Event()
        investment_task = asyncio.create_task(investment_logic(amt, profit, loss, stop_event, websocket))

        while not stop_event.is_set():
            message = await websocket.receive_text()
            if message == "stop":
                print("Received stop command from client.")
                await websocket.send_json({"decision": "Stopping Token Investment. Liquidating Assets."})
                stop_event.set()
                break

    except WebSocketDisconnect:
        print("Client disconnected from /inv WebSocket")
        stop_event.set()  # Ensure investment logic stops

    finally:
        investment_task.cancel()  # Cancel the running task safely

@app.post("/erase")
async def erase_data():
    flush_memory()
    return {"message": "Memory flushed successfully."}