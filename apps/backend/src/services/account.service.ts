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

const createEmployeeAccount = async (
  body: {
    name: string;
    email: string;
    password: string;
    role: string;
  },
  userId: string,
) => {
  // check the userId Belongs to the admin o not
  const checkAdmin = await prisma.user.findFirst({
    where: {
      id: userId,
    },
  });
  console.log("Check Admin", checkAdmin);
  if (checkAdmin?.role != Roles.ADMIN) {
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
  main();

  return newUser;
};

export default {
  createAdminAccount,
  createEmployeeAccount,
};
