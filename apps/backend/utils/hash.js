const crypto = require("crypto");
const fs = require("fs");

/**
 * Generate SHA256 hash from a file buffer
 * @param {Buffer} buffer - File buffer
 * @returns {string} hex hash
 */
function hashBuffer(buffer) {
  return crypto.createHash("sha256").update(buffer).digest("hex");
}

/**
 * Generate SHA256 hash from a file path
 * @param {string} filePath
 * @returns {string} hex hash
 */
function hashFile(filePath) {
  const buffer = fs.readFileSync(filePath);
  return hashBuffer(buffer);
}

module.exports = { hashBuffer, hashFile };
