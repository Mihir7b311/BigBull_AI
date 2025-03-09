'use client'

import { useState } from 'react'
import {
  Box,
  VStack,
  HStack,
  Text,
  Heading,
  Icon,
  Button,
  Progress,
  Divider,
  Badge,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Switch,
  FormControl,
  FormLabel,
  Select,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Tooltip,
  useToast,
} from '@chakra-ui/react'
import {
  Settings,
  Bell,
  Shield,
  Sliders,
} from 'lucide-react'
import { Card } from '@/components/ui/Card'

interface Holding {
  symbol: string
  amount: number
  value: number
  allocation: number
  profit: number
  profitPercent: number
}

interface Portfolio {
  holdings: Holding[]
  totalValue: number
  totalProfit: number
  profitPercent: number
}

type NotificationSettings = {
  tradeExecuted: boolean
  priceAlerts: boolean
  riskWarnings: boolean
}

type RiskManagementSettings = {
  stopLoss: number
  takeProfit: number
  maxTradeSize: number
  leverageLimit: number
}

type DCASettings = {
  enabled: boolean
  interval: 'HOURLY' | 'DAILY' | 'WEEKLY' | 'MONTHLY'
  amount: number
}

type AutomationSettings = {
  rebalancing: boolean
  rebalanceThreshold: number
  autoCompound: boolean
  dca: DCASettings
}

interface AgentSettings {
  notifications: NotificationSettings
  riskManagement: RiskManagementSettings
  automation: AutomationSettings
}

const mockPortfolio: Portfolio = {
  holdings: [
    {
      symbol: 'ETH',
      amount: 2.5,
      value: 8113.75,
      allocation: 52.6,
      profit: 1250.50,
      profitPercent: 18.2,
    },
    {
      symbol: 'BTC',
      amount: 0.15,
      value: 9813.00,
      allocation: 47.4,
      profit: -320.25,
      profitPercent: -3.2,
    },
  ],
  totalValue: 17926.75,
  totalProfit: 930.25,
  profitPercent: 5.5,
}

const mockSettings: AgentSettings = {
  notifications: {
    tradeExecuted: true,
    priceAlerts: true,
    riskWarnings: true,
  },
  riskManagement: {
    stopLoss: 5,
    takeProfit: 15,
    maxTradeSize: 10,
    leverageLimit: 2,
  },
  automation: {
    rebalancing: true,
    rebalanceThreshold: 5,
    autoCompound: true,
    dca: {
      enabled: true,
      interval: 'DAILY',
      amount: 100,
    },
  },
}

