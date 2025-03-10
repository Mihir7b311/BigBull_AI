'use client'

import { useEffect, useRef, useState } from 'react'
import { createChart, ColorType, CrosshairMode, Time, SeriesMarkerShape } from 'lightweight-charts'
import type { 
  IChartApi, 
  DeepPartial, 
  ChartOptions, 
  SeriesOptionsCommon, 
  ISeriesApi, 
  LineData, 
  SeriesMarker,
  SeriesMarkerPosition 
} from 'lightweight-charts'
import {
  Box,
  Flex,
  Grid,
  GridItem,
  Heading,
  Text,
  Badge,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Divider,
  VStack,
  HStack,
  Icon,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  ButtonGroup,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Circle,
  useColorModeValue,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  useToast,
  Progress,
} from '@chakra-ui/react'
import { 
  Activity, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Clock, 
  AlertCircle, 
  ChevronDown,
  MessageCircle,
  Brain,
  Target,
  BarChart2,
  RefreshCw,
  Timer,
  AlertTriangle,
} from 'lucide-react'
import { TradeState } from '@/types'
import useInterval from '@/hooks/useInterval'

interface TradingViewProps {
  tradeState: TradeState
}

interface TradeSignal {
  type: 'BUY' | 'SELL'
  amount: number
  price: number
  timestamp: Date
  fees: number
  reason: string
}

interface PriceData {
  open: number
  high: number
  low: number
  close: number
  volume: number
  datetime: string
}

const historicalPrices: PriceData[] = [
  { open: 82.15, high: 83.20, low: 81.85, close: 82.95, volume: 15899, datetime: '2024-03-20 00:00:00' },
  { open: 82.95, high: 83.50, low: 82.75, close: 83.25, volume: 12646, datetime: '2024-03-20 00:15:00' },
  { open: 83.25, high: 83.85, low: 83.10, close: 83.65, volume: 13352, datetime: '2024-03-20 00:30:00' },
  { open: 83.65, high: 84.10, low: 83.45, close: 83.90, volume: 14323, datetime: '2024-03-20 00:45:00' },
  { open: 83.90, high: 84.25, low: 83.70, close: 84.15, volume: 11957, datetime: '2024-03-20 01:00:00' },
  { open: 84.15, high: 84.50, low: 83.95, close: 84.30, volume: 10614, datetime: '2024-03-20 01:15:00' },
  { open: 84.30, high: 84.75, low: 84.10, close: 84.55, volume: 12742, datetime: '2024-03-20 01:30:00' },
  { open: 84.55, high: 85.00, low: 84.35, close: 84.80, volume: 13874, datetime: '2024-03-20 01:45:00' },
  { open: 84.80, high: 85.25, low: 84.60, close: 85.05, volume: 14233, datetime: '2024-03-20 02:00:00' },
  { open: 85.05, high: 85.50, low: 84.85, close: 85.30, volume: 15572, datetime: '2024-03-20 02:15:00' },
  { open: 85.30, high: 85.75, low: 85.10, close: 85.55, volume: 16555, datetime: '2024-03-20 02:30:00' },
  { open: 85.55, high: 86.00, low: 85.35, close: 85.80, volume: 17793, datetime: '2024-03-20 02:45:00' },
  { open: 85.80, high: 86.25, low: 85.60, close: 86.05, volume: 18392, datetime: '2024-03-20 03:00:00' },
  { open: 86.05, high: 86.50, low: 85.85, close: 86.30, volume: 19986, datetime: '2024-03-20 03:15:00' },
  { open: 86.30, high: 86.75, low: 86.10, close: 86.55, volume: 20377, datetime: '2024-03-20 03:30:00' }
];

const getRandomPricePoint = () => {
  const randomIndex = Math.floor(Math.random() * historicalPrices.length);
  return historicalPrices[randomIndex];
};

const calculatePriceChange = (currentData: PriceData, nextData: PriceData) => {
  // Calculate base change from historical data
  const baseChange = (nextData.close - currentData.close) / currentData.close;
  
  // Add volume-weighted volatility with reduced randomness for more stability
  const volumeFactor = Math.min(nextData.volume / currentData.volume, 1.5);
  const volatilityRange = Math.abs(nextData.high - nextData.low) / nextData.low;
  
  // Smaller random factor for more stable price movement
  const randomFactor = (Math.random() * 0.001 - 0.0005) * volumeFactor * volatilityRange;
  
  return baseChange + randomFactor;
};

