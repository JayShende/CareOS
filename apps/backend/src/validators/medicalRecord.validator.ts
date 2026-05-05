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

const createPrescription = z.object({
  body: z.object({
    medicalRecordId: z.string({ message: "medicalRecordId must be a valid String" }),
    medicineItems: z
      .array(
        z.object({
          medicineId: z.string({ message: "medicineId must be a valid String" }),
          dosage: z.string({ message: "dosage must be a valid String" }),
        }),
      )
      .optional(),
  }),
});

const getPrescriptions = z.object({
  query: z.object({
    medicalRecordId: z
      .string({ message: "medicalRecordId must be a valid String" })
      .optional(),
  }),
});

const updatePrescription = z.object({
  body: z.object({
    medicineItems: z
      .array(
        z.object({
          medicineId: z.string({ message: "medicineId must be a valid String" }),
          dosage: z.string({ message: "dosage must be a valid String" }),
        }),
      )
      .optional(),
  }),
});

const addMedicineLineItem = z.object({
  body: z.object({
    medicineId: z.string({ message: "medicineId must be a valid String" }),
    dosage: z.string({ message: "dosage must be a valid String" }),
  }),
});

const updateMedicineLineItem = z.object({
  body: z.object({
    medicineId: z
      .string({ message: "medicineId must be a valid String" })
      .optional(),
    dosage: z.string({ message: "dosage must be a valid String" }).optional(),
  }),
});

const createMedicine = z.object({
  body: z.object({
    name: z.string({ message: "name must be a valid String" }),
  }),
});

const getMedicines = z.object({
  query: z.object({
    search: z.string({ message: "search must be a valid String" }).optional(),
  }),
});

const updateMedicine = z.object({
  body: z.object({
    name: z.string({ message: "name must be a valid String" }).optional(),
  }),
});

export default {
  getMedicalRecord,
  getMedicalRecordAttachments,
  createMedicalRecord,
  updateMedicalRecord,
  addAttachments,
  createPrescription,
  getPrescriptions,
  updatePrescription,
  addMedicineLineItem,
  updateMedicineLineItem,
  createMedicine,
  getMedicines,
  updateMedicine,
};
