import express from "express";
import { issueCertificate, verifyCertificate } from "../controllers/certificateController.js";
import upload from "../middleware/upload.js";

const router = express.Router();

router.post("/issue", upload.single("certificate"), issueCertificate);
router.post("/verify", upload.single("certificate"), verifyCertificate);

export default router;
