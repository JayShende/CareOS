import { z } from "zod";
enum Roles {
  ADMIN = "ADMIN",
  DOCTOR = "DOCTOR",
  RECEPTIONIST = "RECEPTIONIST",
  not_assigned = "not_assigned",
}

const adminAccount = z.object({
  body: z.object({
    name: z.string({ message: "name must be a valid String" }),
    email: z.string().email({ message: "Email Must be Valid" }),
    password: z.string({ message: "Password must be a valid String" }),
    secret_code: z.string({ message: "secret_code must be a valid String" }),
    role: z.enum([Roles.ADMIN]),
  }),
});

const employeeAccount = z.object({
  body: z.object({
    name: z.string({ message: "name must be a valid String" }),
    email: z.string().email({ message: "Email Must be Valid" }),
    password: z.string({ message: "Password must be a valid String" }),
    role: z.enum([Roles.DOCTOR, Roles.RECEPTIONIST]),
  }),
});
export default {
  adminAccount,
  employeeAccount,
};
