import { ethers } from "ethers";
import fs from "fs";

async function main() {
  const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
  const signer = await provider.getSigner(0);
  
  const artifactJson = JSON.parse(fs.readFileSync("./artifacts/contracts/DegreeVerification.sol/DegreeVerification.json"));
  
  const factory = new ethers.ContractFactory(artifactJson.abi, artifactJson.bytecode, signer);
  const contract = await factory.deploy();
  await contract.waitForDeployment();
  
  console.log("DegreeVerification deployed to:", await contract.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
