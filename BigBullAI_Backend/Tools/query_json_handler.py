import json

def convert_json_to_list(json_data):
    try:
        # Check if json_data is already a dictionary
        if isinstance(json_data, dict):
            print("Input is already a dictionary.")
            data = json_data
        else:
            print("Parsing JSON string...")
            data = json.loads(json_data)  # Convert JSON string to dict
            print("JSON parsing successful.")

        # Extract the list under the key "queries"
        print("Attempting to extract 'queries' key...")
        res = data["queries"]
        print("Extraction successful.")

        return res

    except json.JSONDecodeError as e:
        print(f"❌ Error parsing JSON to list: JSON decoding error - {e}")
    except KeyError as e:
        print(f"❌ Error parsing JSON to list: Missing key - {e}")
    except TypeError as e:
        print(f"❌ Error parsing JSON to list: Type error - {e}")
    except Exception as e:
        print(f"❌ Error parsing JSON to list: Unexpected error - {e}")

    return []  # Return an empty list if an error occurs
