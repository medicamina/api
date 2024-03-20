/*
  Warnings:

  - You are about to drop the column `day` on the `BusinessHour` table. All the data in the column will be lost.
  - You are about to drop the column `endTime` on the `BusinessHour` table. All the data in the column will be lost.
  - You are about to drop the column `startTime` on the `BusinessHour` table. All the data in the column will be lost.
  - Added the required column `fridayClose` to the `BusinessHour` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fridayOpen` to the `BusinessHour` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fridayOperating` to the `BusinessHour` table without a default value. This is not possible if the table is not empty.
  - Added the required column `isClinic` to the `BusinessHour` table without a default value. This is not possible if the table is not empty.
  - Added the required column `mondayClose` to the `BusinessHour` table without a default value. This is not possible if the table is not empty.
  - Added the required column `mondayOpen` to the `BusinessHour` table without a default value. This is not possible if the table is not empty.
  - Added the required column `mondayOperating` to the `BusinessHour` table without a default value. This is not possible if the table is not empty.
  - Added the required column `saturdayClose` to the `BusinessHour` table without a default value. This is not possible if the table is not empty.
  - Added the required column `saturdayOpen` to the `BusinessHour` table without a default value. This is not possible if the table is not empty.
  - Added the required column `saturdayOperating` to the `BusinessHour` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sundayClose` to the `BusinessHour` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sundayOpen` to the `BusinessHour` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sundayOperating` to the `BusinessHour` table without a default value. This is not possible if the table is not empty.
  - Added the required column `thursdayClose` to the `BusinessHour` table without a default value. This is not possible if the table is not empty.
  - Added the required column `thursdayOpen` to the `BusinessHour` table without a default value. This is not possible if the table is not empty.
  - Added the required column `thursdayOperating` to the `BusinessHour` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tuesdayClose` to the `BusinessHour` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tuesdayOpen` to the `BusinessHour` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tuesdayOperating` to the `BusinessHour` table without a default value. This is not possible if the table is not empty.
  - Added the required column `wednesdayClose` to the `BusinessHour` table without a default value. This is not possible if the table is not empty.
  - Added the required column `wednesdayOpen` to the `BusinessHour` table without a default value. This is not possible if the table is not empty.
  - Added the required column `wednesdayOperating` to the `BusinessHour` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "BusinessHour_doctorId_day_clinicId_key";

-- AlterTable
ALTER TABLE "BusinessHour" DROP COLUMN "day",
DROP COLUMN "endTime",
DROP COLUMN "startTime",
ADD COLUMN     "fridayClose" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "fridayOpen" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "fridayOperating" BOOLEAN NOT NULL,
ADD COLUMN     "isClinic" BOOLEAN NOT NULL,
ADD COLUMN     "mondayClose" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "mondayOpen" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "mondayOperating" BOOLEAN NOT NULL,
ADD COLUMN     "saturdayClose" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "saturdayOpen" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "saturdayOperating" BOOLEAN NOT NULL,
ADD COLUMN     "sundayClose" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "sundayOpen" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "sundayOperating" BOOLEAN NOT NULL,
ADD COLUMN     "thursdayClose" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "thursdayOpen" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "thursdayOperating" BOOLEAN NOT NULL,
ADD COLUMN     "tuesdayClose" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "tuesdayOpen" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "tuesdayOperating" BOOLEAN NOT NULL,
ADD COLUMN     "wednesdayClose" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "wednesdayOpen" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "wednesdayOperating" BOOLEAN NOT NULL;
