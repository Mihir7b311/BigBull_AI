import json

def refine_investment(json_data):
    category_value = json_data['category']
    amount = json_data['amount']
    profit = json_data['profit']
    loss = json_data['loss']
    profit_margins = json_data['profit_margins']
    loss_margins = json_data['loss_margins']

    if profit != -1:
        if profit_margins == "%":
            profit = amount * (profit / 100)
    if loss != -1:
        if loss_margins == "%":
            loss = amount * (loss / 100)

    return {"amount": amount, "profit": profit, "loss": loss}