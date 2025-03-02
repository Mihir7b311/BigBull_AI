import { ApiNetworkProvider, Address, Account, Transaction } from "@multiversx/sdk-core";

const apiNetworkProvider = new ApiNetworkProvider("https://devnet-api.multiversx.com", { clientName: "hackathoniitism" });

const addressOfAlice = "erd1v35xenw90srls2fmhjhgr5df2n8360p6vqdpj9d3jw86rlr5429sk28dqx";
const aliceAddress = new Address(addressOfAlice);
const alice = new Account(aliceAddress);

const aliceOnNetwork = await apiNetworkProvider.getAccount(aliceAddress);
alice.update(aliceOnNetwork);
alice.incrementNonce();

const networkConfig = await apiNetworkProvider.getNetworkConfig();
console.log("Min Gas Price:", networkConfig.MinGasPrice);
console.log("Chain ID:", networkConfig.ChainID);
console.log("Nonce:", alice.nonce);
console.log("Balance:", alice.balance.toString());

const addressOfBob = "erd1gxg7avlcjxc3j7txtz77nap5gh9mlgewsq202t68mjl8ncwjp72svzy32t";
const bobAddress = new Address(addressOfBob);

const tx = new Transaction({
    data: Buffer.from("food for cats"),
    gasLimit: 70000n,
    sender: aliceAddress.toBech32(),   // ✅ Corrected
    receiver: bobAddress.toBech32(),   // ✅ Corrected
    value: 1000000000000000000n,
    chainID: networkConfig.ChainID      // ✅ Use retrieved chain ID
});

tx.nonce = alice.nonce;  // ✅ Use actual nonce

console.log("Transaction:", tx);
