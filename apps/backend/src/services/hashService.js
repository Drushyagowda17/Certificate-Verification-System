import crypto from "crypto";

export function hashBuffer(buffer) {
  // SHA256 hash of the uploaded certificate
  return crypto.createHash("sha256").update(buffer).digest("hex");
}
