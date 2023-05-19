// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

contract ChildContract {
    address private childAddr;
    address private registrarAddr;

    struct OneVaccination {
        string vaccName;
        bool vaccStatus;
        uint256 vaccDate;
    }

    struct BirthStruct {
        OneVaccination OPV0;
        OneVaccination HepB;
        OneVaccination BCG;
    }

    struct M1D15Struct {
        OneVaccination OPV1;
        OneVaccination PENTA1;
        OneVaccination ROTA1;
        OneVaccination PCV1;
        OneVaccination IPV1;
    }

    struct M2D15Struct {
        OneVaccination OPV2;
        OneVaccination PENTA2;
        OneVaccination ROTA2;
    }

    struct M3D15Struct {
        OneVaccination OPV3;
        OneVaccination PENTA3;
        OneVaccination ROTA3;
        OneVaccination PCV2;
        OneVaccination IPV2;
    }

    struct M9Struct {
        OneVaccination MR1;
        OneVaccination JE1;
        OneVaccination VA1;
        OneVaccination PCV3;
    }

    struct M16Struct {
        OneVaccination DPTB1;
        OneVaccination VA2;
        OneVaccination MR2;
        OneVaccination JE2;
        OneVaccination OPVB;
    }

    struct Y5Struct {
        OneVaccination DPTB2;
    }

    struct Y10Struct {
        OneVaccination TT;
    }

    struct Y16Struct {
        OneVaccination TT;
    }

    struct ChildVaccinationStruct {
        BirthStruct onBirth;
        M1D15Struct on1M15DBirth;
        M2D15Struct on2M15DBirth;
        M3D15Struct on3M15DBirth;
        M9Struct on9MBirth;
        M16Struct on16m24Birth;
        Y5Struct on5y6Birth;
        Y10Struct on10YBirth;
        Y16Struct on16YBirth;
    }

    ChildVaccinationStruct childDetails;

    constructor(address _childAddr) {
        childAddr = _childAddr;
        registrarAddr = msg.sender;
    }

    function getChildDetails()
        public
        view
        returns (ChildVaccinationStruct memory)
    {
        return childDetails;
    }

    function setChildDetails() public {
        childDetails.onBirth = BirthStruct(
            OneVaccination("vacc11", true, block.timestamp),
            OneVaccination("vacc11", true, block.timestamp),
            OneVaccination("vacc11", true, block.timestamp)
        );
    }
}
