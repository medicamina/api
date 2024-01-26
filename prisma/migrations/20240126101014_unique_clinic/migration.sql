/*
  Warnings:

  - A unique constraint covering the columns `[name,address,suburb,country]` on the table `Clinic` will be added. If there are existing duplicate values, this will fail.
  - Made the column `address` on table `Clinic` required. This step will fail if there are existing NULL values in that column.
  - Made the column `name` on table `Clinic` required. This step will fail if there are existing NULL values in that column.
  - Made the column `speciality` on table `Clinic` required. This step will fail if there are existing NULL values in that column.
  - Made the column `country` on table `Clinic` required. This step will fail if there are existing NULL values in that column.
  - Made the column `suburb` on table `Clinic` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Clinic" ALTER COLUMN "address" SET NOT NULL,
ALTER COLUMN "name" SET NOT NULL,
ALTER COLUMN "speciality" SET NOT NULL,
ALTER COLUMN "country" SET NOT NULL,
ALTER COLUMN "suburb" SET NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "pictureUrl" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Clinic_name_address_suburb_country_key" ON "Clinic"("name", "address", "suburb", "country");
