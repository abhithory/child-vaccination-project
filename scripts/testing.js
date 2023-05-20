// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

const { expect } = require("chai");
const ChildVaccinationJson = require("../artifacts/contracts/ChildVaccinationContract.sol/ChildVaccinationContract.json")


async function main() {
  const [owner, vaccinationCenterAddr, childAddr] = await ethers.getSigners();

  const VaccinationCenterContract = await ethers.getContractFactory("VaccinationCenterContract");
  const vaccinationCenterContract = await VaccinationCenterContract.deploy();
  await vaccinationCenterContract.deployed();

  expect(await vaccinationCenterContract.admin()).to.equal(owner.address);
  console.log("admin is correct");

  expect(await vaccinationCenterContract.registredVaccinationCenter(vaccinationCenterAddr.address)).to.equal(false);
  await vaccinationCenterContract.registerVaccinationCenter(vaccinationCenterAddr.address);
  expect(await vaccinationCenterContract.registredVaccinationCenter(vaccinationCenterAddr.address)).to.equal(true);
  console.log("Vaccination center registred");

  const _childDetials = await vaccinationCenterContract.childDetailsOf(childAddr.address)
  expect(_childDetials.registredStatus).to.equal(false);
  expect(_childDetials.childContractAddr).to.equal("0x0000000000000000000000000000000000000000");
  // await vaccinationCenterContract.registerChild(childAddr.address);// should reject
  await vaccinationCenterContract.connect(vaccinationCenterAddr).registerChild(childAddr.address);
  const _childDetialsUpdated = await vaccinationCenterContract.childDetailsOf(childAddr.address);
  expect(_childDetialsUpdated.registredStatus).to.equal(true);
  expect(_childDetialsUpdated.childContractAddr).to.not.equal("0x0000000000000000000000000000000000000000");
  console.log("Child Registred");

  

  const childVaccinationContract = new ethers.Contract( _childDetialsUpdated.childContractAddr, ChildVaccinationJson.abi ,vaccinationCenterAddr )
  // const _onBirthDetails = await childVaccinationContract.getChildDetails(ON_BIRTH,"opc");
  const _onBirthDetails = await childVaccinationContract.childAddr();
  // const _onBirthDetails = await childVaccinationContract.connect(childAddr).getChildDetails(ON_BIRTH,"opc");
  console.log(_onBirthDetails);

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
