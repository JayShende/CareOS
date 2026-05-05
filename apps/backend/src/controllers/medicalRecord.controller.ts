import { Request, Response } from "express";
import httpStatus from "http-status";
import { response } from "../utils/reponses.js";
import ApiError from "../utils/api-error.js";
import medicalRecordService from "../services/medicalRecord.service.js";

const getMedicalRecord = async (req: Request, res: Response) => {
  try {
    if (!req.user?.id) {
      return response(res, httpStatus.UNAUTHORIZED, "Unauthorized", null);
    }
    const medicalRecord = await medicalRecordService.getMedicalRecord(
      req.query as {
        patientId?: string;
        patientName?: string;
      },
      req.user.id,
    );
    return response(
      res,
      httpStatus.OK,
      "Medical Record Fetched Successfully",
      medicalRecord,
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

const getMedicalRecordAttachments = async (req: Request, res: Response) => {
  try {
    if (!req.user?.id) {
      return response(res, httpStatus.UNAUTHORIZED, "Unauthorized", null);
    }
    const medicalRecordAttachments =
      await medicalRecordService.getMedicalRecordAttachments(
        req.query as {
          patientId?: string;
          patientName?: string;
        },
        req.user.id,
      );
    return response(
      res,
      httpStatus.OK,
      "Medical Record Attachments Fetched Successfully",
      medicalRecordAttachments,
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

const createMedicalRecord = async (req: Request, res: Response) => {
  try {
    if (!req.user?.id) {
      return response(res, httpStatus.UNAUTHORIZED, "Unauthorized", null);
    }
    const medicalRecord = await medicalRecordService.createMedicalRecord(
      req.body,
      req.user.id,
    );
    return response(
      res,
      httpStatus.OK,
      "Medical Record Created Successfully",
      medicalRecord,
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

const updateMedicalRecord = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (id === undefined) {
      return response(
        res,
        httpStatus.BAD_REQUEST,
        "Medical Record ID is required",
        null,
      );
    }
    if (!req.user?.id) {
      return response(res, httpStatus.UNAUTHORIZED, "Unauthorized", null);
    }
    const medicalRecord = await medicalRecordService.updateMedicalRecord(
      id as string,
      req.body,
      req.user.id,
    );
    return response(
      res,
      httpStatus.OK,
      "Medical Record Updated Successfully",
      medicalRecord,
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

const addAttachments = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (id === undefined) {
      return response(
        res,
        httpStatus.BAD_REQUEST,
        "Medical Record ID is required",
        null,
      );
    }
    if (!req.user?.id) {
      return response(res, httpStatus.UNAUTHORIZED, "Unauthorized", null);
    }
    const medicalRecord = await medicalRecordService.addAttachments(
      id as string,
      req.body,
      req.user.id,
    );
    return response(
      res,
      httpStatus.OK,
      "Medical Record Attachments Added Successfully",
      medicalRecord,
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
  getMedicalRecord,
  getMedicalRecordAttachments,
  createMedicalRecord,
  updateMedicalRecord,
  addAttachments,
};
