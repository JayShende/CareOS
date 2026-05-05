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

const createPrescription = async (req: Request, res: Response) => {
  try {
    if (!req.user?.id) {
      return response(res, httpStatus.UNAUTHORIZED, "Unauthorized", null);
    }
    const prescription = await medicalRecordService.createPrescription(
      req.body,
      req.user.id,
    );
    return response(
      res,
      httpStatus.OK,
      "Prescription Created Successfully",
      prescription,
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

const getPrescriptions = async (req: Request, res: Response) => {
  try {
    if (!req.user?.id) {
      return response(res, httpStatus.UNAUTHORIZED, "Unauthorized", null);
    }
    const prescriptions = await medicalRecordService.getPrescriptions(
      req.query as {
        medicalRecordId?: string;
      },
      req.user.id,
    );
    return response(
      res,
      httpStatus.OK,
      "Prescriptions Fetched Successfully",
      prescriptions,
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

const getPrescriptionById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (id === undefined) {
      return response(
        res,
        httpStatus.BAD_REQUEST,
        "Prescription ID is required",
        null,
      );
    }
    if (!req.user?.id) {
      return response(res, httpStatus.UNAUTHORIZED, "Unauthorized", null);
    }
    const prescription = await medicalRecordService.getPrescriptionById(
      id as string,
      req.user.id,
    );
    return response(
      res,
      httpStatus.OK,
      "Prescription Fetched Successfully",
      prescription,
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

const updatePrescription = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (id === undefined) {
      return response(
        res,
        httpStatus.BAD_REQUEST,
        "Prescription ID is required",
        null,
      );
    }
    if (!req.user?.id) {
      return response(res, httpStatus.UNAUTHORIZED, "Unauthorized", null);
    }
    const prescription = await medicalRecordService.updatePrescription(
      id as string,
      req.body,
      req.user.id,
    );
    return response(
      res,
      httpStatus.OK,
      "Prescription Updated Successfully",
      prescription,
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

const deletePrescription = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (id === undefined) {
      return response(
        res,
        httpStatus.BAD_REQUEST,
        "Prescription ID is required",
        null,
      );
    }
    if (!req.user?.id) {
      return response(res, httpStatus.UNAUTHORIZED, "Unauthorized", null);
    }
    const prescription = await medicalRecordService.deletePrescription(
      id as string,
      req.user.id,
    );
    return response(
      res,
      httpStatus.OK,
      "Prescription Deleted Successfully",
      prescription,
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

const addMedicineLineItem = async (req: Request, res: Response) => {
  try {
    const { prescriptionId } = req.params;
    if (prescriptionId === undefined) {
      return response(
        res,
        httpStatus.BAD_REQUEST,
        "Prescription ID is required",
        null,
      );
    }
    if (!req.user?.id) {
      return response(res, httpStatus.UNAUTHORIZED, "Unauthorized", null);
    }
    const lineItem = await medicalRecordService.addMedicineLineItem(
      prescriptionId as string,
      req.body,
      req.user.id,
    );
    return response(
      res,
      httpStatus.OK,
      "Medicine Line Item Added Successfully",
      lineItem,
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

const updateMedicineLineItem = async (req: Request, res: Response) => {
  try {
    const { lineItemId } = req.params;
    if (lineItemId === undefined) {
      return response(
        res,
        httpStatus.BAD_REQUEST,
        "Line Item ID is required",
        null,
      );
    }
    if (!req.user?.id) {
      return response(res, httpStatus.UNAUTHORIZED, "Unauthorized", null);
    }
    const lineItem = await medicalRecordService.updateMedicineLineItem(
      lineItemId as string,
      req.body,
      req.user.id,
    );
    return response(
      res,
      httpStatus.OK,
      "Medicine Line Item Updated Successfully",
      lineItem,
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

const removeMedicineLineItem = async (req: Request, res: Response) => {
  try {
    const { lineItemId } = req.params;
    if (lineItemId === undefined) {
      return response(
        res,
        httpStatus.BAD_REQUEST,
        "Line Item ID is required",
        null,
      );
    }
    if (!req.user?.id) {
      return response(res, httpStatus.UNAUTHORIZED, "Unauthorized", null);
    }
    const lineItem = await medicalRecordService.removeMedicineLineItem(
      lineItemId as string,
      req.user.id,
    );
    return response(
      res,
      httpStatus.OK,
      "Medicine Line Item Removed Successfully",
      lineItem,
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

const createMedicine = async (req: Request, res: Response) => {
  try {
    if (!req.user?.id) {
      return response(res, httpStatus.UNAUTHORIZED, "Unauthorized", null);
    }
    const medicine = await medicalRecordService.createMedicine(
      req.body,
      req.user.id,
    );
    return response(
      res,
      httpStatus.OK,
      "Medicine Created Successfully",
      medicine,
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

const getMedicines = async (req: Request, res: Response) => {
  try {
    if (!req.user?.id) {
      return response(res, httpStatus.UNAUTHORIZED, "Unauthorized", null);
    }
    const medicines = await medicalRecordService.getMedicines(
      req.query as {
        search?: string;
      },
      req.user.id,
    );
    return response(
      res,
      httpStatus.OK,
      "Medicines Fetched Successfully",
      medicines,
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

const getMedicineById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (id === undefined) {
      return response(
        res,
        httpStatus.BAD_REQUEST,
        "Medicine ID is required",
        null,
      );
    }
    if (!req.user?.id) {
      return response(res, httpStatus.UNAUTHORIZED, "Unauthorized", null);
    }
    const medicine = await medicalRecordService.getMedicineById(
      id as string,
      req.user.id,
    );
    return response(
      res,
      httpStatus.OK,
      "Medicine Fetched Successfully",
      medicine,
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

const updateMedicine = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (id === undefined) {
      return response(
        res,
        httpStatus.BAD_REQUEST,
        "Medicine ID is required",
        null,
      );
    }
    if (!req.user?.id) {
      return response(res, httpStatus.UNAUTHORIZED, "Unauthorized", null);
    }
    const medicine = await medicalRecordService.updateMedicine(
      id as string,
      req.body,
      req.user.id,
    );
    return response(
      res,
      httpStatus.OK,
      "Medicine Updated Successfully",
      medicine,
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

const deleteMedicine = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (id === undefined) {
      return response(
        res,
        httpStatus.BAD_REQUEST,
        "Medicine ID is required",
        null,
      );
    }
    if (!req.user?.id) {
      return response(res, httpStatus.UNAUTHORIZED, "Unauthorized", null);
    }
    const medicine = await medicalRecordService.deleteMedicine(
      id as string,
      req.user.id,
    );
    return response(
      res,
      httpStatus.OK,
      "Medicine Deleted Successfully",
      medicine,
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
  createPrescription,
  getPrescriptions,
  getPrescriptionById,
  updatePrescription,
  deletePrescription,
  addMedicineLineItem,
  updateMedicineLineItem,
  removeMedicineLineItem,
  createMedicine,
  getMedicines,
  getMedicineById,
  updateMedicine,
  deleteMedicine,
};
