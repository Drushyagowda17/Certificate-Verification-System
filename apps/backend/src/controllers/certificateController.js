import { hashBuffer } from "../services/hashService.js";
import { issueOnChain, verifyOnChain } from "../services/blockchainService.js";
import { saveCertificate, findCertificateById } from "../services/certificateService.js";

export async function issueCertificate(req, res, next) {
  try {
    const { certificateId, studentName, courseName, issueDate } = req.body;
    const file = req.file;

    if (!certificateId || !studentName || !courseName || !issueDate) {
      res.status(400);
      throw new Error("Missing required fields");
    }

    if (!file) {
      res.status(400);
      throw new Error("Certificate file is required");
    }

    const hashHex = hashBuffer(file.buffer);
    const hashBytes32 = `0x${hashHex}`;

    const txHash = await issueOnChain(certificateId, hashBytes32);

    await saveCertificate({
      certificateId,
      hashHex: hashBytes32,
      studentName,
      courseName,
      issueDate,
      txHash
    });

    res.json({
      success: true,
      certificateId,
      hash: hashBytes32,
      txHash
    });
  } catch (err) {
    next(err);
  }
}

export async function verifyCertificate(req, res, next) {
  try {
    const { certificateId } = req.body;
    const file = req.file;

    if (!certificateId) {
      res.status(400);
      throw new Error("certificateId is required");
    }

    if (!file) {
      res.status(400);
      throw new Error("Certificate file is required");
    }

    const hashHex = hashBuffer(file.buffer);
    const hashBytes32 = `0x${hashHex}`;

    const valid = await verifyOnChain(certificateId, hashBytes32);
    const metadata = await findCertificateById(certificateId);

    res.json({
      success: true,
      certificateId,
      hash: hashBytes32,
      valid,
      metadata
    });
  } catch (err) {
    next(err);
  }
}
