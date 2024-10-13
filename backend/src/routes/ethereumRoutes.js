const express = require("express");
const router = express.Router();
const ethereumController = require("../controllers/ethereumController");

router.get("/balance/:address", ethereumController.getBalance);
router.get("/accounts", ethereumController.getAccounts);

router.get("/user/:address", ethereumController.getUser);
router.get("/usersCount", ethereumController.getUsersCount);
router.get("/getAllUsers", ethereumController.getAllUsers);

router.post("/createUser", ethereumController.createUser);
router.post("/activateUser/:address", ethereumController.activateUser);
router.post("/changeRole", ethereumController.changeRole);
router.post("/deactivateUser/:address", ethereumController.deactivateUser);
router.post("/deleteUser/:address", ethereumController.deleteUser);

router.get(
  "/doctor/getAllPatientsForDoctor/:doctorAddress",
  ethereumController.getAllPatientsForDoctor
);
router.post(
  "/doctor/prescribeMedication/:doctorAddress",
  ethereumController.prescribeMedication
);
router.get(
  "/doctor/getPatientPrescriptions/:doctorAddress/:address",
  ethereumController.getPatientPrescriptions
);

router.get(
  "/patient/viewMyDoctors/:patientAddress",
  ethereumController.viewMyDoctors
);

router.get(
  "/patient/getPrescriptionsByDoctor/:patientAddress/:doctorAddress",
  ethereumController.getPrescriptionsByDoctor
);

module.exports = router;
