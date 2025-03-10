import { NextResponse } from 'next/server';
import {
  UserSigner,
  Transaction,
  TransactionComputer,
  Address,
  TransactionWatcher
} from "@multiversx/sdk-core";
import { ApiNetworkProvider } from "@multiversx/sdk-network-providers";

// Custom error class for transaction-related errors
class TransactionError extends Error {
  constructor(message: string, public details?: any) {
    super(message);
    this.name = 'TransactionError';
  }
}

export async function POST(request: Request) {
  console.log('🚀 Starting transfer process...');
  
  try {
    const { amount } = await request.json();

    if (!amount) {
      console.error('❌ Amount is required');
      return NextResponse.json(
        { error: 'Amount is required' },
        { status: 400 }
      );
    }

    console.log(`💰 Processing transfer of ${amount} EGLD`);

    // Initialize network provider
    console.log('🌐 Initializing network provider...');
    const provider = new ApiNetworkProvider("https://devnet-api.multiversx.com");

    // Create signer from private key
    const privateKey = "NGZjZWJkMGFjOWRmOTA2MThiYzQ2YzZhMjc1MDUzNWMzN2M4NjkyZDM5ZTViMzk5ZWNiZTM1MzlmMmU5Mzk5ZjY0Njg2Y2NkYzU3YzA3ZjgyOTNiYmNhZTgxZDFhOTU0Y2YxZDNjM2E2MDFhMTkxNWIxOTM4ZmExZmM3NGFhOGI=";
    const signer = UserSigner.fromPem(`-----BEGIN PRIVATE KEY-----\n${privateKey}\n-----END PRIVATE KEY-----`);
    console.log('🔐 Signer created');

    // Sender address from the PEM file
    const senderAddress = "erd1v35xenw90srls2fmhjhgr5df2n8360p6vqdpj9d3jw86rlr5429sk28dqx";
    
    // Fixed receiver address
    const receiverAddress = "erd1el2mhkj0mdwtx022pndxjfstksd2fe2h0sv65f7pxvra6u973vhsspjjjd";

    // Fetch account data with error handling
    let accountOnNetwork;
    try {
      console.log('📊 Fetching account data...');
      accountOnNetwork = await provider.getAccount(new Address(senderAddress));
    } catch (error: any) {
      console.error('❌ Failed to fetch account data:', error);
      throw new TransactionError('Failed to fetch account data', {
        code: 'ACCOUNT_FETCH_ERROR',
        address: senderAddress,
        details: error.message
      });
    }

    // Create and prepare transaction
    console.log('📝 Creating transaction...');
    const transaction = new Transaction({
      nonce: accountOnNetwork.nonce,
      sender: senderAddress,
      receiver: new Address(receiverAddress),
      value: BigInt(Math.floor(amount * Math.pow(10, 18))), // Convert amount to proper denomination
      gasPrice: BigInt(1000000000),
      gasLimit: BigInt(70000),
      chainID: "D"
    });

    // Sign transaction with error handling
    try {
      console.log('✍️ Signing transaction...');
      const transactionComputer = new TransactionComputer();
      const txBytes = transactionComputer.computeBytesForSigning(transaction);
      transaction.signature = await signer.sign(txBytes);
    } catch (error: any) {
      console.error('❌ Failed to sign transaction:', error);
      throw new TransactionError('Failed to sign transaction', {
        code: 'TRANSACTION_SIGN_ERROR',
        details: error.message
      });
    }

    // Send transaction with error handling
    let txHash;
    try {
      console.log('📤 Sending transaction...');
      txHash = await provider.sendTransaction(transaction);
      console.log(`✅ Transaction sent successfully! Hash: ${txHash}`);
    } catch (error: any) {
      console.error('❌ Failed to send transaction:', error);
      throw new TransactionError('Failed to send transaction', {
        code: 'TRANSACTION_SEND_ERROR',
        details: error.message
      });
    }

    // Wait for confirmation with error handling
    try {
      console.log('⏳ Waiting for transaction confirmation...');
      const watcher = new TransactionWatcher(provider);
      const confirmedTx = await watcher.awaitCompleted(txHash);
      console.log('✅ Transaction confirmed:', JSON.stringify(confirmedTx));
    } catch (error: any) {
      console.error('⚠️ Transaction sent but confirmation failed:', error);
      // Don't throw here, as the transaction was sent successfully
    }

    return NextResponse.json({
      success: true,
      txHash: txHash,
      message: 'Transaction processed successfully'
    });

  } catch (error: any) {
    console.error('❌ Transaction process failed:', error);
    
    // Determine the appropriate error response
    const errorResponse = {
      error: error instanceof TransactionError ? error.message : 'Failed to process transfer',
      details: error instanceof TransactionError ? error.details : error.message,
      code: error instanceof TransactionError ? error.details?.code : 'UNKNOWN_ERROR'
    };

    return NextResponse.json(
      errorResponse,
      { status: 500 }
    );
  }
} 