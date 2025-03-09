'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import {
  Box,
  Grid,
  GridItem,
  VStack,
  HStack,
  Heading,
  Text,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Tabs,
  TabList,
  TabPanels,
  TabPanel,
  Tab,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Progress,
  Button,
  Icon,
  useColorModeValue,
  Divider,
} from '@chakra-ui/react'
import {
  TrendingUp,
  TrendingDown,
  AlertCircle,
  Clock,
  Activity,
  DollarSign,
  BarChart2,
  Target,
  Percent,
  Award,
  Zap,
} from 'lucide-react'
import { Card } from '@/components/ui/Card'
import LeftSidebar from '@/components/LeftSidebar'
import RightSidebar from '@/components/RightSidebar'
import ChatInterface from '@/components/ChatInterface'

// Mock data - Replace with actual API calls
const mockPerformance = {
  currentValue: 15420.50,
  investedValue: 10000,
  totalProfit: 5420.50,
  roi: 54.2,
  tradesWon: 45,
  tradesLost: 12,
  totalTrades: 57,
  cagrTarget: 25,
  cagrActual: 28.5,
  accuracy: 78.9,
  sharpeRatio: 2.1,
  maxDrawdown: 12.5,
  winRate: 78.9,
}

const mockTradingCalls = [
  {
    id: '1',
    type: 'BUY',
    symbol: 'ETH',
    price: 3245.50,
    confidence: 0.85,
    status: 'PENDING',
    timestamp: new Date(),
    reason: 'Strong bullish momentum detected with RSI crossover',
  },
  // Add more mock calls
]

const mockRecentTrades = [
  {
    id: '1',
    type: 'SELL',
    symbol: 'BTC',
    amount: 0.25,
    price: 65420,
    profit: 1250.50,
    status: 'EXECUTED',
    timestamp: new Date(),
  },
  // Add more mock trades
]

