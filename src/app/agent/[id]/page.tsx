import React, { useState } from 'react';
import { Card, VStack, Text, FormControl, FormLabel, Input, Button } from '@chakra-ui/react';

const TransferComponent = ({ onSubmit }: { onSubmit: (amount: number, address: string) => Promise<void> }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [address, setAddress] = useState('');
  const fixedAmount = 0.01;

  const handleSubmit = async () => {
    if (!isValidAddress) return;
    
    console.log('🔵 Transfer button clicked');
    setIsLoading(true);
    try {
      await onSubmit(fixedAmount, address);
    } catch (error) {
      console.error('🔴 Error in TransferComponent:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const isValidAddress = address.startsWith('erd1') && address.length === 62;

  return (
    <Card p={6} bg="rgba(26, 32, 44, 0.7)" backdropFilter="blur(10px)" border="1px solid" borderColor="blue.800" borderRadius="xl">
      <VStack spacing={4}>
        <Text fontSize="lg" fontWeight="bold" color="white">Transfer EGLD</Text>
        <FormControl isInvalid={address.length > 0 && !isValidAddress}>
          <FormLabel color="gray.300">Recipient Address</FormLabel>
          <Input
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="erd1..."
            bg="whiteAlpha.100"
            border="1px solid"
            borderColor={isValidAddress ? "green.600" : "red.600"}
            _hover={{ borderColor: isValidAddress ? "green.500" : "red.500" }}
            size="md"
          />
          {address && !isValidAddress && (
            <Text color="red.400" fontSize="sm" mt={1}>
              Please enter a valid ERD address starting with 'erd1'
            </Text>
          )}
        </FormControl>
        <VStack spacing={1} align="center" width="full">
          <Text fontSize="xl" fontWeight="bold" color="white">
            {fixedAmount} EGLD
          </Text>
          <Text fontSize="sm" color="gray.400">
            Fixed transfer amount
          </Text>
        </VStack>
        <Button
          colorScheme="blue"
          width="full"
          onClick={handleSubmit}
          isDisabled={isLoading || !isValidAddress}
          isLoading={isLoading}
        >
          Confirm Transfer
        </Button>
      </VStack>
    </Card>
  );
};

const handleTransfer = async (amount: number, receiverAddress: string) => {
  try {
    const processingMessage: Message = {
      id: Date.now().toString(),
      role: 'assistant',
      content: `🔄 Processing transfer request for ${amount} EGLD to ${receiverAddress}...`,
      timestamp: new Date(),
      type: 'transfer'
    };
    setMessages(prev => [...prev, processingMessage]);

    const response = await fetch('/api/transfer', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ amount, receiverAddress }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Transfer failed');
    }

    const initiationMessage: Message = {
      id: Date.now().toString(),
      role: 'assistant',
      content: `🚀 Transfer initiated!\n\nAmount: ${amount} EGLD\nTo: ${receiverAddress}\nTransaction Hash: ${data.txHash}\nView on Explorer: https://devnet-explorer.multiversx.com/transactions/${data.txHash}`,
      timestamp: new Date(),
      type: 'transfer',
      metadata: { amount, txHash: data.txHash }
    };
    setMessages(prev => [...prev, initiationMessage]);

    // Poll for transaction status
    let attempts = 0;
    const maxAttempts = 20;
    const checkStatus = async () => {
      try {
        const statusResponse = await fetch(`https://devnet-api.multiversx.com/transactions/${data.txHash}`);
        const statusData = await statusResponse.json();
        
        if (statusData.status === 'success' || statusData.status === 'executed') {
          const successMessage: Message = {
            id: Date.now().toString(),
            role: 'assistant',
            content: `✅ Transfer completed successfully!\n\nAmount: ${amount} EGLD\nTo: ${receiverAddress}\nTransaction Hash: ${data.txHash}\nView on Explorer: https://devnet-explorer.multiversx.com/transactions/${data.txHash}`,
            timestamp: new Date(),
            type: 'transfer',
            metadata: { amount, txHash: data.txHash }
          };
          setMessages(prev => [...prev, successMessage]);
          return;
        }
        
        if (statusData.status === 'failed' || statusData.status === 'invalid') {
          throw new Error(`Transaction failed with status: ${statusData.status}`);
        }
        
        if (attempts < maxAttempts) {
          attempts++;
          if (attempts % 5 === 0) {
            const updateMessage: Message = {
              id: Date.now().toString(),
              role: 'assistant',
              content: `⏳ Still processing transfer... (Attempt ${attempts}/${maxAttempts})\n\nTransaction Hash: ${data.txHash}\nView on Explorer: https://devnet-explorer.multiversx.com/transactions/${data.txHash}`,
              timestamp: new Date(),
              type: 'transfer',
              metadata: { amount, txHash: data.txHash }
            };
            setMessages(prev => [...prev, updateMessage]);
          }
          setTimeout(checkStatus, 3000);
        } else {
          throw new Error('Transaction took too long to confirm. Please check the explorer for status.');
        }
      } catch (error: any) {
        const errorMessage: Message = {
          id: Date.now().toString(),
          role: 'assistant',
          content: `❌ Error checking transaction status: ${error.message}\n\nYou can still view the transaction on the explorer:\nhttps://devnet-explorer.multiversx.com/transactions/${data.txHash}`,
          timestamp: new Date(),
          type: 'transfer',
          metadata: { amount, txHash: data.txHash }
        };
        setMessages(prev => [...prev, errorMessage]);
      }
    };

    setTimeout(checkStatus, 3000);
    setChatState(prev => ({ ...prev, showTransfer: false }));

  } catch (error: any) {
    const errorMessage: Message = {
      id: Date.now().toString(),
      role: 'assistant',
      content: `❌ Transfer failed: ${error.message}`,
      timestamp: new Date(),
      type: 'transfer'
    };
    setMessages(prev => [...prev, errorMessage]);
    console.error('Transfer error:', error);
  }
};

// Update where TransferComponent is used
{chatState.showTransfer && (
  <TransferComponent
    onSubmit={(amount, address) => {
      handleTransfer(amount, address);
      setChatState(prev => ({ ...prev, showTransfer: false }));
    }}
  />
)} 