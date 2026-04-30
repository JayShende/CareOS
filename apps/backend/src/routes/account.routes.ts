import express, { Router } from "express";
import { validate } from "../middlewares/validate.js";
import accountValidator from "../validators/account.validator.js";
import accountController from "../controllers/account.controller.js";

const router: Router = express.Router();

router.post(
  "/createAdminAccount",
  validate(accountValidator.adminAccount),
  accountController.createAdminAccount,
);

router.post(
  "/createEmployeeAccount",
  validate(accountValidator.employeeAccount),
  accountController.createEmployeeAccount,
);


export default router