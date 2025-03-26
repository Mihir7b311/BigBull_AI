import requests
import os
import re

def web_search(query, freshness="noLimit", summary=True, count=3):
    api_key = os.getenv("LANGSEARCH_API_KEY")
    url = "https://api.langsearch.com/v1/web-search"
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }
    data = {
        "query": query,
        "freshness": freshness,
        "summary": summary,
        "count": count
    }
    
    response = requests.post(url, headers=headers, json=data)
    
    if response.status_code == 200:
        data = response.json()
        # Check if "data" -> "webPages" -> "value" exists and is a list
        if "data" in data and "webPages" in data["data"] and isinstance(data["data"]["webPages"]["value"], list):
            value_list = data["data"]["webPages"]["value"]
            
            # Create a list to store the tuples
            result_tuples = []

            # Extract the specific keys (displayUrl, snippet, and summary) for each element in the list
            for element in value_list:
                # Create a tuple for each element with (displayUrl, snippet, summary)
                display_url = element.get("displayUrl", "N/A")
                snippet = element.get("snippet", "N/A")
                
                # Clean the snippet (remove \n, \r, \t and extra spaces)
                snippet = re.sub(r'[\n\r\t]', '', snippet).strip()

                # Get the summary if available, and limit it to the first 500 characters
                summary_text = element.get("summary", "N/A")
                summary_text = summary_text[:500]  # Limit to the first 500 characters
                summary_text = re.sub(r'[\n\r\t]', '', summary_text).strip()
                # Add the tuple to the list
                result_tuples.append((display_url, snippet, summary_text))
                
        return result_tuples
    else:
        return {"error": f"Request failed with status code {response.status_code}", "details": response.text}

# Replace 'your_api_key_here' with your actual API key
query = "bitcoin"
search_results = web_search(query)

# Print the list of tuples (displayUrl, snippet, summary)
print(search_results)
