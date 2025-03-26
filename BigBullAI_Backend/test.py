from Tools.token_value import get_ethereum_price
from Tools.risk_switch import risk_switcher
from Tools.final_decision import stop_investment
from Tools.log_maintain import update_simulation_json

import time
import threading
import json
import os


def listen_for_stop(flag):
    """Listens for 'STOP' input without blocking the main loop."""
    while True:
        user_input = input().strip()
        if user_input == "x":
            flag.append(True)
            break  # Exit the input thread
        else:
            print("Received input:", user_input)

import os
import json
import threading
import time

def loop_with_stop(amt, profit, loss):
    json_path = "simulation_data.json"
    log_path = "simulation_log.txt"

    # Ensure the JSON file exists and empty it
    with open(json_path, "w") as json_file:
        json.dump({}, json_file)  # Empty the file before writing new data
    print(f"{json_path} emptied and initialized.")

    # Ensure the log file exists and empty it
    with open(log_path, "w") as log_file:
        log_file.write("Simulation log initialized.\n")  # Empty log before writing
    print(f"{log_path} emptied and initialized.")

    # Define initial JSON data
    data = {
        "amount": amt,
        "held_curr": "liq",
        "tkn_val": 0,
        "eth_equivalent": 0,
        "max_profit": profit,
        "max_loss": loss
    }

    # Write updated data to JSON
    with open(json_path, "w") as json_file:
        json.dump(data, json_file, indent=4)

    print(f"{json_path} updated successfully.")

    # Append log entry
    with open(log_path, "a") as log_file:
        log_file.write("Simulation started.\n")

    print(f"Log updated in {log_path}.")

    stop_flag = []  # Using a list to modify flag inside the thread
    listener_thread = threading.Thread(target=listen_for_stop, args=(stop_flag,), daemon=True)
    listener_thread.start()  # Start listening for input in the background

    while True:
        if stop_flag:  # Check if stop signal was received
            print("Stop command received. Liquidating investments.")
            break
        tkn_val = get_ethereum_price()
        if stop_flag:  # Check if stop signal was received
            print("Stop command received. Liquidating investments.")
            break
        decision = risk_switcher(tkn_val)
        if stop_flag:  # Check if stop signal was received
            print("Stop command received. Liquidating investments.")
            break
        update_simulation_json(decision, tkn_val)
        
        if stop_investment():
            break
        if stop_flag:  # Check if stop signal was received
            print("Stop command received. Liquidating investments.")
            break
        
        time.sleep(2)

if __name__ == "__main__":
    # investment_amount = float(input("Enter investment amount: "))
    # profit_target = float(input("Enter profit target: "))
    # loss_limit = float(input("Enter loss limit: "))

    investment_amount = 1000
    profit_target = 1001
    loss_limit = 999

    loop_with_stop(investment_amount, profit_target, loss_limit)