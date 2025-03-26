import json
from difflib import SequenceMatcher

# Function to compute the fuzzy match score based on character matching
def fuzzy_match_score(query, text):
    return SequenceMatcher(None, query.lower(), text.lower()).ratio()

# Function to fetch data based on the query string
def fetch_data(query_string):
    json_path = 'PlugIns/accepted_tokens.json'
    # Load the JSON data from the given path
    with open(json_path, 'r') as file:
        data = json.load(file)

    # Set to store exact matches (to avoid duplicates)
    exact_matches = set()

    # List to store fuzzy match results with their scores
    fuzzy_results = []

    # Loop through each token in the data
    for token in data.get('tokens', []):
        # Check if query_string is included in any of the fields (exact match)
        for key, value in token.items():
            if isinstance(value, str) and query_string.lower() in value.lower():
                exact_matches.add(frozenset(token.items()))  # Add token as a frozenset (immutable)
                break  # No need to check other fields if match found

        # If no exact match, calculate fuzzy scores for all fields
        if frozenset(token.items()) not in exact_matches:
            score = 0
            for key, value in token.items():
                if isinstance(value, str):
                    score += fuzzy_match_score(query_string, value)  # Add score based on string match
            # Store the token along with its score (using frozenset for immutability)
            fuzzy_results.append((frozenset(token.items()), score))

    # Sort the fuzzy results by score in descending order
    fuzzy_results.sort(key=lambda x: x[1], reverse=True)

    # Collect the top 5 results or those with the same score as the 5th one
    top_results = []
    if exact_matches:
        top_results.extend(list(exact_matches))  # Add exact matches first

    # Add top 5 fuzzy results (or more if there are ties)
    if len(fuzzy_results) > 0:
        # Find the score of the 5th position or higher
        threshold_score = fuzzy_results[4][1] if len(fuzzy_results) >= 5 else fuzzy_results[-1][1]
        for token, score in fuzzy_results:
            if score >= threshold_score:
                top_results.append(token)

    # Return the top 5 (or more if tied) results
    return [dict(token) for token in top_results]
