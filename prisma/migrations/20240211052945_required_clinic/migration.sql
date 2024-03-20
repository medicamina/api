/*
  Warnings:

  - Made the column `clinicId` on table `BusinessHour` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "BusinessHour" DROP CONSTRAINT "BusinessHour_clinicId_fkey";

-- AlterTable
ALTER TABLE "BusinessHour" ALTER COLUMN "clinicId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "BusinessHour" ADD CONSTRAINT "BusinessHour_clinicId_fkey" FOREIGN KEY ("clinicId") REFERENCES "Clinic"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
