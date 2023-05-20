// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

import "./ChildVaccinationContract.sol";

import "hardhat/console.sol";

contract VaccinationCenterContract {
     struct Child {
          // string name;
          bool registredStatus;
          address childContractAddr;
     }

     mapping(address => Child) public childDetailsOf;

     mapping(address => bool) public registredVaccinationCenter;

     // event childRegistered(address indexed childAddr, address indexed childContractAddr);

     address public admin;

     constructor() {
          admin = msg.sender;
     }

     modifier onlyAdmin() {
          require(msg.sender == admin, "only admin can call");
          _;
     }

     modifier onlyRegistredVaccinationCenter() {
          require(
               registredVaccinationCenter[msg.sender],
               "vaccination center should be verifed"
          );
          _;
     }

     function registerChild(
          address childAddr
     ) public onlyRegistredVaccinationCenter {
          ChildVaccinationContract _child = new ChildVaccinationContract(childAddr);
          childDetailsOf[childAddr] = Child(true, address(_child));
     }

     function registerVaccinationCenter(
          address vacctinationCenterAddr
     ) public onlyAdmin {
          registredVaccinationCenter[vacctinationCenterAddr] = true;
     }
}
