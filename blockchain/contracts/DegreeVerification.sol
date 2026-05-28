// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract DegreeVerification {
    address public admin;

    // Mapping to store valid degree hashes
    mapping(string => bool) public validDegrees;

    // Mapping to store timestamp when a degree was issued
    mapping(string => uint256) public issueDate;

    // Event emitted when a new degree is added
    event DegreeAdded(string degreeHash, uint256 timestamp);

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action");
        _;
    }

    constructor() {
        admin = msg.sender;
    }

    /**
     * @dev Add a new degree hash to the blockchain
     * @param _hash The SHA-256 hash of the degree data
     */
    function addDegree(string memory _hash) public onlyAdmin {
        require(!validDegrees[_hash], "Degree already exists");
        
        validDegrees[_hash] = true;
        issueDate[_hash] = block.timestamp;
        
        emit DegreeAdded(_hash, block.timestamp);
    }

    /**
     * @dev Verify if a degree hash exists on the blockchain
     * @param _hash The SHA-256 hash of the degree data to verify
     * @return bool True if valid, false otherwise
     * @return uint256 The timestamp when it was issued (0 if not valid)
     */
    function verifyDegree(string memory _hash) public view returns (bool, uint256) {
        return (validDegrees[_hash], issueDate[_hash]);
    }
}
