import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { ethers } from "ethers";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const abiPath = path.resolve(__dirname, "../../../../shared/CertificateABI.json");
const contractAbi = JSON.parse(fs.readFileSync(abiPath, "utf-8"));

function getContractAddress() {
  return process.env.CONTRACT_ADDRESS;
}

function getProvider() {
  const rpcUrl = process.env.RPC_URL;
  if (!rpcUrl) {
    throw new Error("RPC_URL is missing in .env");
  }
  return new ethers.JsonRpcProvider(rpcUrl);
}

function getWallet(provider) {
  const privateKey = process.env.PRIVATE_KEY;
  if (!privateKey) {
    throw new Error("PRIVATE_KEY is missing in .env");
  }
  const normalized = privateKey.startsWith("0x") ? privateKey : `0x${privateKey}`;
  return new ethers.Wallet(normalized, provider);
}

export function getContract() {
  const address = getContractAddress();
  if (!address || address === "0xYourDeployedContractAddress") {
    throw new Error("CONTRACT_ADDRESS is not set. Update apps/backend/.env");
  }

  const provider = getProvider();
  const wallet = getWallet(provider);

  return new ethers.Contract(address, contractAbi, wallet);
}

export async function issueOnChain(certificateId, hashBytes32) {
  const contract = getContract();
  const tx = await contract.issueCertificate(certificateId, hashBytes32);
  await tx.wait();
  return tx.hash;
}

export async function verifyOnChain(certificateId, hashBytes32) {
  const contract = getContract();
  return contract.verifyCertificate(certificateId, hashBytes32);
}
