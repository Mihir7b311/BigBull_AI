'use client'

import { Box, Container, VStack, Heading, Text, Button, Grid, Icon, Circle, HStack, Flex, useColorModeValue, Stat, StatLabel, StatNumber, StatHelpText, StatArrow, SimpleGrid } from '@chakra-ui/react'
import { Bot, Brain, Sparkles, ArrowRight, Zap, Shield, Globe, Coins } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/Card'

export default function Home() {
  const router = useRouter()
  const gradientBg = useColorModeValue(
    'linear-gradient(to bottom, #23014d, #000000)',
    'linear-gradient(to bottom, #23014d, #000000)'
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
          <Circle size="60px" bg="purple.500" mb={4}>
            <Icon as={Bot} color="white" boxSize={6} />
          </Circle>
          <Heading
            size="2xl"
            bgGradient="linear(to-r, purple.400, blue.400)"
            bgClip="text"
            lineHeight="1.2"
            mb={4}
          >
            AI-Powered Trading on
            <br />
            MultiversX Network
          </Heading>
          <Text fontSize="xl" color="gray.400" maxW="2xl">
            Experience the future of automated trading with advanced AI algorithms
            powered by MultiversX's high-performance blockchain infrastructure.
          </Text>
          <HStack spacing={4} pt={4}>
            <Button
              size="lg"
              colorScheme="purple"
              rightIcon={<ArrowRight />}
              onClick={() => router.push('/dashboard')}
              _hover={{ transform: 'translateY(-2px)', shadow: 'lg' }}
            >
              Launch App
            </Button>
            <Button
              size="lg"
              variant="outline"
              colorScheme="purple"
              onClick={() => router.push('/docs')}
              _hover={{ transform: 'translateY(-2px)', shadow: 'lg' }}
            >
              Learn More
            </Button>
          </HStack>
        </VStack>

        {/* Stats Section */}
        <SimpleGrid columns={{ base: 2, md: 4 }} gap={8} mb={16}>
          {[
            { label: 'Total Volume', value: '$1.2B+', change: 25 },
            { label: 'Active Traders', value: '10,000+', change: 12 },
            { label: 'Avg. ROI', value: '31.5%', change: 8 },
            { label: 'Success Rate', value: '89%', change: 5 },
          ].map((stat, index) => (
            <Card key={index} bg="whiteAlpha.100" backdropFilter="blur(10px)">
              <Stat p={4}>
                <StatLabel color="gray.400">{stat.label}</StatLabel>
                <StatNumber 
                  fontSize="2xl" 
                  bgGradient="linear(to-r, purple.400, blue.400)"
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
              <Circle size="40px" bg="purple.500">
                <Icon as={Brain} color="white" boxSize={5} />
              </Circle>
              <Heading size="md">Smart Trading</Heading>
              <Text color="gray.400">
                AI-powered trading strategies optimized for maximum returns with managed risk on MultiversX.
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
              <Circle size="40px" bg="blue.500">
                <Icon as={Zap} color="white" boxSize={5} />
              </Circle>
              <Heading size="md">High Performance</Heading>
              <Text color="gray.400">
                Lightning-fast trades with MultiversX's 15,000 TPS and 6-second finality.
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
                <Icon as={Shield} color="white" boxSize={5} />
              </Circle>
              <Heading size="md">Secure & Reliable</Heading>
              <Text color="gray.400">
                Enterprise-grade security with MultiversX's Secure Proof of Stake consensus.
              </Text>
            </VStack>
          </Card>
        </Grid>

        {/* Bottom CTA */}
        <Card p={8} textAlign="center" bg="whiteAlpha.100" backdropFilter="blur(10px)">
          <VStack spacing={4}>
            <Heading size="lg">Ready to Start Trading?</Heading>
            <Text color="gray.400" maxW="2xl">
              Join thousands of traders using our AI-powered platform on MultiversX. Get started in minutes.
            </Text>
            <Button
              size="lg"
              colorScheme="purple"
              rightIcon={<ArrowRight />}
              onClick={() => router.push('/dashboard')}
              _hover={{ transform: 'translateY(-2px)', shadow: 'lg' }}
            >
              Create Your Trading Agent
            </Button>
          </VStack>
        </Card>
      </Container>
    </Box>
  )
}
