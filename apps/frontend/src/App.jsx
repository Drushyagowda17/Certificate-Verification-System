import { useState } from "react";
import AdminPanel from "./pages/AdminPanel.jsx";
import VerifyPage from "./pages/VerifyPage.jsx";

export default function App() {
  const [page, setPage] = useState("admin");

  return (
    <div className="app">
      <div className="header">
        <div className="brand">Certificate Verification</div>
        <div className="nav">
          <button
            className={page === "admin" ? "active" : ""}
            onClick={() => setPage("admin")}
          >
            Admin Panel
          </button>
          <button
            className={page === "verify" ? "active" : ""}
            onClick={() => setPage("verify")}
          >
            Verify
          </button>
        </div>
      </div>

      {page === "admin" ? <AdminPanel /> : <VerifyPage />}
    </div>
  );
}
