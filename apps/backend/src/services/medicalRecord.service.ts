import httpStatus from "http-status";
import ApiError from "../utils/api-error.js";
import { prisma } from "@repo/database";

const getAuthorizedUser = async (userId: string) => {
  const user = await prisma.user.findFirst({
    where: {
      id: userId,
    },
  });

  if (!user) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "You Are Not Authorized");
  }

  return user;
};

const getPatientByLookup = async (query: {
  patientId?: string;
  patientName?: string;
}) => {
  if (!query.patientId && !query.patientName) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Either patientId or patientName is required",
    );
  }

  if (query.patientId) {
    const patient = await prisma.patient.findFirst({
      where: {
        id: query.patientId,
      },
    });
    if (!patient) {
      throw new ApiError(httpStatus.NOT_FOUND, "Patient Not Found");
    }
    return patient;
  }

  const patients = await prisma.patient.findMany({
    where: {
      name: query.patientName,
    },
    take: 2,
  });

  if (patients.length === 0) {
    throw new ApiError(httpStatus.NOT_FOUND, "Patient Not Found");
  }
  if (patients.length > 1) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Multiple Patients Found, Please Use patientId",
    );
  }

  const matchedPatient = patients[0];
  if (!matchedPatient) {
    throw new ApiError(httpStatus.NOT_FOUND, "Patient Not Found");
  }

  return matchedPatient;
};

