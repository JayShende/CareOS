import express, { Router } from "express";
import { validate } from "../middlewares/validate.js";
import { isAuthenticated } from "../middlewares/auth.middleware.js";
import appointmentValidator from "../validators/appointment.validator.js";
import appointmentController from "../controllers/appointment.controller.js";

const router: Router = express.Router();

router.post(
  "/createAppointment",
  isAuthenticated,
  validate(appointmentValidator.createAppointment),
  appointmentController.createAppointment,
);

router.get(
  "/getAppointments",
  isAuthenticated,
  validate(appointmentValidator.getAppointments),
  appointmentController.getAppointments,
);

router.get(
  "/getAppointment/:id",
  isAuthenticated,
  appointmentController.getAppointmentById,
);

router.put(
  "/updateAppointment/:id",
  isAuthenticated,
  validate(appointmentValidator.updateAppointment),
  appointmentController.updateAppointment,
);

router.patch(
  "/updateAppointmentStatus/:id",
  isAuthenticated,
  validate(appointmentValidator.updateAppointmentStatus),
  appointmentController.updateAppointmentStatus,
);

router.delete(
  "/deleteAppointment/:id",
  isAuthenticated,
  appointmentController.deleteAppointment,
);

export default router;
