/*
  Warnings:

  - You are about to drop the `_ClinicToUser` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[userId]` on the table `Administrator` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId]` on the table `Doctor` will be added. If there are existing duplicate values, this will fail.
  - Made the column `doctorId` on table `Booking` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Booking" DROP CONSTRAINT "Booking_doctorId_fkey";

-- DropForeignKey
ALTER TABLE "_ClinicToUser" DROP CONSTRAINT "_ClinicToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_ClinicToUser" DROP CONSTRAINT "_ClinicToUser_B_fkey";

-- AlterTable
ALTER TABLE "Booking" ALTER COLUMN "doctorId" SET NOT NULL;

-- DropTable
DROP TABLE "_ClinicToUser";

-- CreateIndex
CREATE UNIQUE INDEX "Administrator_userId_key" ON "Administrator"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Doctor_userId_key" ON "Doctor"("userId");

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "Doctor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
