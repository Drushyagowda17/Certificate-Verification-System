import React from "react";

const RESULT_CONFIG = {
  VALID: {
    icon: "✅",
    color: "text-green-400",
    bg: "bg-green-900/30 border-green-700",
    label: "Certificate Valid",
  },
  TAMPERED: {
    icon: "⚠️",
    color: "text-red-400",
    bg: "bg-red-900/30 border-red-700",
    label: "Certificate Tampered",
  },
  NOT_FOUND: {
    icon: "❌",
    color: "text-yellow-400",
    bg: "bg-yellow-900/30 border-yellow-700",
    label: "Certificate Not Found",
  },
};

export default function VerificationResult({ result }) {
  if (!result) return null;

  const config = RESULT_CONFIG[result.result] || RESULT_CONFIG.NOT_FOUND;

  return (
    <div className={`rounded-xl border p-6 mt-6 ${config.bg}`}>
      <div className="flex items-center gap-3 mb-4">
        <span className="text-3xl">{config.icon}</span>
        <div>
          <h3 className={`text-xl font-bold ${config.color}`}>{config.label}</h3>
          <p className="text-gray-400 text-sm">{result.message}</p>
        </div>
      </div>

      {result.data && (
        <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
          {[
            ["Certificate ID", result.data.certificateId],
            ["Student Name", result.data.studentName],
            ["Course", result.data.courseName],
            ["Issuer", result.data.issuer],
            ["Issue Date", result.data.issueDate ? new Date(result.data.issueDate).toLocaleDateString() : "-"],
            ["Issued At", result.data.issuedAt ? new Date(result.data.issuedAt).toLocaleString() : "-"],
          ].map(([label, value]) => (
            <div key={label} className="bg-gray-900/60 rounded-lg p-3">
              <p className="text-gray-500 text-xs uppercase tracking-wide">{label}</p>
              <p className="text-gray-200 font-medium mt-0.5">{value || "-"}</p>
            </div>
          ))}

          {result.data.blockchainTxHash && (
            <div className="col-span-2 bg-gray-900/60 rounded-lg p-3">
              <p className="text-gray-500 text-xs uppercase tracking-wide">Blockchain TX</p>
              <a
                href={`https://amoy.polygonscan.com/tx/${result.data.blockchainTxHash}`}
                target="_blank"
                rel="noreferrer"
                className="text-indigo-400 hover:underline font-mono text-xs break-all"
              >
                {result.data.blockchainTxHash}
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
