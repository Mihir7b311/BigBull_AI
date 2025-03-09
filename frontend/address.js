import { Account, Address } from "@multiversx/sdk-core";
import { ApiNetworkProvider } from "@multiversx/sdk-network-providers";

const apiNetworkProvider = new ApiNetworkProvider("https://devnet-api.multiversx.com", { clientName: "multiversx-your-client-name" });

const addressOfAlice = new Address("erd1v35xenw90srls2fmhjhgr5df2n8360p6vqdpj9d3jw86rlr5429sk28dqx");
const alice = new Account(addressOfAlice);

async function fetchAccountData() {
  try {
    const aliceOnNetwork = await apiNetworkProvider.getAccount(addressOfAlice);  // FIXED
    alice.update(aliceOnNetwork);

    console.log("Nonce:", alice.nonce);
    console.log("Balance:", alice.balance.toString());
  } catch (error) {
    console.error("❌ Error:", error);
  }
}

fetchAccountData();
