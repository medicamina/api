/*
  Warnings:

  - Added the required column `administratorId` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `approvedAt` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Doctor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pictureUrl` to the `Doctor` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Booking" ADD COLUMN     "administratorId" TEXT NOT NULL,
ADD COLUMN     "approvedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Clinic" ADD COLUMN     "phoneNumber" TEXT;

-- AlterTable
ALTER TABLE "Doctor" ADD COLUMN     "approved" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "approvedAt" TIMESTAMP(3),
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "pictureUrl" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_administratorId_fkey" FOREIGN KEY ("administratorId") REFERENCES "Administrator"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
