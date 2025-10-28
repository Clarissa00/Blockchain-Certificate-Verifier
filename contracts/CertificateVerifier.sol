// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// Blockchain Certificate Verifier Project

contract CertificateVerifier {
    address public admin;

    struct Certificate {
        string studentName;
        string courseName;
        string issueDate;
        string certHash;
        bool isValid;
    }

    mapping(string => Certificate) public certificates;

    constructor() {
        admin = msg.sender; // deployer becomes admin
    }

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can issue certificates");
        _;
    }

    // Issue certificate
    function issueCertificate(
        string memory _id,
        string memory _studentName,
        string memory _courseName,
        string memory _issueDate,
        string memory _certHash
    ) public onlyAdmin {
        certificates[_id] = Certificate(_studentName, _courseName, _issueDate, _certHash, true);
    }

    // Verify certificate
    function verifyCertificate(string memory _id)
        public
        view
        returns (
            string memory,
            string memory,
            string memory,
            string memory,
            bool
        )
    {
        Certificate memory cert = certificates[_id];
        return (cert.studentName, cert.courseName, cert.issueDate, cert.certHash, cert.isValid);
    }



Added Solidity smart contract (CertificateVerifier.sol)

    // Revoke certificate (optional)
    function revokeCertificate(string memory _id) public onlyAdmin {
        certificates[_id].isValid = false;
    }
}
