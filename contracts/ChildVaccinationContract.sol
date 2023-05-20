// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

import "hardhat/console.sol";


contract ChildVaccinationContract {
    bytes32 public constant ON_BIRTH = keccak256(abi.encodePacked("birth"));
    bytes32 public constant ON_2M_15D = keccak256(abi.encodePacked("2m15d"));
    bytes32 public constant ON_3M_15D = keccak256(abi.encodePacked("3m15d"));
    bytes32 public constant ON_9M = keccak256(abi.encodePacked("9m"));
    bytes32 public constant ON_16M = keccak256(abi.encodePacked("16m"));
    bytes32 public constant ON_5Y = keccak256(abi.encodePacked("5y"));
    bytes32 public constant ON_10Y = keccak256(abi.encodePacked("10y"));
    bytes32 public constant ON_16Y = keccak256(abi.encodePacked("16y"));

    struct Vaccination {
        string vaccName;
        bool vaccStatus;
        uint256 vaccDate;
        uint256 vaccExpDate;
    }

    mapping(string => mapping(string => Vaccination)) private childDetails; // vaccineCategory=>vaccineDate

    address public childAddr;
    address public vactinationCenterAddr;
    address public registrarAddr;

    // constructor(address _childAddr, address _vacciAddr) {
    constructor(address _childAddr) {
        childAddr = _childAddr;
        vactinationCenterAddr = tx.origin;
        registrarAddr = msg.sender;
    }

    modifier onlyChildUser() {
        require(msg.sender == childAddr);
        _;
    }
    modifier onlyRegistrarUser() {
        require(msg.sender == registrarAddr);
        _;
    }

    modifier onlyVactinationCenter() {
        require(msg.sender == vactinationCenterAddr);
        _;
    }

    modifier childOrVaccnationCenterBoth() {
        require(msg.sender == childAddr || msg.sender == vactinationCenterAddr, "only child or vaccination center can call this");
        _;
    }

    modifier AgeTypeShouldBeInFormat(string memory childAgeType) {
        bytes32 childAgeTypeBytes = keccak256(abi.encodePacked(childAgeType));
        require(
            ON_BIRTH == childAgeTypeBytes ||
                ON_2M_15D == childAgeTypeBytes ||
                ON_3M_15D == childAgeTypeBytes ||
                ON_9M == childAgeTypeBytes ||
                ON_16M == childAgeTypeBytes ||
                ON_5Y == childAgeTypeBytes ||
                ON_10Y == childAgeTypeBytes ||
                ON_16Y == childAgeTypeBytes,"Age type is not correct"
        );
        _;
    }

    function getChildDetails(
        string memory childAgeType,
        string memory vaccineName
    ) public view childOrVaccnationCenterBoth AgeTypeShouldBeInFormat(childAgeType) returns (Vaccination memory) {
        return childDetails[childAgeType][vaccineName];
    }

    function updateVaccinationStatusBirth(
        string memory childAgeType,
        string memory vaccineName,
        uint256 expDate
    ) public  {
        childDetails[childAgeType][vaccineName] = Vaccination(
            vaccineName,
            true,
            block.timestamp,
            expDate
        );
    }
}
