'use client'

import {
  Box,
  Flex,
  Button,
  useColorModeValue,
  Stack,
  useColorMode,
  Container,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Text,
} from '@chakra-ui/react';
import { MoonIcon, SunIcon } from '@chakra-ui/icons';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Nav() {
  const { colorMode, toggleColorMode } = useColorMode();
  const router = useRouter();

  return (
    <Box
      position="fixed"
      top={0}
      left={0}
      right={0}
      zIndex={100}
      bg={useColorModeValue('white', 'gray.800')}
      borderBottom={1}
      borderStyle="solid"
      borderColor={useColorModeValue('gray.200', 'gray.700')}
      h="4rem"
    >
      <Container maxW="7xl" h="full">
        <Flex h="full" alignItems="center" justifyContent="space-between">
          <Link href="/" passHref>
            <Text
              fontSize="xl"
              fontWeight="bold"
              bgGradient="linear(to-r, blue.400, purple.400)"
              bgClip="text"
              cursor="pointer"
            >
              BigBull.ai
            </Text>
          </Link>

          <Flex alignItems="center" gap={4}>
            <Button
              onClick={() => router.push('/dashboard')}
              colorScheme="blue"
              size="sm"
            >
              Launch App
            </Button>

            <Stack direction="row" spacing={4}>
              <IconButton
                aria-label="Toggle theme"
                icon={colorMode === 'dark' ? <SunIcon /> : <MoonIcon />}
                onClick={toggleColorMode}
                size="sm"
              />
            </Stack>
          </Flex>
        </Flex>
      </Container>
    </Box>
  );
} 