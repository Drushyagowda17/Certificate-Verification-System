import React from "react";
import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const { pathname } = useLocation();

  const linkClass = (path) =>
    `px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
      pathname === path
        ? "bg-indigo-600 text-white"
        : "text-gray-400 hover:text-white hover:bg-gray-800"
    }`;

  return (
    <nav className="border-b border-gray-800 bg-gray-950 sticky top-0 z-10">
      <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-2xl">🔐</span>
          <span className="font-bold text-white text-lg">CertChain</span>
        </Link>
        <div className="flex gap-2">
          <Link to="/issue" className={linkClass("/issue")}>Issue Certificate</Link>
          <Link to="/verify" className={linkClass("/verify")}>Verify Certificate</Link>
        </div>
      </div>
    </nav>
  );
}
