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

router.post(
  "/createPrescription",
  isAuthenticated,
  validate(medicalRecordValidator.createPrescription),
  medicalRecordController.createPrescription,
);

router.get(
  "/getPrescriptions",
  isAuthenticated,
  validate(medicalRecordValidator.getPrescriptions),
  medicalRecordController.getPrescriptions,
);

router.get(
  "/getPrescription/:id",
  isAuthenticated,
  medicalRecordController.getPrescriptionById,
);

router.put(
  "/updatePrescription/:id",
  isAuthenticated,
  validate(medicalRecordValidator.updatePrescription),
  medicalRecordController.updatePrescription,
);

router.delete(
  "/deletePrescription/:id",
  isAuthenticated,
  medicalRecordController.deletePrescription,
);

router.post(
  "/addMedicineLineItem/:prescriptionId",
  isAuthenticated,
  validate(medicalRecordValidator.addMedicineLineItem),
  medicalRecordController.addMedicineLineItem,
);

router.put(
  "/updateMedicineLineItem/:lineItemId",
  isAuthenticated,
  validate(medicalRecordValidator.updateMedicineLineItem),
  medicalRecordController.updateMedicineLineItem,
);

router.delete(
  "/removeMedicineLineItem/:lineItemId",
  isAuthenticated,
  medicalRecordController.removeMedicineLineItem,
);

router.post(
  "/createMedicine",
  isAuthenticated,
  validate(medicalRecordValidator.createMedicine),
  medicalRecordController.createMedicine,
);

router.get(
  "/getMedicines",
  isAuthenticated,
  validate(medicalRecordValidator.getMedicines),
  medicalRecordController.getMedicines,
);

router.get(
  "/getMedicine/:id",
  isAuthenticated,
  medicalRecordController.getMedicineById,
);

router.put(
  "/updateMedicine/:id",
  isAuthenticated,
  validate(medicalRecordValidator.updateMedicine),
  medicalRecordController.updateMedicine,
);

router.delete(
  "/deleteMedicine/:id",
  isAuthenticated,
  medicalRecordController.deleteMedicine,
);

export default router;
