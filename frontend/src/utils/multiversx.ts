import {
  UserSigner,
  Transaction,
  TransactionComputer,
  Address,
  TransactionWatcher
} from "@multiversx/sdk-core";
import { ApiNetworkProvider } from "@multiversx/sdk-network-providers";

export interface TransferResult {
  success: boolean;
  hash?: string;
  error?: string;
}

export async function sendTransaction(
  senderAddress: string,
  receiverAddress: string,
  amount: number,
  pemContent: string
): Promise<TransferResult> {
  try {
    // Create a signer from the PEM content
    const signer = UserSigner.fromPem(pemContent);

    // Initialize network provider (Devnet)
    const provider = new ApiNetworkProvider("https://devnet-api.multiversx.com");

    // Fetch latest nonce dynamically
    const accountOnNetwork = await provider.getAccount(new Address(senderAddress));
    const nonce = accountOnNetwork.nonce;

    // Create the transaction object
    const transaction = new Transaction({
      nonce: nonce,
      sender: senderAddress,
      receiver: new Address(receiverAddress),
      value: BigInt(amount * Math.pow(10, 18)), // Convert to smallest denomination
      gasPrice: BigInt("1000000000"),
      gasLimit: BigInt("70000"), 
      chainID: "D" // Devnet
    });

    // Prepare the transaction for signing
    const transactionComputer = new TransactionComputer();
    const txBytes = transactionComputer.computeBytesForSigning(transaction);

    // Sign the transaction
    transaction.signature = await signer.sign(txBytes);

    // Broadcast the transaction
    const txHash = await provider.sendTransaction(transaction);

    // Wait for transaction confirmation
    const watcher = new TransactionWatcher(provider);
    const confirmedTx = await watcher.awaitCompleted(txHash);

    return {
      success: true,
      hash: txHash
    };

  } catch (err) {
    console.error("Transaction error:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Unknown error occurred"
    };
  }
}

export async function validateAddress(address: string): Promise<boolean> {
  try {
    new Address(address);
    return true;
  } catch {
    return false;
  }
} 