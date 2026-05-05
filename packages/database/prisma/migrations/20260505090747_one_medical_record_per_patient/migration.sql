/*
  Warnings:

  - A unique constraint covering the columns `[patientId]` on the table `MedicalRecord` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "MedicalRecord_patientId_key" ON "MedicalRecord"("patientId");
