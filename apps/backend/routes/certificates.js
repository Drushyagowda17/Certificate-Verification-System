const express = require("express");
const router = express.Router();
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");
const path = require("path");

const upload = require("../middleware/upload");
const Certificate = require("../models/Certificate");
const { hashBuffer } = require("../utils/hash");
const { issueCertificateOnChain, verifyCertificateOnChain } = require("../services/blockchainService");

/**
 * POST /api/certificates/upload
 * Issue a new certificate
 */
router.post("/upload", upload.single("certificate"), async (req, res) => {
  const filePath = req.file?.path;

  try {
    // 1. Validate file
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded." });
    }

    // 2. Validate metadata
    const { issuer, studentName, courseName, issueDate } = req.body;
    if (!issuer || !studentName || !courseName || !issueDate) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: issuer, studentName, courseName, issueDate",
      });
    }

    // 3. Generate SHA256 hash from file buffer
    const fileBuffer = fs.readFileSync(filePath);
    const certificateHash = hashBuffer(fileBuffer);

    // 4. Generate unique certificate ID
    const certificateId = `CERT-${uuidv4().toUpperCase().replace(/-/g, "").slice(0, 16)}`;

    // 5. Store hash on blockchain
    const blockchainResult = await issueCertificateOnChain(certificateId, certificateHash);

    // 6. Save metadata to MongoDB
    const certificate = new Certificate({
      certificateId,
      certificateHash,
      issuer,
      studentName,
      courseName,
      issueDate: new Date(issueDate),
      blockchainTxHash: blockchainResult.txHash,
      contractAddress: process.env.CONTRACT_ADDRESS,
    });
    await certificate.save();

    // 7. Clean up temp file
    fs.unlinkSync(filePath);

    return res.status(201).json({
      success: true,
      message: "Certificate issued successfully.",
      data: {
        certificateId,
        certificateHash,
        blockchainTxHash: blockchainResult.txHash,
        issuer,
        studentName,
        courseName,
        issueDate,
      },
    });
  } catch (error) {
    // Clean up temp file on error
    if (filePath && fs.existsSync(filePath)) fs.unlinkSync(filePath);
    console.error("Upload error:", error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * POST /api/certificates/verify
 * Verify a certificate's authenticity
 */
router.post("/verify", upload.single("certificate"), async (req, res) => {
  const filePath = req.file?.path;

  try {
    // 1. Validate inputs
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded." });
    }

    const { certificateId } = req.body;
    if (!certificateId) {
      return res.status(400).json({ success: false, message: "Certificate ID is required." });
    }

    // 2. Hash the uploaded file
    const fileBuffer = fs.readFileSync(filePath);
    const uploadedHash = hashBuffer(fileBuffer);

    // 3. Fetch record from MongoDB
    const dbRecord = await Certificate.findOne({ certificateId });
    if (!dbRecord) {
      fs.unlinkSync(filePath);
      return res.status(404).json({
        success: true,
        result: "NOT_FOUND",
        message: "Certificate Not Found — no record exists for this ID.",
      });
    }

    // 4. Fetch hash from blockchain
    const { exists, storedHash } = await verifyCertificateOnChain(certificateId);
    if (!exists) {
      fs.unlinkSync(filePath);
      return res.status(404).json({
        success: true,
        result: "NOT_FOUND",
        message: "Certificate Not Found — record exists in DB but not on blockchain.",
      });
    }

    // 5. Compare hashes
    const isValid = uploadedHash === storedHash;

    // 6. Clean up temp file
    fs.unlinkSync(filePath);

    return res.status(200).json({
      success: true,
      result: isValid ? "VALID" : "TAMPERED",
      message: isValid
        ? "Certificate Valid — the document matches the original."
        : "Certificate Tampered — the document has been modified.",
      data: {
        certificateId,
        uploadedHash,
        storedHash: isValid ? storedHash : "[hidden for security]",
        issuer: dbRecord.issuer,
        studentName: dbRecord.studentName,
        courseName: dbRecord.courseName,
        issueDate: dbRecord.issueDate,
        blockchainTxHash: dbRecord.blockchainTxHash,
        issuedAt: dbRecord.createdAt,
      },
    });
  } catch (error) {
    if (filePath && fs.existsSync(filePath)) fs.unlinkSync(filePath);
    console.error("Verify error:", error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * GET /api/certificates/:id
 * Fetch certificate metadata (no sensitive hash exposed)
 */
router.get("/:id", async (req, res) => {
  try {
    const cert = await Certificate.findOne({ certificateId: req.params.id }).select(
      "-certificateHash -__v"
    );
    if (!cert) {
      return res.status(404).json({ success: false, message: "Certificate not found." });
    }
    return res.status(200).json({ success: true, data: cert });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
