import React from "react";
import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-16 text-center">
      <h1 className="text-5xl font-bold text-white mb-4">
        Blockchain Certificate<br />
        <span className="text-indigo-400">Verification System</span>
      </h1>
      <p className="text-gray-400 text-xl max-w-xl mx-auto mb-12">
        Issue tamper-proof digital certificates stored on the Polygon blockchain.
        Verify authenticity instantly using SHA256 hashing.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
        <Link
          to="/issue"
          className="card hover:border-indigo-600 transition-all duration-200 text-left group"
        >
          <div className="text-4xl mb-4">📜</div>
          <h2 className="text-xl font-bold text-white mb-2">Issue Certificate</h2>
          <p className="text-gray-400 text-sm">
            Upload a certificate, store its hash on-chain. Generates a unique Certificate ID.
          </p>
        </Link>

        <Link
          to="/verify"
          className="card hover:border-green-600 transition-all duration-200 text-left group"
        >
          <div className="text-4xl mb-4">🔍</div>
          <h2 className="text-xl font-bold text-white mb-2">Verify Certificate</h2>
          <p className="text-gray-400 text-sm">
            Upload a certificate and enter its ID to check if it's genuine or tampered.
          </p>
        </Link>
      </div>

      <div className="mt-16 grid grid-cols-3 gap-8 max-w-2xl mx-auto text-center">
        {[
          { icon: "⛓️", label: "Polygon Amoy", desc: "Blockchain layer" },
          { icon: "🔐", label: "SHA256", desc: "Hashing algorithm" },
          { icon: "🍃", label: "MongoDB", desc: "Metadata storage" },
        ].map(({ icon, label, desc }) => (
          <div key={label}>
            <div className="text-3xl mb-2">{icon}</div>
            <p className="text-white font-semibold">{label}</p>
            <p className="text-gray-500 text-xs">{desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
