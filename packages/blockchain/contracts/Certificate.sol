// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/// @title Certificate verification for a college project (simple, no advanced security)
contract Certificate {
    address public admin;

    // certificateId => hash
    mapping(string => bytes32) private certificateHashes;

    event CertificateIssued(string certificateId, bytes32 hash);

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can issue");
        _;
    }

    constructor() {
        admin = msg.sender;
    }

    /// @notice Issue a certificate by storing its SHA256 hash
    function issueCertificate(string calldata certificateId, bytes32 hash) external onlyAdmin {
        require(certificateHashes[certificateId] == bytes32(0), "Certificate already issued");
        certificateHashes[certificateId] = hash;
        emit CertificateIssued(certificateId, hash);
    }

    /// @notice Verify a certificate hash
    function verifyCertificate(string calldata certificateId, bytes32 hash) external view returns (bool) {
        return certificateHashes[certificateId] == hash;
    }

    /// @notice Read stored hash (optional helper)
    function getCertificateHash(string calldata certificateId) external view returns (bytes32) {
        return certificateHashes[certificateId];
    }
}
