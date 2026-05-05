import express, { Router } from "express";
import testRoute from "./test.route.js";
import accountRoutes from "./account.routes.js";
import patientRoutes from "./patient.route.js";
import appointmentRoutes from "./appointment.route.js";
import medicalRecordRoutes from "./medicalRecord.route.js";
const router: Router = express.Router();

const defaultRoutes = [
  {
    path: "/test",
    route: testRoute,
  },
  {
    path: "/accounts",
    route: accountRoutes,
  },
  {
    path: "/patient",
    route: patientRoutes,
  },
  {
    path: "/appointment",
    route: appointmentRoutes,
  },
  {
    path: "/medicalRecord",
    route: medicalRecordRoutes,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;
