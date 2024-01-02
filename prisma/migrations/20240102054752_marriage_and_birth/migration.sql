/*
  Warnings:

  - You are about to drop the column `name` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[firstName,lastName,dob,birthCountry]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE');

-- AlterTable
ALTER TABLE "User" DROP COLUMN "name",
ADD COLUMN     "birthCity" TEXT,
ADD COLUMN     "birthCountry" TEXT,
ADD COLUMN     "bloodType" TEXT,
ADD COLUMN     "dob" TIMESTAMP(3),
ADD COLUMN     "dod" TIMESTAMP(3),
ADD COLUMN     "firstName" TEXT,
ADD COLUMN     "gender" "Gender",
ADD COLUMN     "height" DOUBLE PRECISION,
ADD COLUMN     "lastName" TEXT,
ADD COLUMN     "resetToken" TEXT,
ADD COLUMN     "twoFaToken" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "weight" DOUBLE PRECISION,
ALTER COLUMN "email" DROP NOT NULL;

-- CreateTable
CREATE TABLE "Children" (
    "id" SERIAL NOT NULL,
    "year" TIMESTAMP(3) NOT NULL,
    "location" TEXT,

    CONSTRAINT "Children_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Marriage" (
    "id" SERIAL NOT NULL,
    "year" TIMESTAMP(3) NOT NULL,
    "location" TEXT,

    CONSTRAINT "Marriage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ChildrenToUser" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_MarriageToUser" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ChildrenToUser_AB_unique" ON "_ChildrenToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_ChildrenToUser_B_index" ON "_ChildrenToUser"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_MarriageToUser_AB_unique" ON "_MarriageToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_MarriageToUser_B_index" ON "_MarriageToUser"("B");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_firstName_lastName_dob_birthCountry_key" ON "User"("firstName", "lastName", "dob", "birthCountry");

-- AddForeignKey
ALTER TABLE "_ChildrenToUser" ADD CONSTRAINT "_ChildrenToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Children"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ChildrenToUser" ADD CONSTRAINT "_ChildrenToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MarriageToUser" ADD CONSTRAINT "_MarriageToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Marriage"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MarriageToUser" ADD CONSTRAINT "_MarriageToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
