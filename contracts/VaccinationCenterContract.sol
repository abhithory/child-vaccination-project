// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

import "./ChildVaccinationContract.sol";

contract VaccinationCenterContract {
    struct Child {
        // string name;
        address childContractAddr;
    }

    mapping(address => Child) public childDetailsOf;

    mapping(address => bool) public registredVaccinationCenter;

    // event childRegistered(address indexed childAddr, address indexed childContractAddr);

    address private admin;

    constructor() {
        admin = msg.sender;
    }

    modifier onlyAdmin() {
        require(msg.sender == admin, "only admin can call");
        _;
    }

    modifier onlyRegistredVaccinationCenter(address vacctinationCenterAddr) {
        require(
            registredVaccinationCenter[vacctinationCenterAddr],
            "vaccination center should be verifed"
        );
        _;
    }

    function registerChild(address childAddr, address vacctinationCenterAddr)
        public
        onlyRegistredVaccinationCenter(vacctinationCenterAddr)
    {
        ChildVaccinationContract _child = ChildVaccinationContract(childAddr);
        childDetailsOf[childAddr] = Child(address(_child));
    }

    function registerVaccinationCenter(address vacctinationCenterAddr)
        public
        onlyAdmin
    {
        registredVaccinationCenter[vacctinationCenterAddr] = true;
    }
}