export default function RightSidebar() {
  const [settings, setSettings] = useState<AgentSettings>(mockSettings)
  const toast = useToast()

  const handleSettingChange = <T extends keyof AgentSettings>(
    category: T,
    setting: keyof AgentSettings[T],
    value: any
  ) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: value,
      },
    }))

    toast({
      title: 'Setting updated',
      description: `${String(setting)} has been updated successfully`,
      status: 'success',
      duration: 3000,
      isClosable: true,
    })
  }

  return (
    <VStack h="full" spacing={4} p={4} align="stretch">
      {/* Portfolio Summary */}
      <Card>
        <VStack align="start" spacing={3} w="full">
          <HStack justify="space-between" w="full">
            <Heading size="sm">Portfolio</Heading>
            <Badge colorScheme="blue">Auto-trading</Badge>
          </HStack>
          
          <Stat>
            <StatLabel color="gray.400">Total Value</StatLabel>
            <StatNumber>${mockPortfolio.totalValue.toLocaleString()}</StatNumber>
            <StatHelpText>
              <StatArrow type={mockPortfolio.totalProfit >= 0 ? 'increase' : 'decrease'} />
              ${Math.abs(mockPortfolio.totalProfit).toLocaleString()} ({mockPortfolio.profitPercent}%)
            </StatHelpText>
          </Stat>

          <Divider />

          <VStack spacing={3} w="full">
            {mockPortfolio.holdings.map((holding: Holding) => (
              <Box key={holding.symbol} w="full">
                <HStack justify="space-between" mb={1}>
                  <HStack>
                    <Text fontWeight="medium">{holding.symbol}</Text>
                    <Text color="gray.400" fontSize="sm">
                      {holding.amount} {holding.symbol}
                    </Text>
                  </HStack>
                  <Text fontWeight="medium">
                    ${holding.value.toLocaleString()}
                  </Text>
                </HStack>
                <Progress
                  value={holding.allocation}
                  colorScheme="blue"
                  size="sm"
                  rounded="full"
                />
                <HStack justify="space-between" mt={1}>
                  <Text color="gray.400" fontSize="sm">
                    {holding.allocation}% of portfolio
                  </Text>
                  <Text
                    fontSize="sm"
                    color={holding.profit >= 0 ? 'green.400' : 'red.400'}
                  >
                    {holding.profit >= 0 ? '+' : ''}
                    {holding.profitPercent}%
                  </Text>
                </HStack>
              </Box>
            ))}
          </VStack>
        </VStack>
      </Card>

      {/* Agent Settings */}
      <Card>
        <VStack align="start" spacing={4} w="full">
          <HStack justify="space-between" w="full">
            <Heading size="sm">Agent Settings</Heading>
            <Icon as={Settings} color="gray.400" />
          </HStack>

          {/* Notifications */}
          <Box w="full">
            <HStack mb={2}>
              <Icon as={Bell} color="blue.400" boxSize={4} />
              <Text fontWeight="medium">Notifications</Text>
            </HStack>
            <VStack align="start" spacing={2}>
              {(Object.entries(settings.notifications) as [keyof NotificationSettings, boolean][]).map(([key, value]) => (
                <FormControl key={key} display="flex" alignItems="center">
                  <FormLabel mb="0" fontSize="sm">
                    {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                  </FormLabel>
                  <Switch
                    isChecked={value}
                    onChange={(e) => handleSettingChange('notifications', key, e.target.checked)}
                    colorScheme="blue"
                  />
                </FormControl>
              ))}
            </VStack>
          </Box>

          <Divider />

          {/* Risk Management */}
          <Box w="full">
            <HStack mb={2}>
              <Icon as={Shield} color="blue.400" boxSize={4} />
              <Text fontWeight="medium">Risk Management</Text>
            </HStack>
            <VStack align="start" spacing={3}>
              {(Object.entries(settings.riskManagement) as [keyof RiskManagementSettings, number][]).map(([key, value]) => (
                <FormControl key={key}>
                  <FormLabel fontSize="sm">
                    {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                  </FormLabel>
                  <NumberInput
                    value={value}
                    onChange={(valueString) => handleSettingChange('riskManagement', key, parseFloat(valueString))}
                    min={0}
                    max={key === 'leverageLimit' ? 10 : 100}
                  >
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                </FormControl>
              ))}
            </VStack>
          </Box>

          <Divider />

          {/* Automation */}
          <Box w="full">
            <HStack mb={2}>
              <Icon as={Sliders} color="blue.400" boxSize={4} />
              <Text fontWeight="medium">Automation</Text>
            </HStack>
            <VStack align="start" spacing={3}>
              <FormControl display="flex" alignItems="center">
                <FormLabel mb="0" fontSize="sm">
                  Auto-rebalancing
                </FormLabel>
                <Switch
                  isChecked={settings.automation.rebalancing}
                  onChange={(e) => handleSettingChange('automation', 'rebalancing', e.target.checked)}
                  colorScheme="blue"
                />
              </FormControl>

              {settings.automation.rebalancing && (
                <FormControl>
                  <FormLabel fontSize="sm">Rebalance Threshold (%)</FormLabel>
                  <NumberInput
                    value={settings.automation.rebalanceThreshold}
                    onChange={(value) => handleSettingChange('automation', 'rebalanceThreshold', parseFloat(value))}
                    min={1}
                    max={20}
                  >
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                </FormControl>
              )}

              <FormControl display="flex" alignItems="center">
                <FormLabel mb="0" fontSize="sm">
                  Auto-compound Profits
                </FormLabel>
                <Switch
                  isChecked={settings.automation.autoCompound}
                  onChange={(e) => handleSettingChange('automation', 'autoCompound', e.target.checked)}
                  colorScheme="blue"
                />
              </FormControl>

              <FormControl display="flex" alignItems="center">
                <FormLabel mb="0" fontSize="sm">
                  DCA Strategy
                </FormLabel>
                <Switch
                  isChecked={settings.automation.dca.enabled}
                  onChange={(e) => handleSettingChange('automation', 'dca', {
                    ...settings.automation.dca,
                    enabled: e.target.checked,
                  })}
                  colorScheme="blue"
                />
              </FormControl>

              {settings.automation.dca.enabled && (
                <>
                  <FormControl>
                    <FormLabel fontSize="sm">DCA Interval</FormLabel>
                    <Select
                      value={settings.automation.dca.interval}
                      onChange={(e) => handleSettingChange('automation', 'dca', {
                        ...settings.automation.dca,
                        interval: e.target.value as 'HOURLY' | 'DAILY' | 'WEEKLY' | 'MONTHLY',
                      })}
                      size="sm"
                    >
                      <option value="HOURLY">Hourly</option>
                      <option value="DAILY">Daily</option>
                      <option value="WEEKLY">Weekly</option>
                      <option value="MONTHLY">Monthly</option>
                    </Select>
                  </FormControl>

                  <FormControl>
                    <FormLabel fontSize="sm">DCA Amount ($)</FormLabel>
                    <NumberInput
                      value={settings.automation.dca.amount}
                      onChange={(value) => handleSettingChange('automation', 'dca', {
                        ...settings.automation.dca,
                        amount: parseFloat(value),
                      })}
                      min={10}
                    >
                      <NumberInputField />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                  </FormControl>
                </>
              )}
            </VStack>
          </Box>
        </VStack>
      </Card>
    </VStack>
  )
} 