export default function AgentInterface() {
  const params = useParams()
  const agentId = params.id
  const [activeTab, setActiveTab] = useState(0)

  const StatCard = ({ title, value, change, icon, color }: any) => (
    <Card>
      <HStack spacing={4}>
        <Box
          p={3}
          bg={`${color}.500`}
          rounded="lg"
          color="white"
        >
          <Icon as={icon} boxSize={6} />
        </Box>
        <VStack align="start" spacing={0}>
          <Text color="gray.400" fontSize="sm">{title}</Text>
          <Text fontSize="2xl" fontWeight="bold">{value}</Text>
          {change && (
            <HStack color={change >= 0 ? 'green.400' : 'red.400'} fontSize="sm">
              <Icon as={change >= 0 ? TrendingUp : TrendingDown} boxSize={4} />
              <Text>{Math.abs(change)}%</Text>
            </HStack>
          )}
        </VStack>
      </HStack>
    </Card>
  )

  return (
    <Box h="calc(100vh - 4rem)" position="fixed" top="4rem" left="0" right="0" bottom="0">
      <Grid
        templateColumns="320px 1fr 320px"
        templateRows="auto 1fr"
        h="full"
        gap={0}
      >
        {/* Top Stats Bar */}
        <GridItem colSpan={3} bg="gray.800" p={4} borderBottom="1px" borderColor="gray.700">
          <Grid templateColumns="repeat(6, 1fr)" gap={4}>
            <StatCard
              title="Portfolio Value"
              value={`$${mockPerformance.currentValue.toLocaleString()}`}
              change={mockPerformance.roi}
              icon={DollarSign}
              color="blue"
            />
            <StatCard
              title="Total Profit"
              value={`$${mockPerformance.totalProfit.toLocaleString()}`}
              change={mockPerformance.roi}
              icon={TrendingUp}
              color="green"
            />
            <StatCard
              title="CAGR"
              value={`${mockPerformance.cagrActual}%`}
              change={mockPerformance.cagrActual - mockPerformance.cagrTarget}
              icon={Target}
              color="purple"
            />
            <StatCard
              title="Win Rate"
              value={`${mockPerformance.winRate}%`}
              icon={Award}
              color="yellow"
            />
            <StatCard
              title="Accuracy"
              value={`${mockPerformance.accuracy}%`}
              icon={Zap}
              color="cyan"
            />
            <StatCard
              title="Sharpe Ratio"
              value={mockPerformance.sharpeRatio.toFixed(2)}
              icon={BarChart2}
              color="pink"
            />
          </Grid>
        </GridItem>

        {/* Left Sidebar - Market Data */}
        <GridItem bg="gray.900" borderRight="1px" borderColor="gray.700" overflowY="auto">
          <LeftSidebar />
        </GridItem>

        {/* Main Content - Chat & Trading Interface */}
        <GridItem bg="gray.900" position="relative">
          <VStack h="full" spacing={0}>
            {/* Trading Calls & Activity */}
            <Box w="full" p={4} borderBottom="1px" borderColor="gray.700">
              <Tabs variant="soft-rounded" colorScheme="blue" size="sm">
                <TabList>
                  <Tab>Trading Calls</Tab>
                  <Tab>Recent Activity</Tab>
                  <Tab>Performance</Tab>
                </TabList>
                <TabPanels>
                  <TabPanel>
                    <VStack spacing={4}>
                      {mockTradingCalls.map(call => (
                        <Card key={call.id} w="full">
                          <HStack justify="space-between">
                            <VStack align="start" spacing={1}>
                              <HStack>
                                <Badge
                                  colorScheme={call.type === 'BUY' ? 'green' : 'red'}
                                >
                                  {call.type}
                                </Badge>
                                <Text fontWeight="bold">{call.symbol}</Text>
                                <Text color="gray.400">@ ${call.price}</Text>
                              </HStack>
                              <Text fontSize="sm" color="gray.400">
                                {call.reason}
                              </Text>
                            </VStack>
                            <VStack align="end" spacing={1}>
                              <Badge
                                colorScheme={
                                  call.confidence > 0.8 ? 'green' :
                                  call.confidence > 0.6 ? 'yellow' : 'red'
                                }
                              >
                                {(call.confidence * 100).toFixed(0)}% Confidence
                              </Badge>
                              <Text fontSize="xs" color="gray.400">
                                {call.timestamp.toLocaleTimeString()}
                              </Text>
                            </VStack>
                          </HStack>
                        </Card>
                      ))}
                    </VStack>
                  </TabPanel>
                  <TabPanel>
                    <Table variant="simple" size="sm">
                      <Thead>
                        <Tr>
                          <Th>Type</Th>
                          <Th>Symbol</Th>
                          <Th>Amount</Th>
                          <Th>Price</Th>
                          <Th>P/L</Th>
                          <Th>Time</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {mockRecentTrades.map(trade => (
                          <Tr key={trade.id}>
                            <Td>
                              <Badge
                                colorScheme={trade.type === 'BUY' ? 'green' : 'red'}
                              >
                                {trade.type}
                              </Badge>
                            </Td>
                            <Td>{trade.symbol}</Td>
                            <Td>{trade.amount}</Td>
                            <Td>${trade.price.toLocaleString()}</Td>
                            <Td>
                              <Text
                                color={trade.profit >= 0 ? 'green.400' : 'red.400'}
                              >
                                ${Math.abs(trade.profit).toLocaleString()}
                              </Text>
                            </Td>
                            <Td>{trade.timestamp.toLocaleTimeString()}</Td>
                          </Tr>
                        ))}
                      </Tbody>
                    </Table>
                  </TabPanel>
                  <TabPanel>
                    <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                      <Card>
                        <VStack align="start" spacing={4} w="full">
                          <Heading size="sm">Risk Metrics</Heading>
                          <Box w="full">
                            <Text fontSize="sm" mb={1}>Sharpe Ratio</Text>
                            <Progress
                              value={(mockPerformance.sharpeRatio / 3) * 100}
                              colorScheme="blue"
                              rounded="full"
                            />
                          </Box>
                          <Box w="full">
                            <Text fontSize="sm" mb={1}>Max Drawdown</Text>
                            <Progress
                              value={mockPerformance.maxDrawdown}
                              colorScheme="red"
                              rounded="full"
                            />
                          </Box>
                        </VStack>
                      </Card>
                      <Card>
                        <VStack align="start" spacing={4} w="full">
                          <Heading size="sm">Trading Performance</Heading>
                          <Box w="full">
                            <Text fontSize="sm" mb={1}>Win Rate</Text>
                            <Progress
                              value={mockPerformance.winRate}
                              colorScheme="green"
                              rounded="full"
                            />
                          </Box>
                          <Box w="full">
                            <Text fontSize="sm" mb={1}>Accuracy</Text>
                            <Progress
                              value={mockPerformance.accuracy}
                              colorScheme="yellow"
                              rounded="full"
                            />
                          </Box>
                        </VStack>
                      </Card>
                    </Grid>
                  </TabPanel>
                </TabPanels>
              </Tabs>
            </Box>

            {/* Chat Interface */}
            <Box flex={1} overflowY="auto">
              <ChatInterface />
            </Box>
          </VStack>
        </GridItem>

        {/* Right Sidebar - Portfolio & Settings */}
        <GridItem bg="gray.900" borderLeft="1px" borderColor="gray.700" overflowY="auto">
          <RightSidebar />
        </GridItem>
      </Grid>
    </Box>
  )
} 