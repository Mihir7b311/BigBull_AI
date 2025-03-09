'use client'

import { useEffect, useState } from 'react'
import {
  Box,
  Container,
  Grid,
  Heading,
  Text,
  Button,
  useDisclosure,
  VStack,
  HStack,
  Icon,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Input,
  FormControl,
  FormLabel,
  NumberInput,
  NumberInputField,
  Select,
  useToast,
  Badge,
  Progress,
  Step,
  StepDescription,
  StepIcon,
  StepIndicator,
  StepNumber,
  StepSeparator,
  StepStatus,
  StepTitle,
  Stepper,
  useSteps,
  SimpleGrid,
  Image,
  Divider,
  Flex,
} from '@chakra-ui/react'
import { Plus, Bot, Wallet, Settings, TrendingUp, ArrowRight, Coins, BarChart2, Activity, TrendingDown } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { useRouter } from 'next/navigation'

interface Agent {
  id: string
  name: string
  balance: number
  status: 'UNFUNDED' | 'CONFIGURING' | 'ACTIVE' | 'PAUSED'
  performance?: {
    totalProfit: number
    roi: number
    tradesWon: number
    tradesLost: number
    sharpeRatio: number
    maxDrawdown: number
    accuracy: number
    cagrActual: number
    winRate: number
  }
  strategy?: {
    type: string
    riskLevel: string
    maxTradeSize: number
    parameters?: {
      tradingPairs?: string[]
      rebalanceThreshold?: number
      autoCompound?: boolean
      maxDrawdownLimit?: number
    }
  }
  createdAt: string
}

interface TradingPair {
  symbol: string;
  name: string;
  icon: string;
  price: number;
  change24h: number;
}

const tradingPairs: TradingPair[] = [
  { symbol: 'BTC/USDC', name: 'Bitcoin', icon: '/assets/btc.png', price: 65432.10, change24h: 2.5 },
  { symbol: 'ETH/USDC', name: 'Ethereum', icon: '/assets/eth.png', price: 3456.78, change24h: 1.8 },
  { symbol: 'STRK/USDC', name: 'Starknet', icon: '/assets/strk.png', price: 4.32, change24h: 5.2 },
]

const steps = [
  { title: 'Fund Agent', description: 'Add trading capital' },
  { title: 'Select Pairs', description: 'Choose trading pairs' },
  { title: 'Configure Strategy', description: 'Set trading parameters' },
]

