const { ethers } = require("ethers");
const path = require("path");
const fs = require("fs");

let provider, signer, contract;

/**
 * Load ABI from the compiled artifact or fallback to saved ABI
 */
function loadABI() {
  // First try the ABI saved by deploy script
  const savedAbiPath = path.join(__dirname, "../abi/CertificateVerification.json");
  if (fs.existsSync(savedAbiPath)) {
    const data = JSON.parse(fs.readFileSync(savedAbiPath, "utf8"));
    return data.abi;
  }

  // Fallback: minimal ABI (works without compilation)
  return [
    "function issueCertificate(string certificateId, string certificateHash) public",
    "function verifyCertificate(string certificateId) public view returns (bool exists, string storedHash)",
    "function revokeCertificate(string certificateId) public",
    "event CertificateIssued(string indexed certificateId, string certificateHash, uint256 timestamp)",
  ];
}

/**
 * Initialize blockchain connection
 */
function initBlockchain() {
  if (!process.env.RPC_URL) throw new Error("RPC_URL not set in .env");
  if (!process.env.PRIVATE_KEY) throw new Error("PRIVATE_KEY not set in .env");
  if (!process.env.CONTRACT_ADDRESS) throw new Error("CONTRACT_ADDRESS not set in .env");

  provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
  signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
  const abi = loadABI();
  contract = new ethers.Contract(process.env.CONTRACT_ADDRESS, abi, signer);

  console.log("Blockchain service initialized");
  console.log("Contract address:", process.env.CONTRACT_ADDRESS);
  return contract;
}

/**
 * Store a certificate hash on-chain
 * @param {string} certificateId
 * @param {string} certificateHash
 * @returns {object} transaction receipt
 */
async function issueCertificateOnChain(certificateId, certificateHash) {
  if (!contract) initBlockchain();

  try {
    const tx = await contract.issueCertificate(certificateId, certificateHash);
    const receipt = await tx.wait();
    return {
      success: true,
      txHash: receipt.hash,
      blockNumber: receipt.blockNumber,
    };
  } catch (error) {
    console.error("Blockchain issue error:", error.message);
    throw new Error(`Blockchain transaction failed: ${error.message}`);
  }
}

/**
 * Retrieve stored hash from blockchain
 * @param {string} certificateId
 * @returns {object} { exists, storedHash }
 */
async function verifyCertificateOnChain(certificateId) {
  if (!contract) initBlockchain();

  try {
    const [exists, storedHash] = await contract.verifyCertificate(certificateId);
    return { exists, storedHash };
  } catch (error) {
    console.error("Blockchain verify error:", error.message);
    throw new Error(`Blockchain query failed: ${error.message}`);
  }
}

module.exports = {
  initBlockchain,
  issueCertificateOnChain,
  verifyCertificateOnChain,
};
