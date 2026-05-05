/*
  Warnings:

  - You are about to drop the column `prescription` on the `MedicalRecord` table. All the data in the column will be lost.
  - You are about to drop the column `medication` on the `Prescription` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "MedicalRecord" DROP COLUMN "prescription",
ALTER COLUMN "attachments" SET DEFAULT ARRAY[]::TEXT[];

-- AlterTable
ALTER TABLE "Prescription" DROP COLUMN "medication";