export default function Dashboard() {
  const [agents, setAgents] = useState<Agent[]>([])
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { isOpen: isCreateOpen, onOpen: onCreateOpen, onClose: onCreateClose } = useDisclosure()
  const { isOpen: isConfigOpen, onOpen: onConfigOpen, onClose: onConfigClose } = useDisclosure()
  const { isOpen: isFundOpen, onOpen: onFundOpen, onClose: onFundClose } = useDisclosure()
  const [newAgentName, setNewAgentName] = useState('')
  const [fundAmount, setFundAmount] = useState('')
  const [strategy, setStrategy] = useState({
    type: '',
    riskLevel: '',
    maxTradeSize: 0
  })
  const toast = useToast()
  const router = useRouter()
  const [selectedPairs, setSelectedPairs] = useState<string[]>([])
  const { activeStep, setActiveStep } = useSteps({
    index: 0,
    count: steps.length,
  })

  useEffect(() => {
    fetchAgents()
  }, [])

  const fetchAgents = async () => {
    try {
      const response = await fetch('/api/agents')
      const data = await response.json()
      if (response.ok) {
        setAgents(data)
      } else {
        throw new Error(data.error)
      }
    } catch (error) {
      toast({
        title: 'Error fetching agents',
        description: error instanceof Error ? error.message : 'Failed to fetch agents',
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateAgent = async () => {
    if (!newAgentName.trim()) {
      toast({
        title: 'Name required',
        description: 'Please enter a name for your AI agent',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
      return
    }

    try {
      const response = await fetch('/api/agents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newAgentName,
        }),
      })

      const data = await response.json()
      if (response.ok) {
        setAgents(prev => [...prev, data])
        setSelectedAgent(data)
        onCreateClose()
        onFundOpen()
      } else {
        throw new Error(data.error)
      }
    } catch (error) {
      toast({
        title: 'Error creating agent',
        description: error instanceof Error ? error.message : 'Failed to create agent',
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    }
  }

  const handleFundAgent = async () => {
    if (!selectedAgent) return

    const amount = parseFloat(fundAmount)
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: 'Invalid amount',
        description: 'Please enter a valid funding amount',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
      return
    }

    try {
      const response = await fetch(`/api/agents/${selectedAgent.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          balance: amount,
          status: 'CONFIGURING',
        }),
      })

      const data = await response.json()
      if (response.ok) {
        setAgents(prev => prev.map(agent =>
          agent.id === selectedAgent.id ? data : agent
        ))
        onFundClose()
        onConfigOpen()
      } else {
        throw new Error(data.error)
      }
    } catch (error) {
      toast({
        title: 'Error funding agent',
        description: error instanceof Error ? error.message : 'Failed to fund agent',
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    }
  }

  const handleConfigureAgent = async () => {
    if (!selectedAgent) return

    if (!strategy.type || !strategy.riskLevel || strategy.maxTradeSize <= 0 || selectedPairs.length === 0) {
      toast({
        title: 'Invalid configuration',
        description: 'Please fill in all strategy parameters and select at least one trading pair',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
      return
    }

    try {
      const response = await fetch(`/api/agents/${selectedAgent.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: 'ACTIVE',
          strategy: {
            type: strategy.type,
            riskLevel: strategy.riskLevel,
            maxTradeSize: strategy.maxTradeSize,
          },
          tradingPairs: selectedPairs,
        }),
      })

      const data = await response.json()
      if (response.ok) {
        setAgents(prev => prev.map(agent =>
          agent.id === selectedAgent.id ? data : agent
        ))
        onConfigClose()
        router.push(`/agent/${selectedAgent.id}`)
      } else {
        throw new Error(data.error)
      }
    } catch (error) {
      toast({
        title: 'Error configuring agent',
        description: error instanceof Error ? error.message : 'Failed to configure agent',
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    }
  }

  const handlePairSelection = (symbol: string) => {
    setSelectedPairs(prev => 
      prev.includes(symbol) 
        ? prev.filter(p => p !== symbol)
        : [...prev, symbol]
    )
  }

  const handleAgentClick = (agentId: string) => {
    router.push(`/agent/${agentId}`)
  }

  const renderSetupStep = () => {
    switch (activeStep) {
      case 0:
        return (
          <VStack spacing={6} align="stretch">
            <Text>Add funds to your trading agent to start automated trading.</Text>
            <FormControl>
              <FormLabel>Amount (USDC)</FormLabel>
              <NumberInput min={0}>
                <NumberInputField
                  placeholder="Enter funding amount"
                  value={fundAmount}
                  onChange={(e) => setFundAmount(e.target.value)}
                />
              </NumberInput>
            </FormControl>
            <Button
              colorScheme="blue"
              onClick={async () => {
                await handleFundAgent()
                setActiveStep(1)
              }}
              isDisabled={!fundAmount || parseFloat(fundAmount) <= 0}
            >
              Continue
            </Button>
          </VStack>
        )

      case 1:
        return (
          <VStack spacing={6} align="stretch">
            <Text>Select the trading pairs you want your agent to trade.</Text>
            <SimpleGrid columns={3} spacing={4}>
              {tradingPairs.map((pair) => (
                <Box
                  key={pair.symbol}
                  p={4}
                  borderWidth={1}
                  borderColor={selectedPairs.includes(pair.symbol) ? 'blue.400' : 'gray.600'}
                  borderRadius="lg"
                  cursor="pointer"
                  onClick={() => handlePairSelection(pair.symbol)}
                  bg={selectedPairs.includes(pair.symbol) ? 'whiteAlpha.100' : 'transparent'}
                  _hover={{ bg: 'whiteAlpha.50' }}
                >
                  <VStack spacing={2}>
                    <HStack w="full" justify="space-between">
                      <Image src={pair.icon} alt={pair.name} boxSize="24px" />
                      <Badge colorScheme={pair.change24h >= 0 ? 'green' : 'red'}>
                        {pair.change24h}%
                      </Badge>
                    </HStack>
                    <Text fontWeight="bold">{pair.symbol}</Text>
                    <Text fontSize="sm" color="gray.400">${pair.price.toLocaleString()}</Text>
                  </VStack>
                </Box>
              ))}
            </SimpleGrid>
            <Button
              colorScheme="blue"
              onClick={() => setActiveStep(2)}
              isDisabled={selectedPairs.length === 0}
            >
              Continue
            </Button>
          </VStack>
        )

      case 2:
        return (
          <VStack spacing={6} align="stretch">
            <Text>Configure your trading strategy and risk parameters.</Text>
            <FormControl>
              <FormLabel>Strategy Type</FormLabel>
              <Select
                placeholder="Select strategy"
                value={strategy.type}
                onChange={(e) => setStrategy(prev => ({ ...prev, type: e.target.value }))}
              >
                <option value="DCA">Dollar Cost Averaging</option>
                <option value="GRID">Grid Trading</option>
                <option value="MOMENTUM">Momentum Trading</option>
              </Select>
            </FormControl>

            <FormControl>
              <FormLabel>Risk Level</FormLabel>
              <Select
                placeholder="Select risk level"
                value={strategy.riskLevel}
                onChange={(e) => setStrategy(prev => ({ ...prev, riskLevel: e.target.value }))}
              >
                <option value="LOW">Conservative</option>
                <option value="MEDIUM">Moderate</option>
                <option value="HIGH">Aggressive</option>
              </Select>
            </FormControl>

            <FormControl>
              <FormLabel>Max Trade Size (% of balance)</FormLabel>
              <NumberInput
                min={1}
                max={100}
                value={strategy.maxTradeSize}
                onChange={(value) => setStrategy(prev => ({ ...prev, maxTradeSize: parseInt(value) }))}
              >
                <NumberInputField />
              </NumberInput>
            </FormControl>

            <Button
              colorScheme="blue"
              onClick={handleConfigureAgent}
              isDisabled={!strategy.type || !strategy.riskLevel || strategy.maxTradeSize <= 0}
            >
              Start Trading
            </Button>
          </VStack>
        )

      default:
        return null
    }
  }

  return (
    <Box minH="calc(100vh - 4rem)" bg="gray.900">
      <Container maxW="7xl" py={8}>
        <HStack justify="space-between" mb={8}>
          <VStack align="start" spacing={1}>
            <Heading size="lg">AI Trading Agents</Heading>
            <Text color="gray.400">Manage and monitor your AI trading agents</Text>
          </VStack>
          <Button
            leftIcon={<Icon as={Plus} />}
            colorScheme="blue"
            onClick={onCreateOpen}
          >
            Create Agent
          </Button>
        </HStack>

        {isLoading ? (
          <Card>
            <VStack py={12}>
              <Text>Loading agents...</Text>
            </VStack>
          </Card>
        ) : agents.length === 0 ? (
          <Card>
            <VStack py={12} spacing={4}>
              <Icon as={Bot} boxSize={12} color="gray.400" />
              <Heading size="md">No Agents Created</Heading>
              <Text color="gray.400" textAlign="center" maxW="md">
                Create your first AI trading agent to start automated trading with advanced market analysis.
              </Text>
              <Button
                colorScheme="blue"
                leftIcon={<Icon as={Plus} />}
                onClick={onCreateOpen}
              >
                Create Agent
              </Button>
            </VStack>
          </Card>
        ) : (
          <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }} gap={6}>
            {agents.map(agent => (
              <Card 
                key={agent.id}
                onClick={() => handleAgentClick(agent.id)}
                cursor="pointer"
                transition="transform 0.2s"
                _hover={{
                  transform: 'translateY(-2px)',
                  boxShadow: 'xl',
                }}
              >
                <VStack align="stretch" spacing={4}>
                  <HStack justify="space-between">
                    <VStack align="start" spacing={0}>
                      <Heading size="md">{agent.name}</Heading>
                      <Text fontSize="sm" color="gray.400">
                        Created {new Date(agent.createdAt).toLocaleDateString()}
                      </Text>
                    </VStack>
                    <VStack align="end" spacing={1}>
                      <Badge
                        colorScheme={
                          agent.status === 'ACTIVE' ? 'green' :
                          agent.status === 'CONFIGURING' ? 'yellow' :
                          agent.status === 'PAUSED' ? 'orange' : 'red'
                        }
                        px={2}
                        py={1}
                      >
                        {agent.status.toLowerCase()}
                      </Badge>
                      {agent.strategy && (
                        <Badge
                          size="sm"
                          colorScheme={
                            agent.strategy.riskLevel === 'HIGH' ? 'red' :
                            agent.strategy.riskLevel === 'MEDIUM' ? 'yellow' : 'green'
                          }
                          variant="subtle"
                        >
                          {agent.strategy.riskLevel.toLowerCase()} risk
                        </Badge>
                      )}
                    </VStack>
                  </HStack>

                  <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                    <Box>
                      <Text color="gray.400" fontSize="sm">Balance</Text>
                      <Text fontSize="xl" fontWeight="bold">
                        ${agent.balance.toLocaleString()}
                      </Text>
                    </Box>
                    {agent.strategy && (
                      <Box>
                        <Text color="gray.400" fontSize="sm">Strategy</Text>
                        <HStack>
                          <Text fontSize="md" fontWeight="medium">
                            {agent.strategy.type}
                          </Text>
                          <Icon 
                            as={
                              agent.strategy.type === 'DCA' ? Coins :
                              agent.strategy.type === 'GRID' ? BarChart2 :
                              TrendingUp
                            }
                            color="blue.400"
                            size={16}
                          />
                        </HStack>
                        <Text fontSize="xs" color="gray.400">
                          Max Trade: {agent.strategy.maxTradeSize}% of balance
                        </Text>
                      </Box>
                    )}
                  </Grid>

                  {agent.status === 'ACTIVE' && agent.performance && (
                    <>
                      <Divider />
                      <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                        <Stat size="sm">
                          <StatLabel>Total Profit</StatLabel>
                          <StatNumber fontSize="md">
                            ${agent.performance.totalProfit.toLocaleString()}
                          </StatNumber>
                          <StatHelpText>
                            <StatArrow type={agent.performance.roi >= 0 ? 'increase' : 'decrease'} />
                            {agent.performance.roi}%
                          </StatHelpText>
                        </Stat>
                        <Stat size="sm">
                          <StatLabel>CAGR</StatLabel>
                          <StatNumber fontSize="md">
                            {agent.performance.cagrActual.toFixed(2)}%
                          </StatNumber>
                          <StatHelpText>
                            Compound Annual Growth
                          </StatHelpText>
                        </Stat>
                      </Grid>

                      <Grid templateColumns="repeat(3, 1fr)" gap={4}>
                        <Box>
                          <Text color="gray.400" fontSize="sm">Win Rate</Text>
                          <Text fontSize="md" fontWeight="medium">
                            {agent.performance.winRate.toFixed(1)}%
                          </Text>
                          <Text fontSize="xs" color="gray.400">
                            {agent.performance.tradesWon + agent.performance.tradesLost} trades
                          </Text>
                        </Box>
                        <Box>
                          <Text color="gray.400" fontSize="sm">Accuracy</Text>
                          <Text fontSize="md" fontWeight="medium">
                            {agent.performance.accuracy.toFixed(1)}%
                          </Text>
                        </Box>
                        <Box>
                          <Text color="gray.400" fontSize="sm">Drawdown</Text>
                          <Text 
                            fontSize="md" 
                            fontWeight="medium"
                            color={agent.performance.maxDrawdown > 15 ? 'red.400' : 'inherit'}
                          >
                            {agent.performance.maxDrawdown}%
                          </Text>
                        </Box>
                      </Grid>

                      <Box bg="whiteAlpha.50" p={2} rounded="md">
                        <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                          <HStack>
                            <Icon as={TrendingUp} color="blue.400" />
                            <Box>
                              <Text fontSize="sm">Sharpe Ratio</Text>
                              <Text fontSize="sm" fontWeight="bold">
                                {agent.performance.sharpeRatio.toFixed(2)}
                              </Text>
                            </Box>
                          </HStack>
                          <HStack>
                            <Icon as={Activity} color="blue.400" />
                            <Box>
                              <Text fontSize="sm">Risk Score</Text>
                              <Text 
                                fontSize="sm" 
                                fontWeight="bold"
                                color={
                                  agent.performance.sharpeRatio > 2 ? 'green.400' :
                                  agent.performance.sharpeRatio > 1 ? 'yellow.400' : 'red.400'
                                }
                              >
                                {agent.performance.sharpeRatio > 2 ? 'Low' :
                                 agent.performance.sharpeRatio > 1 ? 'Medium' : 'High'}
                              </Text>
                            </Box>
                          </HStack>
                        </Grid>
                      </Box>

                      {agent.strategy?.parameters?.tradingPairs && (
                        <Box>
                          <Text color="gray.400" fontSize="sm" mb={2}>Trading Pairs</Text>
                          <Flex gap={2} flexWrap="wrap">
                            {agent.strategy.parameters.tradingPairs.map((pair: string) => (
                              <Badge 
                                key={pair} 
                                colorScheme="blue" 
                                variant="subtle"
                                px={2}
                                py={1}
                                rounded="md"
                              >
                                {pair}
                              </Badge>
                            ))}
                          </Flex>
                        </Box>
                      )}

                      {agent.strategy?.parameters && (
                        <Box bg="whiteAlpha.50" p={2} rounded="md">
                          <Text color="gray.400" fontSize="sm" mb={2}>Strategy Settings</Text>
                          <Grid templateColumns="repeat(2, 1fr)" gap={2}>
                            <HStack>
                              <Icon as={Settings} size={12} />
                              <Text fontSize="xs">
                                Rebalance: {agent.strategy.parameters.rebalanceThreshold || 5}%
                              </Text>
                            </HStack>
                            <HStack>
                              <Icon as={TrendingDown} size={12} />
                              <Text fontSize="xs">
                                Max DD: {agent.strategy.parameters.maxDrawdownLimit || 25}%
                              </Text>
                            </HStack>
                          </Grid>
                        </Box>
                      )}

                      <HStack justify="space-between" color="gray.400" fontSize="sm">
                        <Text>View Trading Interface</Text>
                        <Icon as={ArrowRight} size={16} />
                      </HStack>
                    </>
                  )}

                  {agent.status === 'UNFUNDED' && (
                    <Button
                      leftIcon={<Icon as={Wallet} />}
                      colorScheme="green"
                      onClick={(e) => {
                        e.stopPropagation()
                        setSelectedAgent(agent)
                        onFundOpen()
                      }}
                    >
                      Fund Agent
                    </Button>
                  )}

                  {agent.status === 'CONFIGURING' && (
                    <Button
                      leftIcon={<Icon as={Settings} />}
                      colorScheme="yellow"
                      onClick={(e) => {
                        e.stopPropagation()
                        setSelectedAgent(agent)
                        onConfigOpen()
                      }}
                    >
                      Configure Strategy
                    </Button>
                  )}
                </VStack>
              </Card>
            ))}
          </Grid>
        )}

        {/* Create Agent Modal */}
        <Modal isOpen={isCreateOpen} onClose={onCreateClose}>
          <ModalOverlay backdropFilter="blur(4px)" />
          <ModalContent bg="gray.800">
            <ModalHeader>Create AI Trading Agent</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              <FormControl>
                <FormLabel>Agent Name</FormLabel>
                <Input
                  placeholder="Enter agent name"
                  value={newAgentName}
                  onChange={(e) => setNewAgentName(e.target.value)}
                />
              </FormControl>
              <Button
                mt={6}
                colorScheme="blue"
                width="full"
                onClick={handleCreateAgent}
              >
                Create Agent
              </Button>
            </ModalBody>
          </ModalContent>
        </Modal>

        {/* Replace the Fund and Configure modals with this new Setup Modal */}
        <Modal 
          isOpen={isFundOpen || isConfigOpen} 
          onClose={() => {
            onFundClose()
            onConfigClose()
            setActiveStep(0)
          }}
          size="2xl"
        >
          <ModalOverlay backdropFilter="blur(4px)" />
          <ModalContent bg="gray.800">
            <ModalHeader>
              <VStack align="stretch" spacing={6}>
                <Heading size="md">Setup Your Trading Agent</Heading>
                <Stepper size="sm" index={activeStep} gap="0">
                  {steps.map((step, index) => (
                    <Step key={index}>
                      <StepIndicator>
                        <StepStatus
                          complete={<Icon as={index === 0 ? Wallet : index === 1 ? Coins : BarChart2} />}
                          incomplete={<StepNumber />}
                          active={<StepNumber />}
                        />
                      </StepIndicator>
                      <Box flexShrink="0">
                        <StepTitle>{step.title}</StepTitle>
                        <StepDescription>{step.description}</StepDescription>
                      </Box>
                      <StepSeparator />
                    </Step>
                  ))}
                </Stepper>
              </VStack>
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              {renderSetupStep()}
            </ModalBody>
          </ModalContent>
        </Modal>
      </Container>
    </Box>
  )
} 