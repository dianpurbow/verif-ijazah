import { ethers } from 'ethers';
import DegreeVerificationArtifact from './DegreeVerification.json' with { type: "json" };

// Default local contract address (update this after deployment)
const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";

export async function getContract(signerOrProvider) {
    return new ethers.Contract(CONTRACT_ADDRESS, DegreeVerificationArtifact.abi, signerOrProvider);
}

export async function addDegreeToBlockchain(hash) {
    if (typeof window === "undefined" || !window.ethereum) {
        throw new Error("No crypto wallet found. Please install it.");
    }

    await window.ethereum.request({ method: 'eth_requestAccounts' });
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    
    const contract = await getContract(signer);
    const tx = await contract.addDegree(hash);
    await tx.wait();
    return tx.hash;
}

export async function verifyDegreeFromBlockchain(hash) {
    // For verification, we just need a read-only provider
    // Using an RPC for public verification without needing metamask
    const rpcUrl = process.env.NEXT_PUBLIC_RPC_URL || "http://127.0.0.1:8545";
    const provider = new ethers.JsonRpcProvider(rpcUrl);
    const contract = await getContract(provider);
    
    const [isValid, timestamp] = await contract.verifyDegree(hash);
    return { isValid, timestamp: Number(timestamp) };
}
