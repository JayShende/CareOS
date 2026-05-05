import { Request, Response } from "express";
import HttpStatus from "http-status";
import testService from "../services/test.service.js";
import { response } from "../utils/reponses.js";

const loggerFunction = (req: Request, res: Response) => {
  const answer = testService.logger();

  return response(res, HttpStatus.OK, "All Okay", answer);
};

export default {
  loggerFunction,
};
