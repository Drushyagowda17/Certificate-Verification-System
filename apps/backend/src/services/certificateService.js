import { Certificate } from "../models/Certificate.js";

export async function saveCertificate(data) {
  const doc = new Certificate(data);
  return doc.save();
}

export async function findCertificateById(certificateId) {
  return Certificate.findOne({ certificateId }).lean();
}
