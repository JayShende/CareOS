import express, { Router } from "express";
import testController from "../controllers/test.controller.js";

const router: Router = express.Router();

router.get("/loggerAPI", testController.loggerFunction);
export default router;
