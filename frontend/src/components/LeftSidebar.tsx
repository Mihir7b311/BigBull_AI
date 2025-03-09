'use client'

import { useState } from 'react'
import {
  Box,
  VStack,
  HStack,
  Text,
  Heading,
  Icon,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Progress,
  Tabs,
  TabList,
  TabPanels,
  TabPanel,
  Tab,
  Select,
  Button,
  Flex,
  Divider,
} from '@chakra-ui/react'
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Clock,
  Activity,
  AlertCircle,
  ChevronDown,
  BarChart2,
  Layers,
  RefreshCw,
} from 'lucide-react'
import { Card } from '@/components/ui/Card'

// Mock market data - Replace with real API calls
const mockMarketData = {
  pairs: [
    {
      symbol: 'ETH/USDC',
      price: 3245.50,
      change24h: 5.2,
      volume: '125M',
      trend: 'up',
    },
    {
      symbol: 'BTC/USDC',
      price: 65420.00,
      change24h: -2.1,
      volume: '450M',
      trend: 'down',
    },
    {
      symbol: 'STRK/USDC',
      price: 4.32,
      change24h: 12.5,
      volume: '25M',
      trend: 'up',
    },
  ],
  marketIndicators: {
    rsi: 62,
    macd: 'bullish',
    volume: 'increasing',
    support: 3150,
    resistance: 3400,
  },
  orderBook: {
    asks: [
      { price: 3250, size: 12.5 },
      { price: 3255, size: 8.2 },
      { price: 3260, size: 15.0 },
    ],
    bids: [
      { price: 3240, size: 10.0 },
      { price: 3235, size: 5.5 },
      { price: 3230, size: 20.0 },
    ],
  },
}

const mockTechnicalAnalysis = {
  shortTerm: {
    signal: 'BUY',
    confidence: 85,
    indicators: {
      rsi: { value: 62, signal: 'neutral' },
      macd: { value: 'positive', signal: 'buy' },
      ma: { value: 'above', signal: 'buy' },
    },
  },
  mediumTerm: {
    signal: 'STRONG_BUY',
    confidence: 92,
    indicators: {
      trend: { value: 'upward', signal: 'buy' },
      momentum: { value: 'increasing', signal: 'buy' },
      volatility: { value: 'low', signal: 'neutral' },
    },
  },
}

