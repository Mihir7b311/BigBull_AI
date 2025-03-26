import json

def update_simulation_json(decision: int, tkn_val: float):
    """Updates 'simulation_res.json' with new 'amount' value and logs the change."""
    json_path = "./simulation_data.json"
    log_path = "./simulation_log.txt"
    profit = 0
    decision1 = ""
    decision2 = ""
    try:
        # Read the existing JSON file
        with open(json_path, "r") as file:
            data = json.load(file)

        # Fetch original values
        old_amount = data.get("amount", 0)
        held_curr = data.get("held_curr", "liq")
        old_tkn_val = data.get("tkn_val", 0)
        old_eth_equivalent = data.get("eth_equivalent", 0)

        if(held_curr == "liq" and decision == 0):
            decision = 1
        elif(held_curr == "tkn" and decision == 2):
            decision = 1

        profit = (tkn_val - old_tkn_val) * old_eth_equivalent
        if decision == 1:
            if held_curr == "liq":
                decision1 = "Liquidity Held. No profit."
                decision2 = "hold"
                profit = 0
                data["eth_equivalent"] = old_amount / tkn_val
                print("Holding liquidity. No profit.")
                with open(log_path, "a") as log_file:
                    log_file.write(f"{decision1}\n")
            else:
                decision1 = f"Tokens Held. Profit: {profit}."
                decision2 = "hold"
                data["amount"] += profit
                print("Holding tokens. Profit added.")
                with open(log_path, "a") as log_file:
                    log_file.write(f"{decision1}\n")
            data["tkn_val"] = tkn_val
        elif decision == 2:
            decision1 = "Tokens Bought. No profit."
            decision2 = "buy"
            data["held_curr"] = "tkn"
            data["tkn_val"] = tkn_val
            data["eth_equivalent"] = old_amount / tkn_val
            profit = 0
            print("Buying tokens. No profit.")
            with open(log_path, "a") as log_file:
                log_file.write(f"{decision1}\n")
        else:
            decision1 = f"Tokens Sold. Profit: {profit}."
            decision2 = "sell"
            data["held_curr"] = "liq"
            data["tkn_val"] = tkn_val
            data["amount"] += profit
            print("Selling tokens. Profit added.")
            with open(log_path, "a") as log_file:
                log_file.write(f"{decision1}\n")

        # Write back the updated JSON
        with open(json_path, "w") as file:
            json.dump(data, file, indent=4)

        return {
        "decision": decision2,
        "tkn_val": tkn_val,
        "immediate_profit": profit,
        "accumulated_profit": data["amount"] - data["init_amt"],
        "net_returns": data["amount"]
        }
    
    except Exception as e:
        print(f"Error: {e}")
