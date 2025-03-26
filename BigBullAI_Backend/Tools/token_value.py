import requests

def get_ethereum_price():
    """Fetches the latest Ethereum price from Binance API and returns it once."""
    url = "https://api.binance.com/api/v3/ticker/price?symbol=ETHUSDT"
    response = requests.get(url)
    
    if response.status_code == 200:
        data = response.json()
        return float(data["price"])
    else:
        return f"Error: {response.status_code}"
    
def get_electronic_gold_price():
    """Fetches the latest Ethereum price from Binance API and returns it once."""
    url = "https://api.binance.com/api/v3/ticker/price?symbol=EGLDUSDT"
    response = requests.get(url)
    
    if response.status_code == 200:
        data = response.json()
        return float(data["price"])
    else:
        return f"Error: {response.status_code}"
    
# print(get_electronic_gold_price())
# print(get_ethereum_price())


# def get_all_binance_tokens():
#     """Fetches all available tokens (symbols) on Binance."""
#     url = "https://api.binance.com/api/v3/exchangeInfo"
#     response = requests.get(url)

#     if response.status_code == 200:
#         data = response.json()
#         symbols = [symbol['symbol'] for symbol in data['symbols']]
#         return symbols
#     else:
#         return f"Error: {response.status_code}"

# # Example usage:
# tokens = get_all_binance_tokens()
# print(f"Total Trading Pairs: {len(tokens)}")
# print(tokens)