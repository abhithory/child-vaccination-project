const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");

describe("VaccinationCenterContract", function () {

  const ON_BIRTH = "birth";
  const ON_2M_15D = "2m15d";
  const ON_3M_15D = "3m15d";
  const ON_9M = "9m";
  const ON_16M = "16m";
  const ON_5Y = "5y";
  const ON_10Y = "10y";
  const ON_16Y = "16y";

  const OPV0 = "OPV-0";
  const HEPB = "hep B";
  const BCG = "BCG";

  // const OPV1 = "OPV-1";
  // const Penta1 = "Penta-1";

  const gasDetails = {
    "registerVaccinationCenter":0,
    "registerChild":0,
    "updateVaccinationStatus":0,
    "getChildDetails":0,
  }



  async function deployVaccinationCenterContract() {
    const VaccinationCenterContract = await ethers.getContractFactory("VaccinationCenterContract");
    const [owner, vaccinationCenterAddr, childAddr] = await ethers.getSigners();

    const vaccinationCenterContract = await VaccinationCenterContract.deploy();
    await vaccinationCenterContract.deployed();


    return { vaccinationCenterContract, owner, vaccinationCenterAddr, childAddr };
  }

  describe("Deployment", function () {


    it("Should set the right admin", async function () {
      const { vaccinationCenterContract, owner, vaccinationCenterAddr, childAddr } = await loadFixture(deployVaccinationCenterContract);

      expect(await vaccinationCenterContract.admin()).to.equal(owner.address);
    });

    it("Should register Vaccination Center status", async function () {
      const { vaccinationCenterContract, owner, vaccinationCenterAddr, childAddr } = await loadFixture(deployVaccinationCenterContract);

      expect(await vaccinationCenterContract.registredVaccinationCenter(vaccinationCenterAddr.address)).to.equal(false);
      const txRegisterVaccCenter = await vaccinationCenterContract.registerVaccinationCenter(vaccinationCenterAddr.address);
      gasDetails.registerVaccinationCenter = Number((await txRegisterVaccCenter.wait()).gasUsed)
      expect(await vaccinationCenterContract.registredVaccinationCenter(vaccinationCenterAddr.address)).to.equal(true);
    });

    it("Should deploy Child with correct details", async function () {
      const { vaccinationCenterContract, owner, vaccinationCenterAddr, childAddr } = await loadFixture(deployVaccinationCenterContract);

      await vaccinationCenterContract.registerVaccinationCenter(vaccinationCenterAddr.address);
      expect(await vaccinationCenterContract.registredVaccinationCenter(vaccinationCenterAddr.address)).to.equal(true);

      const _childDetials = await vaccinationCenterContract.childDetailsOf(childAddr.address)
      expect(_childDetials.registredStatus).to.equal(false);
      expect(_childDetials.childContractAddr).to.equal("0x0000000000000000000000000000000000000000");
      // await vaccinationCenterContract.registerChild(childAddr.address);// should reject
      const txRegisterChild = await vaccinationCenterContract.connect(vaccinationCenterAddr).registerChild(childAddr.address);
      gasDetails.registerChild = Number((await txRegisterChild.wait()).gasUsed)
         
      const _childDetialsUpdated = await vaccinationCenterContract.childDetailsOf(childAddr.address);

      expect(_childDetialsUpdated.registredStatus).to.equal(true);
      expect(_childDetialsUpdated.childContractAddr).to.not.equal("0x0000000000000000000000000000000000000000");
    });
  });


  function convertDataInSecs(_date) {
    const date = new Date(_date);
    return date.getTime() / 1000;
  }

  function secsToDate (_sec){
    return (new Date(Number(_sec * 1000))).toLocaleString('en-US', {
      // dateStyle: 'full',
      // timeStyle: 'full',
      hour12: true,
    })
  }
  describe("Working with ChildVaccinationContract", function () {

    async function UpdateVaccinationStatus(_ageType,_vaccName,_expDate){
      const { vaccinationCenterContract, owner, vaccinationCenterAddr, childAddr } = await loadFixture(deployVaccinationCenterContract);
      await vaccinationCenterContract.registerVaccinationCenter(vaccinationCenterAddr.address);
      await vaccinationCenterContract.connect(vaccinationCenterAddr).registerChild(childAddr.address);

      const _childDetails = await vaccinationCenterContract.childDetailsOf(childAddr.address);

      const ChildVaccinationContract = await ethers.getContractFactory("ChildVaccinationContract");
      const childVaccinationContract = await ChildVaccinationContract.attach(_childDetails.childContractAddr);

      const childVaccDetails = await childVaccinationContract.connect(vaccinationCenterAddr).getChildDetails(_ageType, _vaccName);
      expect(childVaccDetails.vaccStatus).to.equal(false);

      const txUpdateVaccination = await childVaccinationContract.connect(vaccinationCenterAddr).updateVaccinationStatusBirth(_ageType, _vaccName,convertDataInSecs(_expDate));
      gasDetails.updateVaccinationStatus = Number((await txUpdateVaccination.wait()).gasUsed)

      return await childVaccinationContract.connect(vaccinationCenterAddr).getChildDetails(_ageType, _vaccName);
    }
    it("set and get OPV0 Child VaccinationDetails on birth", async function () {
      const updatedChildVaccDetails = await UpdateVaccinationStatus(ON_BIRTH,OPV0,"2023-10-30");
      console.table({"Vaccination Name":updatedChildVaccDetails.vaccName,"Vaccination Date":secsToDate(updatedChildVaccDetails.vaccDate),"Vaccination Expiry Data":secsToDate(updatedChildVaccDetails.vaccExpDate)});

    });

    it("set and get HEPB Child VaccinationDetails on birth", async function () {
      

      const updatedChildVaccDetails = await UpdateVaccinationStatus(ON_BIRTH,HEPB,"2023-11-15");
      console.table({"Vaccination Name":updatedChildVaccDetails.vaccName,"Vaccination Date":secsToDate(updatedChildVaccDetails.vaccDate),"Vaccination Expiry Data":secsToDate(updatedChildVaccDetails.vaccExpDate)});
    });

    it("set and get BCG Child VaccinationDetails on birth", async function () {
      const updatedChildVaccDetails = await UpdateVaccinationStatus(ON_BIRTH,BCG,"2023-09-18");
      console.table({"Vaccination Name":updatedChildVaccDetails.vaccName,"Vaccination Date":secsToDate(updatedChildVaccDetails.vaccDate),"Vaccination Expiry Data":secsToDate(updatedChildVaccDetails.vaccExpDate)});
    });
  })
  describe("Checking gas used", function () {
    it("gas used in these transactions", async function () {
      console.table(gasDetails);
    })
  })

});
