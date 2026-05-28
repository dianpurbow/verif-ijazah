import "@nomicfoundation/hardhat-ethers";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, ".env") });

let pk = (process.env.PRIVATE_KEY || "0x0000000000000000000000000000000000000000000000000000000000000000").trim();
if (!pk.startsWith("0x")) pk = "0x" + pk;

const SEPOLIA_RPC_URL = (process.env.SEPOLIA_RPC_URL || "https://eth-sepolia.g.alchemy.com/v2/demo").trim();

/** @type import('hardhat/config').HardhatUserConfig */
export default {
  solidity: "0.8.20",
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545"
    },
    sepolia: {
      type: "http",
      url: SEPOLIA_RPC_URL,
      accounts: [pk]
    }
  }
};
