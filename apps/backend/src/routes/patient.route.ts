import express, { Router } from "express";
import { validate } from "../middlewares/validate.js";
import { isAuthenticated } from "../middlewares/auth.middleware.js";
import patientValidator from "../validators/patient.validator.js";
import patientController from "../controllers/patient.controller.js";

const router: Router = express.Router();

router.post(
  "/createAccount",
  isAuthenticated,
  validate(patientValidator.createPatient),
  patientController.createPatient,
);

router.get(
  "/getPatient/:id",
  isAuthenticated,
  patientController.getPatientById,
);

router.put(
  "/updatePatientPersonalInformation/:id",
  isAuthenticated,
  validate(patientValidator.updatePatientPersonalInformation),
  patientController.updatePatientPersonalInformation,
);

export default router;
