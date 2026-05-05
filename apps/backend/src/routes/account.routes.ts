import express, { Router } from "express";
import { validate } from "../middlewares/validate.js";
import accountValidator from "../validators/account.validator.js";
import accountController from "../controllers/account.controller.js";
import { isAuthenticated } from "../middlewares/auth.middleware.js";

const router: Router = express.Router();

router.post(
  "/createAdminAccount",
  validate(accountValidator.adminAccount),
  accountController.createAdminAccount,
);

router.post(
  "/createDoctorAccount",
  isAuthenticated,
  validate(accountValidator.doctorAccount),
  accountController.createDoctorAccount,
);
router.post(
  "/createReceptionistAccount",
  isAuthenticated,
  validate(accountValidator.receptionistAccount),
  accountController.createReceptionistAccount,
);

export default router;
