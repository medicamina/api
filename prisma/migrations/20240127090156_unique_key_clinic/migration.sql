/*
  Warnings:

  - A unique constraint covering the columns `[joinCode]` on the table `Clinic` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Clinic_joinCode_key" ON "Clinic"("joinCode");
