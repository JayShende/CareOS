import { Request, Response } from "express";
import httpStatus from "http-status";
import { response } from "../utils/reponses.js";
import accountService from "../services/account.service.js";
import ApiError from "../utils/api-error.js";
import { APIError, BetterAuthError } from "better-auth";

const createAdminAccount = async (req: Request, res: Response) => {
  try {
    const body = req.body;
    const newAdmin = await accountService.createAdminAccount(body);
    return response(
      res,
      httpStatus.OK,
      "Admin Account Created Successfully",
      newAdmin,
    );
  } catch (error) {
    console.log(error);
    if (error instanceof APIError) {
      return response(res, error.statusCode, error.message, null);
    }
    if (error instanceof ApiError) {
      return response(res, error.statusCode, error.message, null);
    }
    return response(
      res,
      httpStatus.INTERNAL_SERVER_ERROR,
      "Internal server error",
      null,
    );
  }
};

const createEmployeeAccount = async (req: Request, res: Response) => {
  try {
    const body = req.body;
    const newEmployee = await accountService.createEmployeeAccount(
      body,
      req.user?.id as string,
    );
    return response(
      res,
      httpStatus.OK,
      "Employee Account Created Successfully",
      newEmployee,
    );
  } catch (error) {
    console.log(error);
    if (error instanceof APIError) {
      return response(res, error.statusCode, error.message, null);
    }
    if (error instanceof ApiError) {
      return response(res, error.statusCode, error.message, null);
    }
    return response(
      res,
      httpStatus.INTERNAL_SERVER_ERROR,
      "Internal server error",
      null,
    );
  }
};

export default {
  createAdminAccount,
  createEmployeeAccount,
};
