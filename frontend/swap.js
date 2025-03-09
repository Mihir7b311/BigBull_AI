import { promises as fs } from "fs";
import {
  UserSigner,
  Transaction,
  TransactionComputer,
  Address,
  TransactionWatcher
} from "@multiversx/sdk-core";
import { ApiNetworkProvider } from "@multiversx/sdk-network-providers";

async function autoSignAndSendTransaction() {
  try {
    // Read the PEM file containing the wallet credentials
    const pemText = await fs.readFile("./wallet-owner.pem", { encoding: "utf8" });

    // Create a signer from the PEM file
    const signer = UserSigner.fromPem(pemText);

    // Initialize network provider (Devnet)
    const provider = new ApiNetworkProvider("https://devnet-api.multiversx.com");

    // Fetch latest nonce dynamically
    const senderAddress = "erd1v35xenw90srls2fmhjhgr5df2n8360p6vqdpj9d3jw86rlr5429sk28dqx";
    const accountOnNetwork = await provider.getAccount(new Address(senderAddress));
    const nonce = accountOnNetwork.nonce;

    // Create the transaction object
    const transaction = new Transaction({
      nonce: nonce,
      sender: senderAddress,
      receiver: new Address("erd13m0ddx3jckg4zzv40vzdmt2gmfd0wr350ypcra049xlu0ca9mkrqka4uq0"),
      value: 1n * 10n ** 18n,
      gasPrice: 1000000000n,
      gasLimit: 70000n,
      chainID: "D"
    });

    // Prepare the transaction for signing
    const transactionComputer = new TransactionComputer();
    const txBytes = transactionComputer.computeBytesForSigning(transaction);

    // Auto-sign the transaction using your signer
    transaction.signature = await signer.sign(txBytes);

    console.log("✅ Signed Transaction:", transaction.toPlainObject());

    // Broadcast the transaction
    const txHash = await provider.sendTransaction(transaction);
    console.log("📤 Transaction Sent! Hash:", txHash);

    // Wait for transaction confirmation
    const watcher = new TransactionWatcher(provider);
    const confirmedTx = await watcher.awaitCompleted(txHash);

    console.log("✅ Transaction Confirmed:", confirmedTx.toPlainObject());

  } catch (err) {
    console.error("❌ Error:", err);
  }
}

// Run the function
autoSignAndSendTransaction();
