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
} from '@chakra-ui/react'
import { Plus, Bot, Wallet, Settings, TrendingUp, ArrowRight } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { useRouter } from 'next/navigation'
import { useAccount } from '@starknet-react/core'

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
  }
  strategy?: {
    type: string
    riskLevel: string
    maxTradeSize: number
  }
}

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
  const { address } = useAccount()

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

    if (!address) {
      toast({
        title: 'Wallet not connected',
        description: 'Please connect your wallet to create an agent',
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
          userId: address,
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

    if (!strategy.type || !strategy.riskLevel || strategy.maxTradeSize <= 0) {
      toast({
        title: 'Invalid configuration',
        description: 'Please fill in all strategy parameters',
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
              <Card key={agent.id}>
                <VStack align="stretch" spacing={4}>
                  <HStack justify="space-between">
                    <Heading size="md">{agent.name}</Heading>
                    <Badge
                      colorScheme={
                        agent.status === 'ACTIVE' ? 'green' :
                        agent.status === 'CONFIGURING' ? 'yellow' :
                        agent.status === 'PAUSED' ? 'orange' : 'red'
                      }
                    >
                      {agent.status.toLowerCase()}
                    </Badge>
                  </HStack>

                  <Box>
                    <Text color="gray.400" fontSize="sm">Balance</Text>
                    <Text fontSize="xl" fontWeight="bold">
                      ${agent.balance.toLocaleString()}
                    </Text>
                  </Box>

                  {agent.status === 'ACTIVE' && agent.performance && (
                    <>
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
                          <StatLabel>Win Rate</StatLabel>
                          <StatNumber fontSize="md">
                            {((agent.performance.tradesWon / (agent.performance.tradesWon + agent.performance.tradesLost)) * 100).toFixed(1)}%
                          </StatNumber>
                          <StatHelpText>
                            {agent.performance.tradesWon + agent.performance.tradesLost} trades
                          </StatHelpText>
                        </Stat>
                      </Grid>

                      <Button
                        colorScheme="blue"
                        variant="outline"
                        rightIcon={<Icon as={ArrowRight} />}
                        onClick={() => router.push(`/agent/${agent.id}`)}
                      >
                        View Trading Interface
                      </Button>
                    </>
                  )}

                  {agent.status === 'UNFUNDED' && (
                    <Button
                      leftIcon={<Icon as={Wallet} />}
                      colorScheme="green"
                      onClick={() => {
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
                      onClick={() => {
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

        {/* Fund Agent Modal */}
        <Modal isOpen={isFundOpen} onClose={onFundClose}>
          <ModalOverlay backdropFilter="blur(4px)" />
          <ModalContent bg="gray.800">
            <ModalHeader>Fund Your Agent</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
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
                mt={6}
                colorScheme="blue"
                width="full"
                onClick={handleFundAgent}
              >
                Fund Agent
              </Button>
            </ModalBody>
          </ModalContent>
        </Modal>

        {/* Configure Strategy Modal */}
        <Modal isOpen={isConfigOpen} onClose={onConfigClose}>
          <ModalOverlay backdropFilter="blur(4px)" />
          <ModalContent bg="gray.800">
            <ModalHeader>Configure Trading Strategy</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              <VStack spacing={4}>
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
              </VStack>

              <Button
                mt={6}
                colorScheme="blue"
                width="full"
                onClick={handleConfigureAgent}
              >
                Start Trading
              </Button>
            </ModalBody>
          </ModalContent>
        </Modal>
      </Container>
    </Box>
  )
} 