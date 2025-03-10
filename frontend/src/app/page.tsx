'use client'

import { Box, Container, VStack, Heading, Text, Button, Grid, Icon, Circle, HStack, Flex, useColorModeValue, Stat, StatLabel, StatNumber, StatHelpText, StatArrow, SimpleGrid } from '@chakra-ui/react'
import { TrendingUp, LineChart, Brain, ArrowRight, Zap, Shield, Briefcase, Target } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/Card'
import logo from "../../public/logo.jpg"
export default function Home() {
  const router = useRouter()
  const gradientBg = useColorModeValue(
    'linear-gradient(to bottom, #003566, #000814)',
    'linear-gradient(to bottom, #003566, #000814)'
  )

  return (
    <Box minH="100vh" bg="gray.900" position="relative" overflow="hidden">
      {/* Background gradient overlay */}
      <Box
        position="absolute"
        top={0}
        left={0}
        right={0}
        bottom={0}
        bgGradient={gradientBg}
        opacity={0.9}
      />

      {/* Content */}
      <Container maxW="7xl" py={20} position="relative" zIndex={1}>
        {/* Hero Section */}
        <VStack spacing={8} textAlign="center" mb={16}>
          <Box width="200px" height="200px" mb={4}>
            <img src={logo.src} alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          </Box>
          <Heading
            size="2xl"
            bgGradient="linear(to-r, blue.400, green.400)"
            bgClip="text"
            lineHeight="1.2"
            mb={4}
          >
            Intelligent Stock Trading
            <br />
            Powered by AI
          </Heading>
          <Text fontSize="xl" color="gray.300" maxW="2xl">
            Harness the power of artificial intelligence to make smarter investment decisions. 
            Big Bull AI analyzes market trends and predicts opportunities with unmatched precision.
          </Text>
          <HStack spacing={4} pt={4}>
            <Button
              size="lg"
              colorScheme="blue"
              rightIcon={<ArrowRight />}
              onClick={() => router.push('/dashboard')}
              _hover={{ transform: 'translateY(-2px)', shadow: 'lg' }}
            >
              Start Trading
            </Button>
            <Button
              size="lg"
              variant="outline"
              colorScheme="blue"
              onClick={() => router.push('https://bigbull-ai.gitbook.io/bigbull_ai/')}
              _hover={{ transform: 'translateY(-2px)', shadow: 'lg' }}
            >
              See How It Works
            </Button>
          </HStack>
        </VStack>

        {/* Stats Section */}
        <SimpleGrid columns={{ base: 2, md: 4 }} gap={8} mb={16}>
          {[
            { label: 'Assets Under Management', value: '$3.8B+', change: 32 },
            { label: 'Daily Active Traders', value: '25,000+', change: 18 },
            { label: 'Yearly Returns', value: '27.3%', change: 14 },
            { label: 'Prediction Accuracy', value: '93%', change: 7 },
          ].map((stat, index) => (
            <Card key={index} bg="whiteAlpha.100" backdropFilter="blur(10px)">
              <Stat p={4}>
                <StatLabel color="gray.400">{stat.label}</StatLabel>
                <StatNumber 
                  fontSize="2xl" 
                  bgGradient="linear(to-r, blue.400, green.400)"
                  bgClip="text"
                >
                  {stat.value}
                </StatNumber>
                <StatHelpText>
                  <StatArrow type="increase" />
                  {stat.change}%
                </StatHelpText>
              </Stat>
            </Card>
          ))}
        </SimpleGrid>

        {/* Features Grid */}
        <Grid templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap={8} mb={16}>
          <Card
            _hover={{
              transform: 'translateY(-8px)',
              transition: 'transform 0.3s ease-in-out',
            }}
          >
            <VStack spacing={4} align="start" p={6}>
              <Circle size="40px" bg="blue.600">
                <Icon as={Brain} color="white" boxSize={5} />
              </Circle>
              <Heading size="md">Predictive Analytics</Heading>
              <Text color="gray.400">
                Leverage deep learning algorithms that analyze millions of data points to predict market movements.
              </Text>
            </VStack>
          </Card>

          <Card
            _hover={{
              transform: 'translateY(-8px)',
              transition: 'transform 0.3s ease-in-out',
            }}
          >
            <VStack spacing={4} align="start" p={6}>
              <Circle size="40px" bg="green.500">
                <Icon as={Briefcase} color="white" boxSize={5} />
              </Circle>
              <Heading size="md">Portfolio Optimization</Heading>
              <Text color="gray.400">
                Automatically balance your investments for optimal risk-adjusted returns based on your preferences.
              </Text>
            </VStack>
          </Card>

          <Card
            _hover={{
              transform: 'translateY(-8px)',
              transition: 'transform 0.3s ease-in-out',
            }}
          >
            <VStack spacing={4} align="start" p={6}>
              <Circle size="40px" bg="cyan.500">
                <Icon as={LineChart} color="white" boxSize={5} />
              </Circle>
              <Heading size="md">Real-Time Insights</Heading>
              <Text color="gray.400">
                Receive actionable trading signals and market insights delivered instantly to your dashboard.
              </Text>
            </VStack>
          </Card>
        </Grid>

        {/* Middle Section */}
        <Box mb={16}>
          <Grid templateColumns={{ base: '1fr', lg: '1fr 1fr' }} gap={8}>
            <Card p={8} bg="whiteAlpha.100" backdropFilter="blur(10px)">
              <VStack align="start" spacing={4}>
                <Heading size="lg" bgGradient="linear(to-r, blue.400, green.400)" bgClip="text">
                  Why Choose Big Bull AI?
                </Heading>
                <Grid templateColumns="1fr 1fr" gap={4} width="100%">
                  {[
                    { icon: Zap, text: "Lightning-fast execution" },
                    { icon: Shield, text: "Bank-grade security" },
                    { icon: Target, text: "Personalized strategies" },
                    { icon: TrendingUp, text: "Market-beating returns" }
                  ].map((item, idx) => (
                    <HStack key={idx} spacing={2}>
                      <Icon as={item.icon} color="blue.400" />
                      <Text color="gray.300">{item.text}</Text>
                    </HStack>
                  ))}
                </Grid>
                <Text color="gray.400" pt={2}>
                  Our proprietary AI trading models have consistently outperformed market indices by an average of 15% annually.
                </Text>
              </VStack>
            </Card>
            
            <Card p={8} bg="whiteAlpha.100" backdropFilter="blur(10px)">
              <VStack align="start" spacing={4}>
                <Heading size="lg" bgGradient="linear(to-r, blue.400, green.400)" bgClip="text">
                  How It Works
                </Heading>
                <VStack align="start" spacing={3} width="100%">
                  {[
                    { number: "01", text: "Connect your brokerage account or start with a paper trading account" },
                    { number: "02", text: "Set your investment goals and risk tolerance" },
                    { number: "03", text: "Let our AI build an optimized strategy for your portfolio" },
                    { number: "04", text: "Review AI recommendations and approve trades" }
                  ].map((step, idx) => (
                    <HStack key={idx} spacing={4}>
                      <Circle size="30px" bg="blue.600">
                        <Text color="white" fontWeight="bold" fontSize="sm">{step.number}</Text>
                      </Circle>
                      <Text color="gray.300">{step.text}</Text>
                    </HStack>
                  ))}
                </VStack>
              </VStack>
            </Card>
          </Grid>
        </Box>

        {/* Bottom CTA */}
        <Card p={8} textAlign="center" bg="whiteAlpha.100" backdropFilter="blur(10px)">
          <VStack spacing={4}>
            <Heading size="lg">Ready to Revolutionize Your Trading?</Heading>
            <Text color="gray.300" maxW="2xl">
              Join thousands of investors who have already transformed their trading results with Big Bull AI's cutting-edge technology.
            </Text>
            <HStack spacing={4}>
              <Button
                size="lg"
                colorScheme="blue"
                rightIcon={<ArrowRight />}
                onClick={() => router.push('/signup')}
                _hover={{ transform: 'translateY(-2px)', shadow: 'lg' }}
              >
                Start Free Trial
              </Button>
              <Button
                size="lg"
                variant="ghost"
                colorScheme="blue"
                onClick={() => router.push('/demo')}
              >
                Watch Demo
              </Button>
            </HStack>
          </VStack>
        </Card>
      </Container>
    </Box>
  )
}