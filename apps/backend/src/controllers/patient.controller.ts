import { Request, Response } from "express";
import httpStatus from "http-status";
import { response } from "../utils/reponses.js";
import ApiError from "../utils/api-error.js";
import patientService from "../services/patient.service.js";

const createPatient = async (req: Request, res: Response) => {
  try {
    const body = req.body;
    if (!req.user?.id) {
      return response(res, httpStatus.UNAUTHORIZED, "Unauthorized", null);
    }
    const newPatient = await patientService.createPatient(body, req.user.id);
    return response(
      res,
      httpStatus.OK,
      "Patient Created Successfully",
      newPatient,
    );
  } catch (error) {
    console.log(error);
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

const getPatientById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (id === undefined) {
      return response(
        res,
        httpStatus.BAD_REQUEST,
        "Patient ID is required",
        null,
      );
    }
    if (!req.user?.id) {
      return response(res, httpStatus.UNAUTHORIZED, "Unauthorized", null);
    }
    const patient = await patientService.getPatientById(
      id as string,
      req.user.id,
    );
    return response(
      res,
      httpStatus.OK,
      "Patient Fetched Successfully",
      patient,
    );
  } catch (error) {
    console.log(error);
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

const updatePatientPersonalInformation = async (
  req: Request,
  res: Response,
) => {
  try {
    const { patientId } = req.params;
    if (patientId === undefined) {
      return response(
        res,
        httpStatus.BAD_REQUEST,
        "Patient ID is required",
        null,
      );
    }
    if (!req.user?.id) {
      return response(res, httpStatus.UNAUTHORIZED, "Unauthorized", null);
    }
    const updatedPatient =
      await patientService.updatePatientPersonalInformation(
        patientId as string,
        req.body,
        req.user.id,
      );
    return response(
      res,
      httpStatus.OK,
      "Patient Updated Successfully",
      updatedPatient,
    );
  } catch (error) {
    console.log(error);
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
  createPatient,
  getPatientById,
  updatePatientPersonalInformation,
};