const TradingView = ({ tradeState }: TradingViewProps) => {
  const chartContainerRef = useRef<HTMLDivElement>(null)
  const chart = useRef<IChartApi | null>(null)
  const [timeframe, setTimeframe] = useState('1m')
  const [tradeSignals, setTradeSignals] = useState<TradeSignal[]>([])
  const [currentStrategy, setCurrentStrategy] = useState(tradeState.strategy)
  const [isChangingStrategy, setIsChangingStrategy] = useState(false)
  const [consecutiveLosses, setConsecutiveLosses] = useState(0)
  const [profitLossThreshold] = useState(-100)
  const [recentProfitLoss, setRecentProfitLoss] = useState(0)
  const [totalProfitLoss, setTotalProfitLoss] = useState(0)
  const [volatility, setVolatility] = useState(0)
  const [sessionTime, setSessionTime] = useState(60)
  const [isActive, setIsActive] = useState(true)
  const [marketCondition, setMarketCondition] = useState<'BULLISH' | 'BEARISH' | 'NEUTRAL'>('NEUTRAL')
  const [currentPrice, setCurrentPrice] = useState(historicalPrices[0].close)
  const [priceHistory, setPriceHistory] = useState<number[]>([historicalPrices[0].close])
  const [currentPriceIndex, setCurrentPriceIndex] = useState(0)
  const toast = useToast()
  const [realPrice, setRealPrice] = useState<number | null>(null)

  // Strategy parameters
  const [strategyParams, setStrategyParams] = useState({
    dca: {
      interval: 5,
      amount: tradeState.amount / 10,
      lastBuy: 0,
    },
    grid: {
      upperBound: 0.2463, // ~4% above initial price
      lowerBound: 0.2263, // ~4% below initial price
      gridLines: 5,
      gridSpacing: 0.005, // 0.005 USDC spacing between grid lines
    },
    momentum: {
      lookbackPeriod: 10,
      threshold: 0.5,
      trendStrength: 0,
    }
  })

  // Session timer with 2-minute limit
  useEffect(() => {
    const timer = setInterval(() => {
      if (isActive) {
        setSessionTime(prev => {
          if (prev <= 1) {
            setIsActive(false)
            clearInterval(timer)
            toast({
              title: 'Session Ended',
              description: `Final P/L: $${totalProfitLoss.toFixed(2)} (${((totalProfitLoss / (tradeState.amount * currentPrice)) * 100).toFixed(2)}%)`,
              status: totalProfitLoss >= 0 ? 'success' : 'warning',
              duration: 5000,
              isClosable: true,
            })
            return 0
          }
          return prev - 1
        })
      }
    }, 1000)
    return () => clearInterval(timer)
  }, [isActive, totalProfitLoss, tradeState.amount, currentPrice])

  // Fetch real EGLD price from Binance
  useEffect(() => {
    const fetchRealPrice = async () => {
      try {
        const response = await fetch('https://api.binance.com/api/v3/ticker/price?symbol=EGLDUSDT')
        const data = await response.json()
        setRealPrice(parseFloat(data.price))
        setCurrentPrice(parseFloat(data.price))
      } catch (error) {
        console.error('Error fetching EGLD price:', error)
      }
    }

    fetchRealPrice()
    const priceInterval = setInterval(fetchRealPrice, 10000) // Update every 10 seconds

    return () => clearInterval(priceInterval)
  }, [])

  // Initialize TradingView widget
  useEffect(() => {
    if (!chartContainerRef.current) return

    const script = document.createElement('script')
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js'
    script.type = 'text/javascript'
    script.async = true
    script.innerHTML = `
      {
        "width": "100%",
        "height": "100%",
        "symbol": "BINANCE:EGLDUSDT",
        "interval": "1",
        "timezone": "Etc/UTC",
        "theme": "dark",
        "style": "1",
        "locale": "en",
        "toolbar_bg": "#f1f3f6",
        "enable_publishing": false,
        "allow_symbol_change": false,
        "container_id": "tradingview_chart",
        "hide_top_toolbar": false,
        "hide_legend": false,
        "save_image": false,
        "studies": [
          "Volume@tv-basicstudies"
        ],
        "show_popup_button": true,
        "popup_width": "1000",
        "popup_height": "650",
        "support_host": "https://www.tradingview.com"
      }`

    chartContainerRef.current.innerHTML = ''
    const container = document.createElement('div')
    container.id = 'tradingview_chart'
    container.className = 'tradingview-widget-container'
    container.style.height = '100%'
    container.style.width = '100%'
    
    chartContainerRef.current.appendChild(container)
    container.appendChild(script)

    return () => {
      if (chartContainerRef.current) {
        chartContainerRef.current.innerHTML = ''
      }
    }
  }, [])

  // Format time as HH:MM:SS
  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
  }

  // Initialize and update chart
  useEffect(() => {
    if (!chartContainerRef.current) return

    const chartOptions: DeepPartial<ChartOptions> = {
      layout: {
        background: { color: 'rgba(17, 24, 39, 0.5)' },
        textColor: '#d1d5db',
      },
      grid: {
        vertLines: { color: 'rgba(255, 255, 255, 0.1)' },
        horzLines: { color: 'rgba(255, 255, 255, 0.1)' },
      },
      crosshair: {
        mode: CrosshairMode.Normal,
      },
      rightPriceScale: {
        borderColor: 'rgba(255, 255, 255, 0.1)',
        autoScale: true,
        scaleMargins: {
          top: 0.2,
          bottom: 0.2,
        },
      },
      timeScale: {
        borderColor: 'rgba(255, 255, 255, 0.1)',
        timeVisible: true,
        secondsVisible: true,
      },
    }

    chart.current = createChart(chartContainerRef.current, chartOptions)

    // Add main EGLD price line
    const mainSeries = chart.current.addLineSeries({
      color: '#3b82f6',
      lineWidth: 2,
      title: 'EGLD Price',
      priceLineVisible: true,
      lastValueVisible: true,
      crosshairMarkerVisible: true,
      priceFormat: {
        type: 'price',
        precision: 2,
        minMove: 0.01,
      },
    })

    // Add price data
    const baseTime = Math.floor(new Date().getTime() / 1000)
    const priceData = historicalPrices.map((price, index) => ({
      time: (baseTime - (historicalPrices.length - index)) as Time,
      value: price.close,
    }))
    mainSeries.setData(priceData)

    // Add larger and more visible buy/sell markers
    if (tradeSignals.length > 0) {
      const markers = tradeSignals.map((signal: TradeSignal) => ({
        time: signal.timestamp.getTime() / 1000 as Time,
        position: signal.type === 'BUY' ? 'belowBar' : 'aboveBar' as SeriesMarkerPosition,
        color: signal.type === 'BUY' ? '#22c55e' : '#ef4444',
        shape: 'circle' as SeriesMarkerShape,
        text: signal.type === 'BUY' ? 'BUY' : 'SELL',
        size: 3,
      }))
      mainSeries.setMarkers(markers)
    }

    // Resize handler
    const handleResize = () => {
      if (chart.current && chartContainerRef.current) {
        chart.current.applyOptions({
          width: chartContainerRef.current.clientWidth,
          height: chartContainerRef.current.clientHeight,
        })
      }
    }

    window.addEventListener('resize', handleResize)
    handleResize()

    return () => {
      window.removeEventListener('resize', handleResize)
      if (chart.current) {
        chart.current.remove()
      }
    }
  }, [tradeSignals, priceHistory])

  // Modify the price simulation to show clear signals
  useEffect(() => {
    if (!isActive) return

    const priceInterval = setInterval(() => {
      // Get next price point from historical data
      const nextPrice = historicalPrices[currentPriceIndex].close
      
      // Update price and related states
      setCurrentPrice(nextPrice)
      setPriceHistory(prev => [...prev.slice(-100), nextPrice])
      setCurrentPriceIndex((prevIndex) => (prevIndex + 1) % historicalPrices.length)

      // Generate trading signals based on price movement
      const prevPrice = currentPrice
      if (nextPrice > prevPrice * 1.005) { // 0.5% increase - Buy signal
        executeOrder(
          'BUY',
          tradeState.amount * 0.1,
          nextPrice,
          '🟢 Buy Signal Executed'
        )
        toast({
          title: 'Buy Order Executed',
          description: `Bought EGLD at $${nextPrice.toFixed(2)}`,
          status: 'success',
          duration: 3000,
          isClosable: true,
          position: 'top-right'
        })
        setMarketCondition('BULLISH')
      } else if (nextPrice < prevPrice * 0.995) { // 0.5% decrease - Sell signal
        executeOrder(
          'SELL',
          tradeState.amount * 0.1,
          nextPrice,
          '🔴 Sell Signal Executed'
        )
      }
    }, 1000)

    return () => clearInterval(priceInterval)
  }, [isActive, currentPrice, currentPriceIndex, tradeState.amount])

  // Execute trading strategies
  useInterval(() => {
    if (!isActive || !currentPrice) return
    
    // Check for strategy change based on performance
    if (consecutiveLosses >= 3 && !isChangingStrategy) {
      setIsChangingStrategy(true)
      const newStrategy = currentStrategy === 'DCA' ? 'Grid Trading' : 
                         currentStrategy === 'Grid Trading' ? 'Momentum' : 'DCA'
      setCurrentStrategy(newStrategy)
      toast({
        title: 'Strategy Change',
        description: `Switching to ${newStrategy} due to market conditions`,
        status: 'info',
        duration: 3000,
        isClosable: true,
      })
      setTimeout(() => setIsChangingStrategy(false), 2000)
    }
    
    switch (currentStrategy) {
      case 'DCA':
        executeDCAStrategy()
        break
      case 'Grid Trading':
        executeGridStrategy()
        break
      case 'Momentum':
        executeMomentumStrategy()
        break
    }
  }, 2000)

  const executeDCAStrategy = () => {
    const { interval, amount, lastBuy } = strategyParams.dca
    if (sessionTime - lastBuy >= interval) {
      const buyAmount = amount * (1 + (Math.random() - 0.5) * 0.2) // Vary amount by ±10%
      executeOrder('BUY', buyAmount, currentPrice, 'DCA scheduled buy')
      setStrategyParams(prev => ({
        ...prev,
        dca: { ...prev.dca, lastBuy: sessionTime }
      }))
    }
  }

  const executeGridStrategy = () => {
    const { upperBound, lowerBound, gridSpacing } = strategyParams.grid
    const gridLevels = []
    for (let price = lowerBound; price <= upperBound; price += gridSpacing) {
      gridLevels.push(price)
    }

    const closestLevel = gridLevels.reduce((prev, curr) => 
      Math.abs(curr - currentPrice) < Math.abs(prev - currentPrice) ? curr : prev
    )

    if (currentPrice > closestLevel + gridSpacing * 0.5) {
      executeOrder('SELL', tradeState.amount * 0.1, currentPrice, 'Grid level sell')
    } else if (currentPrice < closestLevel - gridSpacing * 0.5) {
      executeOrder('BUY', tradeState.amount * 0.1, currentPrice, 'Grid level buy')
    }
  }

  const executeMomentumStrategy = () => {
    const { lookbackPeriod, threshold } = strategyParams.momentum
    if (priceHistory.length < lookbackPeriod) return

    const prices = priceHistory.slice(-lookbackPeriod)
    const returns = prices.map((price, i) => 
      i === 0 ? 0 : (price - prices[i-1]) / prices[i-1]
    )
    const momentum = returns.reduce((a, b) => a + b, 0) / lookbackPeriod

    setStrategyParams(prev => ({
      ...prev,
      momentum: { ...prev.momentum, trendStrength: momentum }
    }))

    if (momentum > threshold) {
      executeOrder('BUY', tradeState.amount * 0.2, currentPrice, 'Strong upward momentum')
    } else if (momentum < -threshold) {
      executeOrder('SELL', tradeState.amount * 0.2, currentPrice, 'Strong downward momentum')
    }
  }

  const executeOrder = (type: 'BUY' | 'SELL', amount: number, price: number, reason: string) => {
    const fees = amount * price * 0.001 // 0.1% fee
    const newTrade = {
      type,
      amount,
      price,
      timestamp: new Date(),
      fees,
      reason,
    }

    setTradeSignals(prev => [...prev, newTrade])
    const profitLoss = type === 'SELL' ? amount * price * 0.99 : -amount * price * 1.01
    setTotalProfitLoss(prev => prev + profitLoss)
    setRecentProfitLoss(profitLoss)

    if (profitLoss < 0) {
      setConsecutiveLosses(prev => prev + 1)
    } else {
      setConsecutiveLosses(0)
    }

    toast({
      title: `${type} Order Executed`,
      description: `${type === 'BUY' ? 'Bought' : 'Sold'} ${amount.toFixed(4)} ${tradeState.selectedToken} @ $${price.toFixed(4)}`,
      status: type === 'BUY' ? 'success' : 'warning',
      duration: 3000,
      isClosable: true,
    })
  }

  return (
    <Box h="80vh" p={4}>
      <Grid templateColumns="1fr 300px" gap={4} h="100%">
        <GridItem>
          <VStack h="100%" spacing={4}>
            {/* Session Info */}
            <HStack w="100%" justify="space-between" bg="whiteAlpha.100" p={3} rounded="lg">
              <HStack>
                <Icon as={Clock} />
                <Text>Real EGLD Price: </Text>
                <Text 
                  color="blue.400"
                  fontWeight="bold"
                  fontSize="lg"
                >
                  ${realPrice ? realPrice.toFixed(4) : 'Loading...'}
                </Text>
              </HStack>
              <Badge
                colorScheme={
                  marketCondition === 'BULLISH' ? 'green' :
                  marketCondition === 'BEARISH' ? 'red' : 'gray'
                }
                display="flex"
                alignItems="center"
                gap={1}
              >
                <Icon as={marketCondition === 'BULLISH' ? TrendingUp : 
                         marketCondition === 'BEARISH' ? TrendingDown : Activity} size={14} />
                {marketCondition}
              </Badge>
            </HStack>

            {/* TradingView Chart */}
            <Box w="100%" h="calc(100% - 100px)" ref={chartContainerRef} />
          </VStack>
        </GridItem>

        {/* Trading Info */}
        <GridItem>
          <VStack spacing={4} h="100%" bg="whiteAlpha.50" p={4} rounded="lg" overflowY="auto">
            <Heading size="md">EGLD Trading Dashboard</Heading>
            
            {/* Session Status */}
            <Alert 
              status={isActive ? 'info' : 'warning'} 
              variant="subtle" 
              rounded="lg"
            >
              <AlertIcon />
              <Box>
                <AlertTitle>
                  {isActive ? 'Session Active' : 'Session Ended'}
                </AlertTitle>
                <AlertDescription>
                  {isActive 
                    ? `Trading will end in ${formatTime(sessionTime)}`
                    : 'Trading session has ended'
                  }
                </AlertDescription>
              </Box>
            </Alert>

            {/* Current Price */}
            <Box 
              bg="whiteAlpha.100" 
              p={4} 
              rounded="xl" 
              borderWidth="1px" 
              borderColor="whiteAlpha.200"
              w="100%"
            >
              <Flex justify="space-between" align="center" mb={2}>
                <HStack>
                  <Icon as={DollarSign} color="blue.400" boxSize={5} />
                  <Text fontSize="sm" color="gray.400">Current Price</Text>
                </HStack>
                <Badge 
                  colorScheme={recentProfitLoss >= 0 ? 'green' : 'red'}
                  variant="subtle"
                  px={2}
                  py={1}
                  rounded="md"
                >
                  {(volatility * 100).toFixed(2)}% Volatility
                </Badge>
              </Flex>
              <Heading size="2xl" bgGradient="linear(to-r, blue.400, purple.400)" bgClip="text">
                ${currentPrice.toFixed(4)}
              </Heading>
              <Text fontSize="sm" color="gray.400" mt={1}>
                EGLD/USDC
              </Text>
            </Box>

            {/* Total P/L */}
            <Box 
              bg="whiteAlpha.100" 
              p={4} 
              rounded="xl" 
              borderWidth="1px" 
              borderColor={totalProfitLoss >= 0 ? 'green.400' : 'red.400'}
              w="100%"
              position="relative"
              overflow="hidden"
            >
              <Box
                position="absolute"
                top={0}
                left={0}
                right={0}
                bottom={0}
                bg={totalProfitLoss >= 0 ? 'green.400' : 'red.400'}
                opacity={0.1}
              />
              <Flex justify="space-between" align="center" mb={2}>
                <HStack>
                  <Icon 
                    as={totalProfitLoss >= 0 ? TrendingUp : TrendingDown} 
                    color={totalProfitLoss >= 0 ? 'green.400' : 'red.400'} 
                    boxSize={5} 
                  />
                  <Text fontSize="sm" color="gray.400">Total Profit/Loss</Text>
                </HStack>
                <Badge 
                  colorScheme={totalProfitLoss >= 0 ? 'green' : 'red'}
                  variant="solid"
                  px={2}
                  py={1}
                  rounded="md"
                >
                  {((totalProfitLoss / (tradeState.amount * currentPrice)) * 100).toFixed(2)}%
                </Badge>
              </Flex>
              <Heading 
                size="2xl" 
                color={totalProfitLoss >= 0 ? 'green.400' : 'red.400'}
                display="flex"
                alignItems="center"
                gap={2}
              >
                <Icon 
                  as={totalProfitLoss >= 0 ? TrendingUp : TrendingDown} 
                  color={totalProfitLoss >= 0 ? 'green.400' : 'red.400'} 
                />
                ${Math.abs(totalProfitLoss).toFixed(4)}
              </Heading>
              <Text fontSize="sm" color="gray.400" mt={1}>
                Session {isActive ? 'Active' : 'Ended'}
              </Text>
            </Box>

            {/* Strategy Info */}
            <VStack align="stretch" w="100%" spacing={3}>
              <Heading size="sm">Active Strategy</Heading>
              <HStack bg="whiteAlpha.100" p={3} rounded="lg">
                <Icon as={
                  currentStrategy === 'DCA' ? Target :
                  currentStrategy === 'Grid Trading' ? BarChart2 : Brain
                } />
                <Text>{currentStrategy}</Text>
              </HStack>
            </VStack>

            {/* Orders Tab */}
            <VStack align="stretch" w="100%" spacing={3}>
              <Heading size="sm">Recent Orders</Heading>
              <Box 
                bg="whiteAlpha.100" 
                rounded="lg" 
                p={2}
                maxH="300px"
                overflowY="auto"
                css={{
                  '&::-webkit-scrollbar': {
                    width: '4px',
                  },
                  '&::-webkit-scrollbar-track': {
                    width: '6px',
                  },
                  '&::-webkit-scrollbar-thumb': {
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '24px',
                  },
                }}
              >
                <Table size="sm" variant="unstyled">
                  <Thead>
                    <Tr>
                      <Th color="gray.400">Type</Th>
                      <Th color="gray.400">Amount</Th>
                      <Th color="gray.400" isNumeric>Price</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {tradeSignals.slice().reverse().map((trade, index) => (
                      <Tr key={index} bg={index % 2 === 0 ? 'whiteAlpha.50' : 'transparent'}>
                        <Td>
                          <Badge
                            colorScheme={trade.type === 'BUY' ? 'green' : 'red'}
                            variant="solid"
                          >
                            {trade.type}
                          </Badge>
                        </Td>
                        <Td>{trade.amount.toFixed(4)}</Td>
                        <Td isNumeric>${trade.price.toFixed(4)}</Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </Box>
            </VStack>

            {/* Manual Trading Controls */}
            <VStack align="stretch" w="100%" spacing={3}>
              <Heading size="sm">Manual Trading</Heading>
              <Grid templateColumns="repeat(2, 1fr)" gap={2}>
                <Button
                  colorScheme="green"
                  leftIcon={<Icon as={TrendingUp} />}
                  onClick={() => executeOrder('BUY', tradeState.amount * 0.1, currentPrice, 'Manual buy')}
                >
                  Buy
                </Button>
                <Button
                  colorScheme="red"
                  leftIcon={<Icon as={TrendingDown} />}
                  onClick={() => executeOrder('SELL', tradeState.amount * 0.1, currentPrice, 'Manual sell')}
                >
                  Sell
                </Button>
              </Grid>
            </VStack>
          </VStack>
        </GridItem>
      </Grid>
    </Box>
  )
}

export default TradingView