/*
  Warnings:

  - You are about to drop the `_BusinessHourToClinic` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_BusinessHourToDoctor` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[doctorId]` on the table `BusinessHour` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[clinicId]` on the table `BusinessHour` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[doctorId,day,clinicId]` on the table `BusinessHour` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "_BusinessHourToClinic" DROP CONSTRAINT "_BusinessHourToClinic_A_fkey";

-- DropForeignKey
ALTER TABLE "_BusinessHourToClinic" DROP CONSTRAINT "_BusinessHourToClinic_B_fkey";

-- DropForeignKey
ALTER TABLE "_BusinessHourToDoctor" DROP CONSTRAINT "_BusinessHourToDoctor_A_fkey";

-- DropForeignKey
ALTER TABLE "_BusinessHourToDoctor" DROP CONSTRAINT "_BusinessHourToDoctor_B_fkey";

-- DropIndex
DROP INDEX "User_email_idx";

-- AlterTable
ALTER TABLE "BusinessHour" ADD COLUMN     "clinicId" INTEGER,
ADD COLUMN     "doctorId" INTEGER;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "receieveMarketingEmails" BOOLEAN NOT NULL DEFAULT true;

-- DropTable
DROP TABLE "_BusinessHourToClinic";

-- DropTable
DROP TABLE "_BusinessHourToDoctor";

-- CreateIndex
CREATE UNIQUE INDEX "BusinessHour_doctorId_key" ON "BusinessHour"("doctorId");

-- CreateIndex
CREATE UNIQUE INDEX "BusinessHour_clinicId_key" ON "BusinessHour"("clinicId");

-- CreateIndex
CREATE UNIQUE INDEX "BusinessHour_doctorId_day_clinicId_key" ON "BusinessHour"("doctorId", "day", "clinicId");

-- CreateIndex
CREATE INDEX "User_email_phoneNumber_idx" ON "User"("email", "phoneNumber");

-- AddForeignKey
ALTER TABLE "BusinessHour" ADD CONSTRAINT "BusinessHour_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "Doctor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BusinessHour" ADD CONSTRAINT "BusinessHour_clinicId_fkey" FOREIGN KEY ("clinicId") REFERENCES "Clinic"("id") ON DELETE SET NULL ON UPDATE CASCADE;
