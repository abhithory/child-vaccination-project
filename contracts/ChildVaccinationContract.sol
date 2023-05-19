// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

contract ChildVaccinationContract {
    bytes32 public constant ON_BIRTH = keccak256(abi.encodePacked("birth"));
    bytes32 public constant ON_2M_15D = keccak256(abi.encodePacked("2m15d"));
    bytes32 public constant ON_3M_15D = keccak256(abi.encodePacked("3m15d"));
    bytes32 public constant ON_9M = keccak256(abi.encodePacked("9m"));
    bytes32 public constant ON_16M = keccak256(abi.encodePacked("16m"));
    bytes32 public constant ON_5Y = keccak256(abi.encodePacked("5y"));
    bytes32 public constant ON_10Y = keccak256(abi.encodePacked("10y"));
    bytes32 public constant ON_16Y = keccak256(abi.encodePacked("16y"));

    struct OneVaccination {
        string vaccName;
        bool vaccStatus;
        uint256 vaccDate;
    }

    mapping(string => mapping(string => OneVaccination)) childDetails;

    address private childAddr;
    address private vactinationCenterAddr;
    address private registrarAddr;

    constructor(address _childAddr) {
        childAddr = _childAddr;
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
        require(msg.sender == childAddr || msg.sender == registrarAddr);
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
                ON_16Y == childAgeTypeBytes
        );
        _;
    }

    function getChildDetails(
        string memory childAgeType,
        string memory vaccineName
    ) public view childOrVaccnationCenterBoth returns (OneVaccination memory) {
        return childDetails[childAgeType][vaccineName];
    }

    function updateVaccinationStatusBirth(
        string memory childAgeType,
        string memory vaccineName
    ) public onlyVactinationCenter AgeTypeShouldBeInFormat(childAgeType) {
        childDetails[childAgeType][vaccineName] = OneVaccination(
            vaccineName,
            true,
            block.timestamp
        );
    }
}
