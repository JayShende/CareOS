import express, { Router } from "express";
import testRoute from "./test.route.js";
import accountRoutes from "./account.routes.js";
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
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;
