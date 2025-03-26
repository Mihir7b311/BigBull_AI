import ccxt
import pandas as pd
import talib
import numpy as np

# Initialize Binance exchange
exchange = ccxt.binance()

# Function to determine buy/sell signal & risk factor
def fetch_signal_risk(tkn_val, tkn_name = 'ETH/USDT'):
    symbol = tkn_name
    timeframe = '1s'  # Scalping every 1 second

    # Fetch recent price data
    ohlcv = exchange.fetch_ohlcv(symbol, timeframe, limit=120)
    data = pd.DataFrame(ohlcv, columns=['timestamp', 'open', 'high', 'low', 'close', 'volume'])
    data['timestamp'] = pd.to_datetime(data['timestamp'], unit='ms')
    data.set_index('timestamp', inplace=True)

    # Indicators
    data['EMA_5'] = talib.EMA(data['close'], timeperiod=5)
    data['EMA_10'] = talib.EMA(data['close'], timeperiod=10)
    
    macd, macdsignal, macdhist = talib.MACD(data['close'], fastperiod=6, slowperiod=13, signalperiod=4)
    data['MACD'] = macd
    data['MACD_signal'] = macdsignal
    data['MACD_Hist'] = macdhist

    fastk, fastd = talib.STOCHRSI(data['close'], timeperiod=14, fastk_period=3, fastd_period=3)
    data['StochRSI_K'] = fastk
    data['StochRSI_D'] = fastd

    # Volatility check
    data['ATR'] = talib.ATR(data['high'], data['low'], data['close'], timeperiod=14)

    # Price momentum check
    data['Momentum'] = data['close'].diff(3)

    latest = data.iloc[-1]  # Get the latest data

    # Print Debugging Info
    print(f"\nTimestamp: {latest.name}")
    print(f"Token Value: {tkn_val:.2f} | Close: {latest['close']:.2f}")
    print(f"EMA_5: {latest['EMA_5']:.2f} | EMA_10: {latest['EMA_10']:.2f}")
    print(f"MACD: {latest['MACD']:.4f} | MACD Signal: {latest['MACD_signal']:.4f} | MACD Hist: {latest['MACD_Hist']:.4f}")
    print(f"StochRSI K: {latest['StochRSI_K']:.2f} | StochRSI D: {latest['StochRSI_D']:.2f}")
    print(f"Momentum: {latest['Momentum']:.4f} | ATR: {latest['ATR']:.2f}")

    # Buy Signal (1) or Sell Signal (0)
    buy_signal = 0
    if (
        latest['EMA_5'] > latest['EMA_10'] and  # Short EMA above long EMA (bullish crossover)
        latest['Momentum'] > -0.1 and  # Avoid strictly negative momentum, allowing small fluctuations
        latest['MACD_Hist'] > 0 # MACD histogram positive (trending up)
        # 20 < latest['StochRSI_K'] < 85  # Avoid extreme zones
    ):
        buy_signal = 1
    elif (
        latest['EMA_5'] < latest['EMA_10'] or  # Short EMA below long EMA (bearish crossover)
        latest['Momentum'] < -0.1  # Strong downward momentum
    ):
        buy_signal = 0

    # Risk Factor (0 = High Risk, 1 = Low Risk)
    risk_factor = 1 if latest['ATR'] < np.mean(data['ATR']) else 0

    print(f"📊 Decision: {'BUY' if buy_signal else 'SELL'} | Risk Factor: {'LOW' if risk_factor else 'HIGH'}\n")
    
    return buy_signal, risk_factor