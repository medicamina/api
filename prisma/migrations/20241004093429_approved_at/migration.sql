-- AlterTable
ALTER TABLE "Booking" ALTER COLUMN "approvedAt" DROP NOT NULL;

-- AlterTable
ALTER TABLE "BusinessHour" ALTER COLUMN "consultLength" SET DEFAULT 15;
