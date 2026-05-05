import httpStatus from "http-status";
import ApiError from "../utils/api-error.js";
import { prisma } from "@repo/database";

enum Roles {
  ADMIN = "ADMIN",
  DOCTOR = "DOCTOR",
  RECEPTIONIST = "RECEPTIONIST",
  not_assigned = "not_assigned",
}

enum AppointmentStatus {
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED",
  CANCELLED = "CANCELLED",
}

const getReceptionistProfileByUserId = async (userId: string) => {
  const user = await prisma.user.findFirst({
    where: {
      id: userId,
      role: Roles.RECEPTIONIST,
    },
  });

  if (!user) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "You Are Not Receptionist");
  }

  const receptionist = await prisma.receptionist.findFirst({
    where: {
      userId,
    },
  });

  if (!receptionist) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Receptionist Profile Not Found");
  }

  return receptionist;
};

const createAppointment = async (
  body: {
    patientId: string;
    doctorId: string;
    scheduledAt: string;
    status?: keyof typeof AppointmentStatus;
  },
  userId: string,
) => {
  const receptionist = await getReceptionistProfileByUserId(userId);

  const patient = await prisma.patient.findFirst({
    where: {
      id: body.patientId,
    },
  });
  if (!patient) {
    throw new ApiError(httpStatus.NOT_FOUND, "Patient Not Found");
  }

  const doctor = await prisma.doctor.findFirst({
    where: {
      id: body.doctorId,
    },
  });
  if (!doctor) {
    throw new ApiError(httpStatus.NOT_FOUND, "Doctor Not Found");
  }

  const appointment = await prisma.appointment.create({
    data: {
      patientId: body.patientId,
      doctorId: body.doctorId,
      receptionistId: receptionist.id,
      scheduledAt: new Date(body.scheduledAt),
      status: body.status ?? AppointmentStatus.PENDING,
    },
    include: {
      patient: true,
      doctor: true,
      receptionist: true,
    },
  });

  return appointment;
};

const getAppointments = async (
  query: {
    patientId?: string;
    doctorId?: string;
    fromDate?: string;
    toDate?: string;
    status?: keyof typeof AppointmentStatus;
  },
  userId: string,
) => {
  const user = await prisma.user.findFirst({
    where: {
      id: userId,
    },
  });
  if (!user) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "You Are Not Authorized");
  }

  const appointments = await prisma.appointment.findMany({
    where: {
      patientId: query.patientId,
      doctorId: query.doctorId,
      status: query.status,
      scheduledAt: {
        gte: query.fromDate ? new Date(query.fromDate) : undefined,
        lte: query.toDate ? new Date(query.toDate) : undefined,
      },
    },
    include: {
      patient: true,
      doctor: true,
      receptionist: true,
    },
    orderBy: {
      scheduledAt: "asc",
    },
  });

  return appointments;
};

const getAppointmentById = async (appointmentId: string, userId: string) => {
  const user = await prisma.user.findFirst({
    where: {
      id: userId,
    },
  });
  if (!user) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "You Are Not Authorized");
  }

  const appointment = await prisma.appointment.findFirst({
    where: {
      id: appointmentId,
    },
    include: {
      patient: true,
      doctor: true,
      receptionist: true,
    },
  });

  if (!appointment) {
    throw new ApiError(httpStatus.NOT_FOUND, "Appointment Not Found");
  }

  return appointment;
};

const updateAppointment = async (
  appointmentId: string,
  body: {
    patientId?: string;
    doctorId?: string;
    scheduledAt?: string;
    status?: keyof typeof AppointmentStatus;
  },
  userId: string,
) => {
  await getReceptionistProfileByUserId(userId);

  const appointment = await prisma.appointment.findFirst({
    where: {
      id: appointmentId,
    },
  });
  if (!appointment) {
    throw new ApiError(httpStatus.NOT_FOUND, "Appointment Not Found");
  }

  if (body.patientId) {
    const patient = await prisma.patient.findFirst({
      where: {
        id: body.patientId,
      },
    });
    if (!patient) {
      throw new ApiError(httpStatus.NOT_FOUND, "Patient Not Found");
    }
  }

  if (body.doctorId) {
    const doctor = await prisma.doctor.findFirst({
      where: {
        id: body.doctorId,
      },
    });
    if (!doctor) {
      throw new ApiError(httpStatus.NOT_FOUND, "Doctor Not Found");
    }
  }

  const updatedAppointment = await prisma.appointment.update({
    where: {
      id: appointmentId,
    },
    data: {
      patientId: body.patientId,
      doctorId: body.doctorId,
      scheduledAt: body.scheduledAt ? new Date(body.scheduledAt) : undefined,
      status: body.status,
    },
    include: {
      patient: true,
      doctor: true,
      receptionist: true,
    },
  });

  return updatedAppointment;
};

const deleteAppointment = async (appointmentId: string, userId: string) => {
  await getReceptionistProfileByUserId(userId);

  const appointment = await prisma.appointment.findFirst({
    where: {
      id: appointmentId,
    },
  });

  if (!appointment) {
    throw new ApiError(httpStatus.NOT_FOUND, "Appointment Not Found");
  }

  const deletedAppointment = await prisma.appointment.delete({
    where: {
      id: appointmentId,
    },
  });

  return deletedAppointment;
};

const updateAppointmentStatus = async (
  appointmentId: string,
  status: keyof typeof AppointmentStatus,
  userId: string,
) => {
  await getReceptionistProfileByUserId(userId);

  const appointment = await prisma.appointment.findFirst({
    where: {
      id: appointmentId,
    },
  });
  if (!appointment) {
    throw new ApiError(httpStatus.NOT_FOUND, "Appointment Not Found");
  }

  const updatedAppointment = await prisma.appointment.update({
    where: {
      id: appointmentId,
    },
    data: {
      status,
    },
    include: {
      patient: true,
      doctor: true,
      receptionist: true,
    },
  });

  return updatedAppointment;
};

export default {
  createAppointment,
  getAppointments,
  getAppointmentById,
  updateAppointment,
  deleteAppointment,
  updateAppointmentStatus,
};
