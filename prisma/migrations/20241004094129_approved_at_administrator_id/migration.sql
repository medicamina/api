-- DropForeignKey
ALTER TABLE "Booking" DROP CONSTRAINT "Booking_administratorId_fkey";

-- AlterTable
ALTER TABLE "Booking" ALTER COLUMN "administratorId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_administratorId_fkey" FOREIGN KEY ("administratorId") REFERENCES "Administrator"("id") ON DELETE SET NULL ON UPDATE CASCADE;
