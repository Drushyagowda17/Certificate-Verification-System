import { useState } from "react";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export default function VerifyPage() {
  const [certificateId, setCertificateId] = useState("");
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleVerify = async (event) => {
    event.preventDefault();
    setError("");
    setResult(null);

    try {
      if (!file) {
        throw new Error("Please upload a certificate file");
      }

      const formData = new FormData();
      formData.append("certificateId", certificateId);
      formData.append("certificate", file);

      const response = await fetch(`${API_BASE}/api/verify`, {
        method: "POST",
        body: formData
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Verification failed");
      }

      setResult(data);
    } catch (err) {
      setError(err.message || "Verification failed");
    }
  };

  return (
    <div className="card">
      <h2>Verify Certificate</h2>
      <form onSubmit={handleVerify}>
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
          <label>Certificate File</label>
          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            required
          />
        </div>
        <button className="primary" type="submit">Verify</button>
      </form>

      {result && (
        <div style={{ marginTop: "16px" }}>
          <span className={`badge ${result.valid ? "" : "invalid"}`}>
            {result.valid ? "VALID" : "INVALID"}
          </span>
          <p className="status">Hash: {result.hash}</p>
          {result.metadata && (
            <div className="meta">
              <div>Student: {result.metadata.studentName}</div>
              <div>Course: {result.metadata.courseName}</div>
              <div>Issue Date: {result.metadata.issueDate}</div>
              <div>Tx Hash: {result.metadata.txHash}</div>
            </div>
          )}
        </div>
      )}

      {error && <p className="status">Error: {error}</p>}
    </div>
  );
}
