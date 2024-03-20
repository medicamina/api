-- DropIndex
DROP INDEX "BusinessHour_clinicId_key";

-- AlterTable
ALTER TABLE "BusinessHour" ADD COLUMN     "callToBook" BOOLEAN NOT NULL DEFAULT false;
