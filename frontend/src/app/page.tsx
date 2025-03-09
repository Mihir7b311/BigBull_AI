'use client'

import { Box, Container, VStack, Heading, Text, Button, Grid, Icon, Circle } from '@chakra-ui/react'
import { Bot, Brain, Sparkles, ArrowRight } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/Card'

export default function Home() {
  const router = useRouter()

  return (
    <Box minH="calc(100vh - 4rem)" bg="gray.900">
      <Container maxW="7xl" py={20}>
        {/* Hero Section */}
        <VStack spacing={8} textAlign="center" mb={16}>
          <Heading
            size="2xl"
            bgGradient="linear(to-r, blue.400, purple.400)"
            bgClip="text"
            lineHeight="1.2"
          >
            AI-Powered Trading on Starknet
          </Heading>
          <Text fontSize="xl" color="gray.400" maxW="2xl">
            Create intelligent trading agents powered by advanced market analysis and Starknet's secure infrastructure.
          </Text>
          <Button
            size="lg"
            colorScheme="blue"
            rightIcon={<ArrowRight />}
            onClick={() => router.push('/dashboard')}
          >
            Launch Dashboard
          </Button>
        </VStack>

        {/* Feature Cards */}
        <Grid templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap={8}>
          <Card>
            <VStack spacing={4} align="start">
              <Circle size="40px" bg="blue.500">
                <Icon as={Bot} color="white" boxSize={5} />
              </Circle>
              <Heading size="md">Smart Trading</Heading>
              <Text color="gray.400">
                AI-powered trading strategies optimized for maximum returns with managed risk.
              </Text>
            </VStack>
          </Card>

          <Card>
            <VStack spacing={4} align="start">
              <Circle size="40px" bg="purple.500">
                <Icon as={Brain} color="white" boxSize={5} />
              </Circle>
              <Heading size="md">Market Analysis</Heading>
              <Text color="gray.400">
                Real-time market analysis using advanced machine learning algorithms.
              </Text>
            </VStack>
          </Card>

          <Card>
            <VStack spacing={4} align="start">
              <Circle size="40px" bg="green.500">
                <Icon as={Sparkles} color="white" boxSize={5} />
              </Circle>
              <Heading size="md">Automated Trading</Heading>
              <Text color="gray.400">
                Set up automated trading strategies with customizable parameters.
              </Text>
            </VStack>
          </Card>
        </Grid>
      </Container>
    </Box>
  )
}
