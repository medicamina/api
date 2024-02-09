/*
  Warnings:

  - The primary key for the `Administrator` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Booking` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `BusinessHour` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Doctor` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[businessNumber]` on the table `Clinic` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[businessNumber,country]` on the table `Clinic` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Booking" DROP CONSTRAINT "Booking_doctorId_fkey";

-- DropForeignKey
ALTER TABLE "BusinessHour" DROP CONSTRAINT "BusinessHour_doctorId_fkey";

-- DropForeignKey
ALTER TABLE "Clinic" DROP CONSTRAINT "Clinic_ownerId_fkey";

-- DropForeignKey
ALTER TABLE "_AdministratorToClinic" DROP CONSTRAINT "_AdministratorToClinic_A_fkey";

-- DropForeignKey
ALTER TABLE "_ClinicToDoctor" DROP CONSTRAINT "_ClinicToDoctor_B_fkey";

-- AlterTable
ALTER TABLE "Administrator" DROP CONSTRAINT "Administrator_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Administrator_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Administrator_id_seq";

-- AlterTable
ALTER TABLE "Booking" DROP CONSTRAINT "Booking_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "doctorId" SET DATA TYPE TEXT,
ADD CONSTRAINT "Booking_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Booking_id_seq";

-- AlterTable
ALTER TABLE "BusinessHour" DROP CONSTRAINT "BusinessHour_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "doctorId" SET DATA TYPE TEXT,
ADD CONSTRAINT "BusinessHour_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "BusinessHour_id_seq";

-- AlterTable
ALTER TABLE "Clinic" ADD COLUMN     "approved" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "approvedAt" TIMESTAMP(3),
ADD COLUMN     "businessNumber" TEXT,
ALTER COLUMN "ownerId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Doctor" DROP CONSTRAINT "Doctor_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Doctor_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Doctor_id_seq";

-- AlterTable
ALTER TABLE "_AdministratorToClinic" ALTER COLUMN "A" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "_ClinicToDoctor" ALTER COLUMN "B" SET DATA TYPE TEXT;

-- CreateTable
CREATE TABLE "Staff" (
    "id" TEXT NOT NULL,

    CONSTRAINT "Staff_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Staff_id_key" ON "Staff"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Clinic_businessNumber_key" ON "Clinic"("businessNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Clinic_businessNumber_country_key" ON "Clinic"("businessNumber", "country");

-- AddForeignKey
ALTER TABLE "Clinic" ADD CONSTRAINT "Clinic_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "Administrator"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "Doctor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BusinessHour" ADD CONSTRAINT "BusinessHour_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "Doctor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ClinicToDoctor" ADD CONSTRAINT "_ClinicToDoctor_B_fkey" FOREIGN KEY ("B") REFERENCES "Doctor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AdministratorToClinic" ADD CONSTRAINT "_AdministratorToClinic_A_fkey" FOREIGN KEY ("A") REFERENCES "Administrator"("id") ON DELETE CASCADE ON UPDATE CASCADE;
