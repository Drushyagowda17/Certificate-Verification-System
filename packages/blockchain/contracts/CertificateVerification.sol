// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title CertificateVerification
 * @dev Stores and verifies certificate hashes on-chain
 */
contract CertificateVerification {
    address public owner;

    // Maps certificateId => certificateHash
    mapping(string => string) private certificates;

    // Track which IDs exist to distinguish "empty" from "not found"
    mapping(string => bool) private certificateExists;

    event CertificateIssued(string indexed certificateId, string certificateHash, uint256 timestamp);
    event CertificateRevoked(string indexed certificateId, uint256 timestamp);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not authorized: caller is not the owner");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    /**
     * @dev Issue a certificate by storing its hash
     * @param certificateId Unique identifier for the certificate
     * @param certificateHash SHA256 hash of the certificate file
     */
    function issueCertificate(string memory certificateId, string memory certificateHash) public onlyOwner {
        require(bytes(certificateId).length > 0, "Certificate ID cannot be empty");
        require(bytes(certificateHash).length > 0, "Certificate hash cannot be empty");
        require(!certificateExists[certificateId], "Certificate ID already exists");

        certificates[certificateId] = certificateHash;
        certificateExists[certificateId] = true;

        emit CertificateIssued(certificateId, certificateHash, block.timestamp);
    }

    /**
     * @dev Retrieve stored hash for a certificate ID
     * @param certificateId Unique identifier to look up
     * @return exists Whether the certificate was found
     * @return storedHash The stored hash (empty string if not found)
     */
    function verifyCertificate(string memory certificateId) public view returns (bool exists, string memory storedHash) {
        if (!certificateExists[certificateId]) {
            return (false, "");
        }
        return (true, certificates[certificateId]);
    }

    /**
     * @dev Revoke a certificate (removes it from chain)
     * @param certificateId ID of certificate to revoke
     */
    function revokeCertificate(string memory certificateId) public onlyOwner {
        require(certificateExists[certificateId], "Certificate does not exist");

        delete certificates[certificateId];
        certificateExists[certificateId] = false;

        emit CertificateRevoked(certificateId, block.timestamp);
    }

    /**
     * @dev Transfer contract ownership
     */
    function transferOwnership(address newOwner) public onlyOwner {
        require(newOwner != address(0), "New owner cannot be zero address");
        owner = newOwner;
    }
}
