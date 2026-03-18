  # Blockchain Certificate Verification System

  A full-stack application for issuing and verifying digital certificates using the Polygon blockchain.

[Clone or Download the zip and extract the project in the C/D/E drive for better working of the project avoid the Onedrive ]

  
  Download the project or clone the repo :
  git clone https://github.com/Drushyagowda17/Certificate-Verification-System.git

  ## Architecture

  ```
  Certificate-Verification/
  ├── apps/
  │   ├── frontend/          # React + Vite + TailwindCSS
  │   └── backend/           # Node.js + Express + MongoDB + ethers.js
  ├── packages/
  │   └── blockchain/        # Solidity + Hardhat (Polygon Amoy)
  └── shared/
  ```

  ## How It Works

  **Issuing:**
  1. Upload certificate file + metadata → Frontend
  2. Backend generates SHA256 hash of the file
  3. Hash stored on Polygon Amoy blockchain via smart contract
  4. Metadata (name, course, issuer) stored in MongoDB
  5. Returns unique Certificate ID

  **Verifying:**
  1. Upload same certificate file + Certificate ID → Frontend
  2. Backend hashes the uploaded file
  3. Fetches stored hash from blockchain
  4. Compares hashes → Valid / Tampered / Not Found

  ---

  ## Setup

  ### Prerequisites
  - Node.js v18+
  - MongoDB running locally
  - MetaMask wallet funded with Amoy testnet MATIC ([faucet](https://faucet.polygon.technology/))

  ---

  ### 1. Smart Contract Deployment

  ```bash
  cd packages/blockchain
  npm install
  cp .env.example .env
  # Fill in PRIVATE_KEY and RPC_URL in .env
  npm run deploy
  # Copy the CONTRACT_ADDRESS from output
  ```

  ---

  ### 2. Backend Setup

  ```bash
  cd apps/backend
  npm install
  cp .env.example .env
  # Fill in PRIVATE_KEY, CONTRACT_ADDRESS, MONGODB_URI in .env
  npm run dev
  ```

  Backend runs on: `http://localhost:5000`

  ---

  ### 3. Frontend Setup

  ```bash
  cd apps/frontend
  npm install
  npm run dev
  ```

  Frontend runs on: `http://localhost:5173`

  ---

  ### 4. Start MongoDB

  ```bash
  mongod
  # or
  brew services start mongodb-community
  ```

  ---

  ## API Reference

  ### POST /api/certificates/upload
  Upload and issue a certificate.

  **Form Data:**
  - `certificate` (file) — PDF or image
  - `issuer` (string)
  - `studentName` (string)
  - `courseName` (string)
  - `issueDate` (date string)

  **Response:**
  ```json
  {
    "success": true,
    "data": {
      "certificateId": "CERT-XXXXXXXXXXXXXXXX",
      "certificateHash": "sha256...",
      "blockchainTxHash": "0x..."
    }
  }
  ```

  ---

  ### POST /api/certificates/verify
  Verify a certificate's authenticity.

  **Form Data:**
  - `certificate` (file) — The certificate to verify
  - `certificateId` (string)

  **Response:**
  ```json
  {
    "success": true,
    "result": "VALID" | "TAMPERED" | "NOT_FOUND",
    "message": "...",
    "data": { ... }
  }
  ```

  ---

  ### GET /api/certificates/:id
  Fetch certificate metadata.

  ---

  ## Smart Contract

  Network: **Polygon Amoy Testnet** (chainId: 80002)

  Functions:
  - `issueCertificate(certificateId, certificateHash)` — onlyOwner
  - `verifyCertificate(certificateId)` → `(bool exists, string storedHash)`
  - `revokeCertificate(certificateId)` — onlyOwner

  View on PolygonScan Amoy: `https://amoy.polygonscan.com/address/YOUR_CONTRACT_ADDRESS`

  ---

  ## Security Notes

  - Private key **never** exposed to frontend — all blockchain calls are server-side
  - Files are hashed in memory; temp files deleted immediately after processing
  - File type and size validated server-side (multer)
  - Contract uses `onlyOwner` modifier — only the deployer wallet can issue/revoke

  ---

  ## Environment Variables

  ### Backend (.env)
  ```
  PORT=5000
  MONGODB_URI=mongodb://127.0.0.1:27017/certificates
  RPC_URL=https://rpc-amoy.polygon.technology
  PRIVATE_KEY=your_wallet_private_key
  CONTRACT_ADDRESS=deployed_contract_address
  ```

  ### Blockchain (.env)
  ```
  PRIVATE_KEY=your_wallet_private_key
  RPC_URL=https://rpc-amoy.polygon.technology
  ```
Complete project made by Dhaiwik