const getMedicalRecord = async (
  query: {
    patientId?: string;
    patientName?: string;
  },
  userId: string,
) => {
  await getAuthorizedUser(userId);
  const patient = await getPatientByLookup(query);

  const medicalRecord = await prisma.medicalRecord.findFirst({
    where: {
      patientId: patient.id,
    },
    include: {
      patient: true,
      prescriptions: {
        include: {
          medicinePrescription: {
            include: {
              medicine: true,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  if (!medicalRecord) {
    throw new ApiError(httpStatus.NOT_FOUND, "Medical Record Not Found");
  }

  return medicalRecord;
};

const getMedicalRecordAttachments = async (
  query: {
    patientId?: string;
    patientName?: string;
  },
  userId: string,
) => {
  await getAuthorizedUser(userId);
  const patient = await getPatientByLookup(query);

  const medicalRecord = await prisma.medicalRecord.findFirst({
    where: {
      patientId: patient.id,
    },
    select: {
      id: true,
      patientId: true,
      attachments: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!medicalRecord) {
    throw new ApiError(httpStatus.NOT_FOUND, "Medical Record Not Found");
  }

  return medicalRecord;
};

const createMedicalRecord = async (
  body: {
    patientId: string;
    diagnosis?: string;
    notes?: string;
    attachments?: string[];
  },
  userId: string,
) => {
  await getAuthorizedUser(userId);

  const patient = await prisma.patient.findFirst({
    where: {
      id: body.patientId,
    },
  });
  if (!patient) {
    throw new ApiError(httpStatus.NOT_FOUND, "Patient Not Found");
  }

  const existingMedicalRecord = await prisma.medicalRecord.findFirst({
    where: {
      patientId: body.patientId,
    },
  });
  if (existingMedicalRecord) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Medical Record Already Exists For This Patient",
    );
  }

  const medicalRecord = await prisma.medicalRecord.create({
    data: {
      patientId: body.patientId,
      diagnosis: body.diagnosis,
      notes: body.notes,
      attachments: body.attachments ?? [],
    },
    include: {
      patient: true,
      prescriptions: {
        include: {
          medicinePrescription: {
            include: {
              medicine: true,
            },
          },
        },
      },
    },
  });

  return medicalRecord;
};

const updateMedicalRecord = async (
  medicalRecordId: string,
  body: {
    diagnosis?: string;
    notes?: string;
    attachments?: string[];
  },
  userId: string,
) => {
  await getAuthorizedUser(userId);

  const existingMedicalRecord = await prisma.medicalRecord.findFirst({
    where: {
      id: medicalRecordId,
    },
  });
  if (!existingMedicalRecord) {
    throw new ApiError(httpStatus.NOT_FOUND, "Medical Record Not Found");
  }

  const medicalRecord = await prisma.medicalRecord.update({
    where: {
      id: medicalRecordId,
    },
    data: {
      diagnosis: body.diagnosis,
      notes: body.notes,
      attachments: body.attachments,
    },
    include: {
      patient: true,
      prescriptions: {
        include: {
          medicinePrescription: {
            include: {
              medicine: true,
            },
          },
        },
      },
    },
  });

  return medicalRecord;
};

const addAttachments = async (
  medicalRecordId: string,
  body: {
    attachments: string[];
  },
  userId: string,
) => {
  await getAuthorizedUser(userId);

  const existingMedicalRecord = await prisma.medicalRecord.findFirst({
    where: {
      id: medicalRecordId,
    },
  });
  if (!existingMedicalRecord) {
    throw new ApiError(httpStatus.NOT_FOUND, "Medical Record Not Found");
  }

  const medicalRecord = await prisma.medicalRecord.update({
    where: {
      id: medicalRecordId,
    },
    data: {
      attachments: [...existingMedicalRecord.attachments, ...body.attachments],
    },
    include: {
      patient: true,
      prescriptions: {
        include: {
          medicinePrescription: {
            include: {
              medicine: true,
            },
          },
        },
      },
    },
  });

  return medicalRecord;
};

const createPrescription = async (
  body: {
    medicalRecordId: string;
    medicineItems?: { medicineId: string; dosage: string }[];
  },
  userId: string,
) => {
  await getAuthorizedUser(userId);

  const medicalRecord = await prisma.medicalRecord.findFirst({
    where: {
      id: body.medicalRecordId,
    },
  });
  if (!medicalRecord) {
    throw new ApiError(httpStatus.NOT_FOUND, "Medical Record Not Found");
  }

  if (body.medicineItems?.length) {
    const medicineIds = body.medicineItems.map((item) => item.medicineId);
    const medicines = await prisma.medicines.findMany({
      where: {
        id: {
          in: medicineIds,
        },
      },
      select: {
        id: true,
      },
    });
    if (medicines.length !== medicineIds.length) {
      throw new ApiError(
        httpStatus.NOT_FOUND,
        "One Or More Medicines Not Found",
      );
    }
  }

  const prescription = await prisma.prescription.create({
    data: {
      medicalRecordId: body.medicalRecordId,
      medicinePrescription: body.medicineItems?.length
        ? {
            create: body.medicineItems.map((item) => ({
              medicineId: item.medicineId,
              dosage: item.dosage,
            })),
          }
        : undefined,
    },
    include: {
      medicalRecord: true,
      medicinePrescription: {
        include: {
          medicine: true,
        },
      },
    },
  });

  return prescription;
};

const getPrescriptions = async (
  query: {
    medicalRecordId?: string;
  },
  userId: string,
) => {
  await getAuthorizedUser(userId);

  if (query.medicalRecordId) {
    const medicalRecord = await prisma.medicalRecord.findFirst({
      where: {
        id: query.medicalRecordId,
      },
    });
    if (!medicalRecord) {
      throw new ApiError(httpStatus.NOT_FOUND, "Medical Record Not Found");
    }
  }

  const prescriptions = await prisma.prescription.findMany({
    where: {
      medicalRecordId: query.medicalRecordId,
    },
    include: {
      medicalRecord: true,
      medicinePrescription: {
        include: {
          medicine: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return prescriptions;
};

const getPrescriptionById = async (prescriptionId: string, userId: string) => {
  await getAuthorizedUser(userId);

  const prescription = await prisma.prescription.findFirst({
    where: {
      id: prescriptionId,
    },
    include: {
      medicalRecord: true,
      medicinePrescription: {
        include: {
          medicine: true,
        },
      },
    },
  });

  if (!prescription) {
    throw new ApiError(httpStatus.NOT_FOUND, "Prescription Not Found");
  }

  return prescription;
};

const updatePrescription = async (
  prescriptionId: string,
  body: {
    medicineItems?: { medicineId: string; dosage: string }[];
  },
  userId: string,
) => {
  await getAuthorizedUser(userId);

  const existingPrescription = await prisma.prescription.findFirst({
    where: {
      id: prescriptionId,
    },
  });
  if (!existingPrescription) {
    throw new ApiError(httpStatus.NOT_FOUND, "Prescription Not Found");
  }

  if (body.medicineItems) {
    const medicineIds = body.medicineItems.map((item) => item.medicineId);
    const medicines = await prisma.medicines.findMany({
      where: {
        id: {
          in: medicineIds,
        },
      },
      select: {
        id: true,
      },
    });
    if (medicines.length !== medicineIds.length) {
      throw new ApiError(
        httpStatus.NOT_FOUND,
        "One Or More Medicines Not Found",
      );
    }

    await prisma.medicinePrescription.deleteMany({
      where: {
        prescriptionId,
      },
    });

    if (body.medicineItems.length > 0) {
      await prisma.medicinePrescription.createMany({
        data: body.medicineItems.map((item) => ({
          prescriptionId,
          medicineId: item.medicineId,
          dosage: item.dosage,
        })),
      });
    }
  }

  const prescription = await prisma.prescription.findFirst({
    where: {
      id: prescriptionId,
    },
    include: {
      medicalRecord: true,
      medicinePrescription: {
        include: {
          medicine: true,
        },
      },
    },
  });

  if (!prescription) {
    throw new ApiError(httpStatus.NOT_FOUND, "Prescription Not Found");
  }

  return prescription;
};

const deletePrescription = async (prescriptionId: string, userId: string) => {
  await getAuthorizedUser(userId);

  const existingPrescription = await prisma.prescription.findFirst({
    where: {
      id: prescriptionId,
    },
  });
  if (!existingPrescription) {
    throw new ApiError(httpStatus.NOT_FOUND, "Prescription Not Found");
  }

  await prisma.medicinePrescription.deleteMany({
    where: {
      prescriptionId,
    },
  });

  const prescription = await prisma.prescription.delete({
    where: {
      id: prescriptionId,
    },
  });

  return prescription;
};

const addMedicineLineItem = async (
  prescriptionId: string,
  body: {
    medicineId: string;
    dosage: string;
  },
  userId: string,
) => {
  await getAuthorizedUser(userId);

  const prescription = await prisma.prescription.findFirst({
    where: {
      id: prescriptionId,
    },
  });
  if (!prescription) {
    throw new ApiError(httpStatus.NOT_FOUND, "Prescription Not Found");
  }

  const medicine = await prisma.medicines.findFirst({
    where: {
      id: body.medicineId,
    },
  });
  if (!medicine) {
    throw new ApiError(httpStatus.NOT_FOUND, "Medicine Not Found");
  }

  const lineItem = await prisma.medicinePrescription.create({
    data: {
      prescriptionId,
      medicineId: body.medicineId,
      dosage: body.dosage,
    },
    include: {
      medicine: true,
      prescription: true,
    },
  });

  return lineItem;
};

const updateMedicineLineItem = async (
  lineItemId: string,
  body: {
    medicineId?: string;
    dosage?: string;
  },
  userId: string,
) => {
  await getAuthorizedUser(userId);

  const existingLineItem = await prisma.medicinePrescription.findFirst({
    where: {
      id: lineItemId,
    },
  });
  if (!existingLineItem) {
    throw new ApiError(httpStatus.NOT_FOUND, "Medicine Line Item Not Found");
  }

  if (body.medicineId) {
    const medicine = await prisma.medicines.findFirst({
      where: {
        id: body.medicineId,
      },
    });
    if (!medicine) {
      throw new ApiError(httpStatus.NOT_FOUND, "Medicine Not Found");
    }
  }

  const updatedLineItem = await prisma.medicinePrescription.update({
    where: {
      id: lineItemId,
    },
    data: {
      medicineId: body.medicineId,
      dosage: body.dosage,
    },
    include: {
      medicine: true,
      prescription: true,
    },
  });

  return updatedLineItem;
};

const removeMedicineLineItem = async (lineItemId: string, userId: string) => {
  await getAuthorizedUser(userId);

  const existingLineItem = await prisma.medicinePrescription.findFirst({
    where: {
      id: lineItemId,
    },
  });
  if (!existingLineItem) {
    throw new ApiError(httpStatus.NOT_FOUND, "Medicine Line Item Not Found");
  }

  const deletedLineItem = await prisma.medicinePrescription.delete({
    where: {
      id: lineItemId,
    },
  });

  return deletedLineItem;
};

const createMedicine = async (body: { name: string }, userId: string) => {
  await getAuthorizedUser(userId);

  const existingMedicine = await prisma.medicines.findFirst({
    where: {
      name: body.name,
    },
  });
  if (existingMedicine) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Medicine Already Exists");
  }

  const medicine = await prisma.medicines.create({
    data: {
      name: body.name,
    },
  });

  return medicine;
};

const getMedicines = async (query: { search?: string }, userId: string) => {
  await getAuthorizedUser(userId);

  const medicines = await prisma.medicines.findMany({
    where: {
      name: query.search
        ? {
            contains: query.search,
            mode: "insensitive",
          }
        : undefined,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return medicines;
};

const getMedicineById = async (medicineId: string, userId: string) => {
  await getAuthorizedUser(userId);

  const medicine = await prisma.medicines.findFirst({
    where: {
      id: medicineId,
    },
  });
  if (!medicine) {
    throw new ApiError(httpStatus.NOT_FOUND, "Medicine Not Found");
  }

  return medicine;
};

const updateMedicine = async (
  medicineId: string,
  body: {
    name?: string;
  },
  userId: string,
) => {
  await getAuthorizedUser(userId);

  const existingMedicine = await prisma.medicines.findFirst({
    where: {
      id: medicineId,
    },
  });
  if (!existingMedicine) {
    throw new ApiError(httpStatus.NOT_FOUND, "Medicine Not Found");
  }

  if (body.name) {
    const medicineWithSameName = await prisma.medicines.findFirst({
      where: {
        name: body.name,
        id: {
          not: medicineId,
        },
      },
    });
    if (medicineWithSameName) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        "Medicine Name Already Exists",
      );
    }
  }

  const medicine = await prisma.medicines.update({
    where: {
      id: medicineId,
    },
    data: {
      name: body.name,
    },
  });

  return medicine;
};

const deleteMedicine = async (medicineId: string, userId: string) => {
  await getAuthorizedUser(userId);

  const existingMedicine = await prisma.medicines.findFirst({
    where: {
      id: medicineId,
    },
  });
  if (!existingMedicine) {
    throw new ApiError(httpStatus.NOT_FOUND, "Medicine Not Found");
  }

  const linkedLineItems = await prisma.medicinePrescription.findFirst({
    where: {
      medicineId,
    },
  });
  if (linkedLineItems) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Medicine Is Used In Prescriptions And Cannot Be Deleted",
    );
  }

  const medicine = await prisma.medicines.delete({
    where: {
      id: medicineId,
    },
  });

  return medicine;
};

export default {
  getMedicalRecord,
  getMedicalRecordAttachments,
  createMedicalRecord,
  updateMedicalRecord,
  addAttachments,
  createPrescription,
  getPrescriptions,
  getPrescriptionById,
  updatePrescription,
  deletePrescription,
  addMedicineLineItem,
  updateMedicineLineItem,
  removeMedicineLineItem,
  createMedicine,
  getMedicines,
  getMedicineById,
  updateMedicine,
  deleteMedicine,
};
