import { Request, Response } from "express";
import httpStatus from "http-status";
import { response } from "../utils/reponses.js";
import ApiError from "../utils/api-error.js";
import appointmentService from "../services/appointment.service.js";

const createAppointment = async (req: Request, res: Response) => {
  try {
    if (!req.user?.id) {
      return response(res, httpStatus.UNAUTHORIZED, "Unauthorized", null);
    }
    const appointment = await appointmentService.createAppointment(
      req.body,
      req.user.id,
    );
    return response(
      res,
      httpStatus.OK,
      "Appointment Created Successfully",
      appointment,
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

const getAppointments = async (req: Request, res: Response) => {
  try {
    if (!req.user?.id) {
      return response(res, httpStatus.UNAUTHORIZED, "Unauthorized", null);
    }
    const appointments = await appointmentService.getAppointments(
      req.query as {
        patientId?: string;
        doctorId?: string;
        fromDate?: string;
        toDate?: string;
        status?: "PENDING" | "CONFIRMED" | "CANCELLED";
      },
      req.user.id,
    );
    return response(
      res,
      httpStatus.OK,
      "Appointments Fetched Successfully",
      appointments,
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

const getAppointmentById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (id === undefined) {
      return response(
        res,
        httpStatus.BAD_REQUEST,
        "Appointment ID is required",
        null,
      );
    }
    if (!req.user?.id) {
      return response(res, httpStatus.UNAUTHORIZED, "Unauthorized", null);
    }
    const appointment = await appointmentService.getAppointmentById(
      id as string,
      req.user.id,
    );
    return response(
      res,
      httpStatus.OK,
      "Appointment Fetched Successfully",
      appointment,
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

const updateAppointment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (id === undefined) {
      return response(
        res,
        httpStatus.BAD_REQUEST,
        "Appointment ID is required",
        null,
      );
    }
    if (!req.user?.id) {
      return response(res, httpStatus.UNAUTHORIZED, "Unauthorized", null);
    }
    const updatedAppointment = await appointmentService.updateAppointment(
      id as string,
      req.body,
      req.user.id,
    );
    return response(
      res,
      httpStatus.OK,
      "Appointment Updated Successfully",
      updatedAppointment,
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

const deleteAppointment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (id === undefined) {
      return response(
        res,
        httpStatus.BAD_REQUEST,
        "Appointment ID is required",
        null,
      );
    }
    if (!req.user?.id) {
      return response(res, httpStatus.UNAUTHORIZED, "Unauthorized", null);
    }
    const deletedAppointment = await appointmentService.deleteAppointment(
      id as string,
      req.user.id,
    );
    return response(
      res,
      httpStatus.OK,
      "Appointment Deleted Successfully",
      deletedAppointment,
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

const updateAppointmentStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (id === undefined) {
      return response(
        res,
        httpStatus.BAD_REQUEST,
        "Appointment ID is required",
        null,
      );
    }
    if (!req.user?.id) {
      return response(res, httpStatus.UNAUTHORIZED, "Unauthorized", null);
    }
    const updatedAppointment = await appointmentService.updateAppointmentStatus(
      id as string,
      req.body.status,
      req.user.id,
    );
    return response(
      res,
      httpStatus.OK,
      "Appointment Status Updated Successfully",
      updatedAppointment,
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
  createAppointment,
  getAppointments,
  getAppointmentById,
  updateAppointment,
  deleteAppointment,
  updateAppointmentStatus,
};
