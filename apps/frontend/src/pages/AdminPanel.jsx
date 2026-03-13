import { useState } from "react";
import { ethers } from "ethers";
import { CONTRACT_ADDRESS } from "@shared/constants.js";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
const REQUIRED_CHAIN_ID = Number(import.meta.env.VITE_CHAIN_ID || 80002);

export default function AdminPanel() {
  const [walletAddress, setWalletAddress] = useState("");
  const [chainId, setChainId] = useState(null);
  const [certificateId, setCertificateId] = useState("");
  const [studentName, setStudentName] = useState("");
  const [courseName, setCourseName] = useState("");
  const [issueDate, setIssueDate] = useState("");
  const [file, setFile] = useState(null);
  const [txHash, setTxHash] = useState("");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  const connectWallet = async () => {
    try {
      setError("");
      if (!window.ethereum) {
        setError("MetaMask not found. Please install it.");
        return;
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      const network = await provider.getNetwork();

      setWalletAddress(accounts[0]);
      setChainId(Number(network.chainId));
    } catch (err) {
      setError(err.message || "Failed to connect wallet");
    }
  };

  const handleIssue = async (event) => {
    event.preventDefault();
    setError("");
    setStatus("Issuing certificate...");
    setTxHash("");

    try {
      if (!file) {
        throw new Error("Please upload a certificate file");
      }

      const formData = new FormData();
      formData.append("certificateId", certificateId);
      formData.append("studentName", studentName);
      formData.append("courseName", courseName);
      formData.append("issueDate", issueDate);
      formData.append("certificate", file);

      const response = await fetch(`${API_BASE}/api/issue`, {
        method: "POST",
        body: formData
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Issue failed");
      }

      setTxHash(data.txHash);
      setStatus("Certificate issued successfully.");
    } catch (err) {
      setError(err.message || "Issue failed");
      setStatus("");
    }
  };

  return (
    <div>
      <div className="card">
        <h2>Wallet</h2>
        <p className="meta">Contract: {import.meta.env.VITE_CONTRACT_ADDRESS || CONTRACT_ADDRESS}</p>
        {walletAddress ? (
          <div>
            <div className="status">Connected: {walletAddress}</div>
            <div className="status">Chain ID: {chainId}</div>
            {chainId !== REQUIRED_CHAIN_ID && (
              <div className="status">Please switch to Polygon Amoy (80002)</div>
            )}
          </div>
        ) : (
          <button className="primary" onClick={connectWallet}>Connect MetaMask</button>
        )}
      </div>

      <div className="card">
        <h2>Issue Certificate</h2>
        <form onSubmit={handleIssue}>
          <div>
            <label>Certificate ID</label>
            <input
              type="text"
              value={certificateId}
              onChange={(e) => setCertificateId(e.target.value)}
              placeholder="CERT-2026-001"
              required
            />
          </div>
          <div>
            <label>Student Name</label>
            <input
              type="text"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Course Name</label>
            <input
              type="text"
              value={courseName}
              onChange={(e) => setCourseName(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Issue Date</label>
            <input
              type="date"
              value={issueDate}
              onChange={(e) => setIssueDate(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Certificate File (PDF or image)</label>
            <input
              type="file"
              onChange={(e) => setFile(e.target.files[0])}
              required
            />
          </div>
          <button className="primary" type="submit">Issue</button>
        </form>

        {status && <p className="status">{status}</p>}
        {txHash && <p className="status">Tx Hash: {txHash}</p>}
        {error && <p className="status">Error: {error}</p>}
      </div>
    </div>
  );
}
