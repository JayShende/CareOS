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

export default {
  getMedicalRecord,
  getMedicalRecordAttachments,
  createMedicalRecord,
  updateMedicalRecord,
  addAttachments,
};
