import { z } from "zod";

const patientLookupQuery = z
  .object({
    patientId: z
      .string({ message: "patientId must be a valid String" })
      .optional(),
    patientName: z
      .string({ message: "patientName must be a valid String" })
      .min(1, { message: "patientName must not be empty" })
      .optional(),
  })
  .refine((data) => Boolean(data.patientId || data.patientName), {
    message: "Either patientId or patientName is required",
  });

const getMedicalRecord = z.object({
  query: patientLookupQuery,
});

const getMedicalRecordAttachments = z.object({
  query: patientLookupQuery,
});

const createMedicalRecord = z.object({
  body: z.object({
    patientId: z.string({ message: "patientId must be a valid String" }),
    diagnosis: z
      .string({ message: "diagnosis must be a valid String" })
      .optional(),
    notes: z.string({ message: "notes must be a valid String" }).optional(),
    attachments: z
      .array(z.string({ message: "attachments must be valid String Array" }))
      .optional(),
  }),
});

const updateMedicalRecord = z.object({
  body: z.object({
    diagnosis: z
      .string({ message: "diagnosis must be a valid String" })
      .optional(),
    notes: z.string({ message: "notes must be a valid String" }).optional(),
    attachments: z
      .array(z.string({ message: "attachments must be valid String Array" }))
      .optional(),
  }),
});

const addAttachments = z.object({
  body: z.object({
    attachments: z.array(
      z.string({ message: "attachments must be valid String Array" }),
    ),
  }),
});

export default {
  getMedicalRecord,
  getMedicalRecordAttachments,
  createMedicalRecord,
  updateMedicalRecord,
  addAttachments,
};
