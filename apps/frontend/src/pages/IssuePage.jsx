import React, { useState } from "react";
import FileDropZone from "../components/FileDropZone.jsx";
import { uploadCertificate } from "../api/certificates.js";

export default function IssuePage() {
  const [file, setFile] = useState(null);
  const [form, setForm] = useState({
    issuer: "",
    studentName: "",
    courseName: "",
    issueDate: "",
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return setError("Please select a certificate file.");

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("certificate", file);
      Object.entries(form).forEach(([k, v]) => formData.append(k, v));

      const data = await uploadCertificate(formData);
      setResult(data);
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Upload failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-white mb-2">Issue Certificate</h1>
      <p className="text-gray-400 mb-8">Upload a certificate file to register it on the blockchain.</p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-200 mb-4">Certificate File</h2>
          <FileDropZone file={file} onFileChange={setFile} />
        </div>

        <div className="card space-y-4">
          <h2 className="text-lg font-semibold text-gray-200 mb-2">Certificate Details</h2>

          {[
            { name: "studentName", label: "Student Name", placeholder: "John Doe" },
            { name: "issuer", label: "Issuing Institution", placeholder: "MIT / Coursera / etc." },
            { name: "courseName", label: "Course / Program", placeholder: "Full Stack Development" },
          ].map(({ name, label, placeholder }) => (
            <div key={name}>
              <label className="block text-sm text-gray-400 mb-1.5">{label}</label>
              <input
                type="text"
                name={name}
                value={form[name]}
                onChange={handleChange}
                placeholder={placeholder}
                required
                className="input-field"
              />
            </div>
          ))}

          <div>
            <label className="block text-sm text-gray-400 mb-1.5">Issue Date</label>
            <input
              type="date"
              name="issueDate"
              value={form.issueDate}
              onChange={handleChange}
              required
              className="input-field"
            />
          </div>
        </div>

        {error && (
          <div className="bg-red-900/30 border border-red-700 rounded-lg p-4 text-red-400 text-sm">
            ⚠️ {error}
          </div>
        )}

        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="animate-spin">⟳</span> Issuing on blockchain...
            </span>
          ) : (
            "Issue Certificate"
          )}
        </button>
      </form>

      {result?.success && (
        <div className="mt-8 card border-green-700 bg-green-900/20">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl">✅</span>
            <h3 className="text-xl font-bold text-green-400">Certificate Issued!</h3>
          </div>

          <div className="space-y-3">
            <div className="bg-gray-900 rounded-lg p-4">
              <p className="text-gray-500 text-xs uppercase tracking-wide mb-1">Certificate ID</p>
              <p className="text-white font-mono font-bold text-lg">{result.data.certificateId}</p>
              <p className="text-gray-500 text-xs mt-1">Save this ID — it's needed for verification</p>
            </div>

            <div className="bg-gray-900 rounded-lg p-3">
              <p className="text-gray-500 text-xs uppercase tracking-wide mb-1">Blockchain TX Hash</p>
              <a
                href={`https://amoy.polygonscan.com/tx/${result.data.blockchainTxHash}`}
                target="_blank"
                rel="noreferrer"
                className="text-indigo-400 hover:underline font-mono text-xs break-all"
              >
                {result.data.blockchainTxHash}
              </a>
            </div>

            <div className="bg-gray-900 rounded-lg p-3">
              <p className="text-gray-500 text-xs uppercase tracking-wide mb-1">Certificate Hash (SHA256)</p>
              <p className="text-gray-400 font-mono text-xs break-all">{result.data.certificateHash}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
