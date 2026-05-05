import { optional, z } from "zod";
enum Gender {
  MALE = "MALE",
  FEMALE = "FEMALE",
  OTHER = "OTHER",
}

const createPatient = z.object({
  body: z.object({
    name: z.string({ message: "name must be a valid String" }),
    phone: z
      .string({ message: "Phone Must be Valid" })
      .min(10, { message: "Phone Must be 10 digits" })
      .max(10, { message: "Phone Must be 10 digits" }),
    email: z.string().email({ message: "Email Must be Valid" }).optional(),
    gender: z.enum(Gender),
    dateOfBirth: z.date({ message: "Must Be A Valid Date" }).optional(),
    medicalSummary: z
      .string({ message: "name must be a valid String" })
      .optional(),
  }),
});

const updatePatientPersonalInformation = z.object({
  body: z.object({
    name: z.string({ message: "name must be a valid String" }),
    phone: z.string({ message: "Phone Must be Valid" }),
    email: z.string().email({ message: "Email Must be Valid" }).optional(),
    gender: z.enum(Gender),
    dateOfBirth: z.date({ message: "Must Be A Valid Date" }).optional(),
    medicalSummary: z
      .string({ message: "name must be a valid String" })
      .optional(),
  }),
});

export default {
  createPatient,
  updatePatientPersonalInformation,
};
