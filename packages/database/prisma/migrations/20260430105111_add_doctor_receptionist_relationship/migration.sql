/*
  Warnings:

  - A unique constraint covering the columns `[doctorId]` on the table `user` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "user" ADD COLUMN     "doctorId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "user_doctorId_key" ON "user"("doctorId");

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;
