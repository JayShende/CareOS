import { z } from "zod";

enum AppointmentStatus {
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED",
  CANCELLED = "CANCELLED",
}

const createAppointment = z.object({
  body: z.object({
    patientId: z.string({ message: "patientId must be a valid String" }),
    doctorId: z.string({ message: "doctorId must be a valid String" }),
    scheduledAt: z.string({ message: "scheduledAt must be a valid Date String" }),
    status: z.enum(AppointmentStatus).optional(),
  }),
});

const updateAppointment = z.object({
  body: z.object({
    patientId: z.string({ message: "patientId must be a valid String" }).optional(),
    doctorId: z.string({ message: "doctorId must be a valid String" }).optional(),
    scheduledAt: z
      .string({ message: "scheduledAt must be a valid Date String" })
      .optional(),
    status: z.enum(AppointmentStatus).optional(),
  }),
});

const getAppointments = z.object({
  query: z.object({
    patientId: z.string({ message: "patientId must be a valid String" }).optional(),
    doctorId: z.string({ message: "doctorId must be a valid String" }).optional(),
    fromDate: z.string({ message: "fromDate must be a valid Date String" }).optional(),
    toDate: z.string({ message: "toDate must be a valid Date String" }).optional(),
    status: z.enum(AppointmentStatus).optional(),
  }),
});

const updateAppointmentStatus = z.object({
  body: z.object({
    status: z.enum(AppointmentStatus),
  }),
});

export default {
  createAppointment,
  updateAppointment,
  getAppointments,
  updateAppointmentStatus,
};
