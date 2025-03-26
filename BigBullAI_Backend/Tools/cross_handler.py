import json
from investment_handler import refine_investment

# Function to fetch "category" field from a JSON object
def get_category_from_json(json_data):
    try:
        # Check if 'category' key exists in the JSON data
        if 'category' in json_data:
            category_value = json_data['category']
            
            # Return based on the category value
            if category_value == "investment":
                return 1
            elif category_value == "send_cryptos":
                return 2
            else:
                return 3
        else:
            return {"error": "Category field not found in the JSON object"}
    
    except Exception as e:
        return {"error": "An error occurred while processing the JSON data", "details": str(e)}