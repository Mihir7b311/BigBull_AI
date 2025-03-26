import json

# Function to convert a string into JSON
def extract_json_from_string(response_string):
    try:
        # Step 1: Remove all newline characters
        response_string = response_string.replace("\n", "").strip()

        # Step 2: Check for presence of triple backticks and extract the JSON content between them
        if "```" in response_string:
            start_index = response_string.find("```") + 3
            end_index = response_string.rfind("```")
            json_string = response_string[start_index:end_index].strip()

            # Check if the content starts with 'json' and remove it
            if json_string.startswith("json"):
                json_string = json_string[4:].strip()

        else:
            # Step 3: Extract the JSON content based on curly braces
            start_index = response_string.find("{")
            end_index = response_string.rfind("}") + 1
            json_string = response_string[start_index:end_index].strip()

        # Step 4: Parse the extracted JSON string and return
        # print(json_string)
        res = json.loads(json_string)
        # print(res)
        return res

    except Exception as e:
        print(response_string)  # Print the input for debugging
        return {"error": "Unable to extract valid JSON", "details": str(e)}
