const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");

const ChildVaccinationJson = require("../artifacts/contracts/ChildVaccinationContract.sol/ChildVaccinationContract.json")

describe("VaccinationCenterContract", function () {

  const ON_BIRTH = "birth";
  const ON_2M_15D = "2m15d";
  const ON_3M_15D = "3m15d";
  const ON_9M = "9m";
  const ON_16M = "16m";
  const ON_5Y = "5y";
  const ON_10Y = "10y";
  const ON_16Y = "16y";


  describe("Testing entire WorkFlow", function () {
    async function deployVaccinationCenterContract() {
      const VaccinationCenterContract = await ethers.getContractFactory("VaccinationCenterContract");
      const [owner, vaccinationCenterAddr, childAddr] = await ethers.getSigners();

      const vaccinationCenterContract = await VaccinationCenterContract.deploy();
      await vaccinationCenterContract.deployed();


      return { vaccinationCenterContract, owner, vaccinationCenterAddr, childAddr };
    }

    it("Testing entire workflow", async function () {
      const { vaccinationCenterContract, owner, vaccinationCenterAddr, childAddr } = await loadFixture(deployVaccinationCenterContract);


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


      const childVaccinationContract = new ethers.Contract(_childDetialsUpdated.childContractAddr, ChildVaccinationJson.abi, vaccinationCenterAddr)

      // const _onBirthDetails = await childVaccinationContract.connect(childAddr).getChildDetails(ON_BIRTH,"opc");
      const _onBirthDetails = await childVaccinationContract.getChildDetails(ON_BIRTH,"opc");
      console.log(_onBirthDetails);

    });
  });


});
