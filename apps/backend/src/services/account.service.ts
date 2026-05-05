import httpStatus from "http-status";
import ApiError from "../utils/api-error.js";
import { auth } from "../utils/auth.js";
import { Response } from "express";
import { prisma } from "@repo/database";
import { BrevoClient } from "@getbrevo/brevo";

enum Roles {
  ADMIN = "ADMIN",
  DOCTOR = "DOCTOR",
  RECEPTIONIST = "RECEPTIONIST",
  not_assigned = "not_assigned",
}
const createAdminAccount = async (body: {
  name: string;
  email: string;
  password: string;
  secret_code: string;
}) => {
  if (body.secret_code != "JayShende007@") {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Invalid Admin Secret Code");
  }
  const newadmin = await auth.api.signUpEmail({
    body: {
      name: body.name,
      email: body.email,
      password: body.password,
      role: Roles.ADMIN,
    },
  });

  console.log(newadmin);
  return newadmin;
};

const createDoctorAccount = async (
  body: {
    name: string;
    email: string;
    password: string;
    role: string;
    specialty: string;
    experience: number;
  },
  userId: string,
) => {
  // check the userId Belongs to the admin o not
  const checkAdmin = await prisma.user.findFirstOrThrow({
    where: {
      id: userId,
    },
  });
  console.log("userId", userId);
  console.log("Check Admin", checkAdmin);
  if (!checkAdmin || checkAdmin?.role != Roles.ADMIN) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "You Are Not Admin");
  }

  // Proceed with Creation of Account For Various Roles ie "DOCTOR", "RECEPTIONIST"

  const newUser = await auth.api.signUpEmail({
    body: {
      name: body.name,
      email: body.email,
      password: body.password,
      role: body.role,
    },
  });
  console.log(newUser);
  // create the doctor
  const doctor = await prisma.doctor.create({
    data: {
      userId: newUser.user.id,
      specialty: body.specialty,
      experience: body.experience,
    },
  });
  console.log(doctor);
  async function main() {
    const client = new BrevoClient({
      apiKey: process.env.BREVO_API_KEY as string,
    });
    await client.transactionalEmails.sendTransacEmail({
      to: [
        {
          email: `${body.email}`,
          name: `${body.name}`,
        },
      ],
      templateId: 1,
      params: {
        name: `${body.name}`,
        email: `${body.email}`,
        password: `${body.password}`,
        role: `${body.role}`,
      },
    });
  }
  // main();

  return newUser;
};

const createReceptionistAccount = async (
  body: {
    name: string;
    email: string;
    password: string;
    role: string;
    doctorId: string;
  },
  userId: string,
) => {
  // check the userId Belongs to the admin o not
  const checkAdmin = await prisma.user.findFirst({
    where: {
      id: userId,
    },
  });
  if (checkAdmin?.role != Roles.ADMIN) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "You Are Not Admin");
  }

  // check if the doctorId is Valid or Not
  const doctor = await prisma.user.findFirst({
    where: {
      id: body.doctorId,
    },
  });

  if (!doctor || doctor.role != Roles.DOCTOR) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Invalid Doctor ID");
  }

  // Proceed with Creation of Account For Various Role "RECEPTIONIST"

  const newUser = await auth.api.signUpEmail({
    body: {
      name: body.name,
      email: body.email,
      password: body.password,
      role: body.role,
      doctorId: body.doctorId,
    },
  });
  console.log(newUser);
  // create the receptionist
  const receptionist = await prisma.receptionist.create({
    data: {
      userId: newUser.user.id,
    },
  });
  console.log(receptionist);
  async function main() {
    const client = new BrevoClient({
      apiKey: process.env.BREVO_API_KEY as string,
    });
    await client.transactionalEmails.sendTransacEmail({
      to: [
        {
          email: `${body.email}`,
          name: `${body.name}`,
        },
      ],
      templateId: 1,
      params: {
        name: `${body.name}`,
        email: `${body.email}`,
        password: `${body.password}`,
        role: `${body.role}`,
      },
    });
  }
  // main();

  return newUser;
};
export default {
  createAdminAccount,
  createDoctorAccount,
  createReceptionistAccount,
};
