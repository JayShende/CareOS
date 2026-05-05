import httpStatus from "http-status";
import ApiError from "../utils/api-error.js";
import { auth } from "../utils/auth.js";
import { prisma } from "@repo/database";

enum Gender {
  MALE = "MALE",
  FEMALE = "FEMALE",
  OTHER = "OTHER",
}
enum Roles {
  ADMIN = "ADMIN",
  DOCTOR = "DOCTOR",
  RECEPTIONIST = "RECEPTIONIST",
  not_assigned = "not_assigned",
}

// Create a Patient
const createPatient = async (
  body: {
    name: string;
    phone: string;
    email: string | null;
    gender: Gender;
    dateOfBirth: Date | null;
    medicalSummary: string | null;
  },
  receptionistId: string,
) => {
  // check if the receptionistId is Valid or Not
  const checkReceptionist = await prisma.user.findFirst({
    where: {
      id: receptionistId,
      role: Roles.RECEPTIONIST,
    },
  });
  if (!checkReceptionist) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "You Are Not Receptionist");
  }
  // check if the phone or email is already in use
  const checkPhone = await prisma.patient.findFirst({
    where: {
      phone: body.phone,
    },
  });
  if (checkPhone) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Phone Number Already in Use");
  }
  // check email only if not null
  if (body.email) {
    const checkEmail = await prisma.patient.findFirst({
      where: {
        email: body.email,
      },
    });
    if (checkEmail) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Email Already in Use");
    }
  }
  // create the patient
  const patient = await prisma.patient.create({
    data: {
      name: body.name,
      phone: body.phone,
      email: body.email,
      gender: body.gender,
      dateOfBirth: body.dateOfBirth,
      medicalSummary: body.medicalSummary,
    },
  });
  return patient;
};

//  Fetch a Patient from Patient ID

const getPatientById = async (patientId: string, userId: string) => {
  // check if the userId is Valid or Not
  const checkUser = await prisma.user.findFirst({
    where: {
      id: userId,
    },
  });
  if (!checkUser) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "You Are Not Authorized");
  }
  // check if the patientId is Valid or Not
  const patient = await prisma.patient.findFirst({
    where: {
      id: patientId,
    },
  });
  if (!patient) {
    throw new ApiError(httpStatus.NOT_FOUND, "Patient Not Found");
  }
  return patient;
};

//  Update Patient Personal Information
const updatePatientPersonalInformation = async (
  patientId: string,
  body: {
    name: string;
    phone: string;
    email: string | null;
    gender: Gender;
    dateOfBirth: Date | null;
    medicalSummary: string | null;
  },
  userId: string,
) => {
  // check if the userId is Valid or Not
  const checkUser = await prisma.user.findFirst({
    where: {
      id: userId,
    },
  });
  if (!checkUser) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "You Are Not Authorized");
  }
  // check if the patientId is Valid or Not
  const patient = await prisma.patient.findFirst({
    where: {
      id: patientId,
    },
  });
  if (!patient) {
    throw new ApiError(httpStatus.NOT_FOUND, "Patient Not Found");
  }
  // update the patient personal information
  const updatedPatient = await prisma.patient.update({
    where: { id: patientId },
    data: body,
  });
  return updatedPatient;
};
export default {
  createPatient,
  getPatientById,
  updatePatientPersonalInformation,
};
