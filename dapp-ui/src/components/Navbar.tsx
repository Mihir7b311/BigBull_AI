'use client'

import NextLink from 'next/link';
import {
  Box,
  Flex,
  Button,
  Container,
  Text,
  HStack,
  Link,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Icon,
} from '@chakra-ui/react';
import { useAccount, useConnect, useDisconnect } from '@starknet-react/core';
import { Wallet, ChevronDown, LogOut } from 'lucide-react';
import type { Connector } from '@starknet-react/core';
import { useEffect, useState } from 'react';

const Navbar = () => {
  const { address } = useAccount();
  const { connect, connectors: available } = useConnect();
  const { disconnect } = useDisconnect();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const bgColor = 'whiteAlpha.200'
  const truncateAddress = (addr: string) => {
    if (!addr) return '';
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  if (!mounted) {
    return (
      <Box
        as="nav"
        position="fixed"
        w="full"
        zIndex={50}
        bg={bgColor}
        backdropFilter="blur(8px)"
        borderBottom="1px"
        borderColor="gray.700"
      >
        <Container maxW="7xl" px={{ base: 4, sm: 6, lg: 8 }}>
          <Flex h="16" alignItems="center" justifyContent="space-between">
            <Flex alignItems="center">
              <Link as={NextLink} href="/" _hover={{ textDecoration: 'none' }}>
                <Box w="120px" h="40px">
                  <img src="/logo.png" alt="Marp Trades Logo" width={40} height={40} />
                </Box>
              </Link>
            </Flex>

            <HStack spacing={4} display={{ base: 'none', md: 'flex' }}>
              <Link
                as={NextLink}
                href="/"
                px={3}
                py={2}
                rounded="md"
                fontSize="sm"
                fontWeight="medium"
                color="gray.300"
                _hover={{ color: 'white', textDecoration: 'none' }}
              >
                Home
              </Link>
              <Link
                as={NextLink}
                href="/library"
                px={3}
                py={2}
                rounded="md"
                fontSize="sm"
                fontWeight="medium"
                color="gray.300"
                _hover={{ color: 'white', textDecoration: 'none' }}
              >
                Library
              </Link>
              <Link
                as={NextLink}
                href="/transactions"
                px={3}
                py={2}
                rounded="md"
                fontSize="sm"
                fontWeight="medium"
                color="gray.300"
                _hover={{ color: 'white', textDecoration: 'none' }}
              >
                Transactions
              </Link>
            </HStack>

            <Flex alignItems="center">
              <Button
                colorScheme="blue"
                size="md"
                fontSize="sm"
                leftIcon={<Wallet size={16} />}
                isLoading
              >
                Connect Wallet
              </Button>
            </Flex>
          </Flex>
        </Container>
      </Box>
    );
  }

  return (
    <Box
      as="nav"
      position="fixed"
      w="full"
      zIndex={50}
      bg={bgColor}
      backdropFilter="blur(8px)"
      borderBottom="1px"
      borderColor="gray.700"
    >
      <Container maxW="7xl" px={{ base: 4, sm: 6, lg: 8 }}>
        <Flex h="16" alignItems="center" justifyContent="space-between">
          <Flex alignItems="center" flex={1}>
            <Link as={NextLink} href="/" _hover={{ textDecoration: 'none' }}>
              <Flex alignItems="center" gap={0}>
                <Box w="50px" h="50px">
                  <img src="/logo.png" alt="Marp Trades Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                </Box>
                <Text fontSize="lg" fontWeight="black" color="white">
                  Trades
                </Text>
              </Flex>
            </Link>
          </Flex>

          <HStack spacing={4} display={{ base: 'none', md: 'flex' }} flex={2} justifyContent="center">
            <Link
              as={NextLink}
              href="/"
              px={3}
              py={2}
              rounded="md"
              fontSize="sm"
              fontWeight="medium"
              color="gray.300"
              _hover={{ color: 'white', textDecoration: 'none' }}
            >
              Home
            </Link>
            <Link
              as={NextLink}
              href="/library"
              px={3}
              py={2}
              rounded="md"
              fontSize="sm"
              fontWeight="medium"
              color="gray.300"
              _hover={{ color: 'white', textDecoration: 'none' }}
            >
              Library
            </Link>
            <Link
              as={NextLink}
              href="/transactions"
              px={3}
              py={2}
              rounded="md"
              fontSize="sm"
              fontWeight="medium"
              color="gray.300"
              _hover={{ color: 'white', textDecoration: 'none' }}
            >
              Transactions
            </Link>
          </HStack>

          <Flex alignItems="center" flex={1} justifyContent="flex-end">
            {address ? (
              <Menu>
                <MenuButton
                  as={Button}
                  rightIcon={<ChevronDown size={16} />}
                  leftIcon={<Wallet size={16} />}
                  colorScheme="blue"
                  variant="outline"
                  size="md"
                  fontSize="sm"
                >
                  {truncateAddress(address)}
                </MenuButton>
                <MenuList bg="gray.800" borderColor="gray.700">
                  <MenuItem
                    icon={<LogOut size={16} />}
                    onClick={() => disconnect()}
                    _hover={{ bg: 'gray.700' }}
                  >
                    Disconnect
                  </MenuItem>
                </MenuList>
              </Menu>
            ) : (
              <Menu>
                <MenuButton
                  as={Button}
                  colorScheme="blue"
                  size="md"
                  fontSize="sm"
                  leftIcon={<Wallet size={16} />}
                  rightIcon={<ChevronDown size={16} />}
                >
                  Connect Wallet
                </MenuButton>
                <MenuList bg="gray.800" borderColor="gray.700">
                  {available.map((connector: Connector) => (
                    <MenuItem
                      key={connector.id}
                      onClick={() => connect({ connector })}
                      _hover={{ bg: 'gray.700' }}
                    >
                      {connector.name}
                    </MenuItem>
                  ))}
                </MenuList>
              </Menu>
            )}
          </Flex>
        </Flex>
      </Container>
    </Box>
  );
};

export default Navbar; 