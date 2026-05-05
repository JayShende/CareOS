import express, { Router } from "express";
import { validate } from "../middlewares/validate.js";
import { isAuthenticated } from "../middlewares/auth.middleware.js";
import medicalRecordValidator from "../validators/medicalRecord.validator.js";
import medicalRecordController from "../controllers/medicalRecord.controller.js";

const router: Router = express.Router();

router.post(
  "/createMedicalRecord",
  isAuthenticated,
  validate(medicalRecordValidator.createMedicalRecord),
  medicalRecordController.createMedicalRecord,
);

router.get(
  "/getMedicalRecord",
  isAuthenticated,
  validate(medicalRecordValidator.getMedicalRecord),
  medicalRecordController.getMedicalRecord,
);

router.get(
  "/getMedicalRecordAttachments",
  isAuthenticated,
  validate(medicalRecordValidator.getMedicalRecordAttachments),
  medicalRecordController.getMedicalRecordAttachments,
);

router.put(
  "/updateMedicalRecord/:id",
  isAuthenticated,
  validate(medicalRecordValidator.updateMedicalRecord),
  medicalRecordController.updateMedicalRecord,
);

router.patch(
  "/addAttachments/:id",
  isAuthenticated,
  validate(medicalRecordValidator.addAttachments),
  medicalRecordController.addAttachments,
);

export default router;