export default function LeftSidebar() {
  const [selectedPair, setSelectedPair] = useState('ETH/USDC')
  const [timeframe, setTimeframe] = useState('1H')

  const SignalIndicator = ({ signal, confidence }: { signal: string; confidence: number }) => (
    <Card>
      <VStack spacing={2} align="start">
        <HStack justify="space-between" w="full">
          <Badge
            colorScheme={
              signal.includes('BUY') ? 'green' :
              signal.includes('SELL') ? 'red' : 'yellow'
            }
            fontSize="sm"
            px={2}
            py={1}
          >
            {signal}
          </Badge>
          <Text fontSize="sm" color="gray.400">
            {confidence}% Confidence
          </Text>
        </HStack>
        <Progress
          value={confidence}
          colorScheme={confidence > 80 ? 'green' : confidence > 60 ? 'yellow' : 'red'}
          w="full"
          size="sm"
          rounded="full"
        />
      </VStack>
    </Card>
  )

  return (
    <VStack h="full" spacing={4} p={4} align="stretch">
      {/* Market Pair Selection */}
              <HStack justify="space-between">
                <Select
                  value={selectedPair}
                  onChange={(e) => setSelectedPair(e.target.value)}
                  variant="filled"
                  bg="whiteAlpha.50"
                  size="sm"
                  maxW="150px"
                >
                  {mockMarketData.pairs.map(pair => (
                    <option key={pair.symbol} value={pair.symbol}>
                      {pair.symbol}
                    </option>
                  ))}
                </Select>
                <Select
                  value={timeframe}
                  onChange={(e) => setTimeframe(e.target.value)}
                  variant="filled"
                  bg="whiteAlpha.50"
                  size="sm"
                  maxW="100px"
                >
                  <option value="5M">5M</option>
                  <option value="15M">15M</option>
                  <option value="1H">1H</option>
                  <option value="4H">4H</option>
                  <option value="1D">1D</option>
                </Select>
              </HStack>

      {/* Current Price Info */}
              <Card>
                <VStack align="start" spacing={2}>
                  <Text color="gray.400" fontSize="sm">Current Price</Text>
                  <HStack justify="space-between" w="full">
                    <Heading size="lg">
                      ${mockMarketData.pairs[0].price.toLocaleString()}
                    </Heading>
                    <Badge
                      colorScheme={mockMarketData.pairs[0].change24h >= 0 ? 'green' : 'red'}
                      fontSize="sm"
                      display="flex"
                      alignItems="center"
                      px={2}
                      py={1}
                    >
                      <Icon
                        as={mockMarketData.pairs[0].change24h >= 0 ? TrendingUp : TrendingDown}
                        mr={1}
                      />
                      {Math.abs(mockMarketData.pairs[0].change24h)}%
                    </Badge>
                  </HStack>
                  <HStack fontSize="sm" color="gray.400">
                    <Icon as={Activity} size={4} />
                    <Text>Volume: {mockMarketData.pairs[0].volume}</Text>
                  </HStack>
                </VStack>
              </Card>

      {/* Technical Analysis */}
      <Tabs variant="soft-rounded" colorScheme="blue" size="sm">
        <TabList>
          <Tab>Analysis</Tab>
          <Tab>Order Book</Tab>
        </TabList>
        <TabPanels>
          <TabPanel px={0}>
            <VStack spacing={4}>
              <Card w="full">
                <VStack align="start" spacing={3} w="full">
                  <Heading size="sm">Short Term</Heading>
                  <SignalIndicator
                    signal={mockTechnicalAnalysis.shortTerm.signal}
                    confidence={mockTechnicalAnalysis.shortTerm.confidence}
                  />
                  <Divider />
                  <VStack align="start" spacing={2} w="full">
                    {Object.entries(mockTechnicalAnalysis.shortTerm.indicators).map(([key, value]) => (
                      <HStack key={key} justify="space-between" w="full">
                        <Text fontSize="sm" textTransform="capitalize">{key}</Text>
                        <Badge
                          colorScheme={
                            value.signal === 'buy' ? 'green' :
                            value.signal === 'sell' ? 'red' : 'yellow'
                          }
                        >
                          {value.value}
                        </Badge>
                      </HStack>
                    ))}
                  </VStack>
                </VStack>
              </Card>

              <Card w="full">
                <VStack align="start" spacing={3} w="full">
                  <Heading size="sm">Medium Term</Heading>
                  <SignalIndicator
                    signal={mockTechnicalAnalysis.mediumTerm.signal}
                    confidence={mockTechnicalAnalysis.mediumTerm.confidence}
                  />
                  <Divider />
                  <VStack align="start" spacing={2} w="full">
                    {Object.entries(mockTechnicalAnalysis.mediumTerm.indicators).map(([key, value]) => (
                      <HStack key={key} justify="space-between" w="full">
                        <Text fontSize="sm" textTransform="capitalize">{key}</Text>
                        <Badge
                          colorScheme={
                            value.signal === 'buy' ? 'green' :
                            value.signal === 'sell' ? 'red' : 'yellow'
                          }
                        >
                          {value.value}
                        </Badge>
                      </HStack>
                    ))}
                  </VStack>
                </VStack>
              </Card>
            </VStack>
          </TabPanel>
          <TabPanel px={0}>
            <VStack spacing={4}>
              <Card w="full">
                <VStack align="start" spacing={3} w="full">
                  <HStack justify="space-between" w="full">
                    <Heading size="sm">Asks</Heading>
                    <Text color="red.400" fontSize="sm">Sell Orders</Text>
                  </HStack>
                  <Table size="sm" variant="simple">
                    <Thead>
                      <Tr>
                        <Th>Price</Th>
                        <Th isNumeric>Size</Th>
                        <Th isNumeric>Total</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {mockMarketData.orderBook.asks.map((order, i) => (
                        <Tr key={i}>
                          <Td color="red.400">${order.price}</Td>
                          <Td isNumeric>{order.size}</Td>
                          <Td isNumeric>${(order.price * order.size).toLocaleString()}</Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </VStack>
              </Card>

              <Card w="full">
                <VStack align="start" spacing={3} w="full">
                  <HStack justify="space-between" w="full">
                    <Heading size="sm">Bids</Heading>
                    <Text color="green.400" fontSize="sm">Buy Orders</Text>
                  </HStack>
                  <Table size="sm" variant="simple">
                    <Thead>
                      <Tr>
                        <Th>Price</Th>
                        <Th isNumeric>Size</Th>
                        <Th isNumeric>Total</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {mockMarketData.orderBook.bids.map((order, i) => (
                        <Tr key={i}>
                          <Td color="green.400">${order.price}</Td>
                          <Td isNumeric>{order.size}</Td>
                          <Td isNumeric>${(order.price * order.size).toLocaleString()}</Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </VStack>
              </Card>
            </VStack>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </VStack>
  )
}