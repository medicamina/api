/*
  Warnings:

  - You are about to drop the column `clinicId` on the `Administrator` table. All the data in the column will be lost.
  - Added the required column `ownerId` to the `Clinic` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Administrator" DROP CONSTRAINT "Administrator_clinicId_fkey";

-- AlterTable
ALTER TABLE "Administrator" DROP COLUMN "clinicId";

-- AlterTable
ALTER TABLE "Clinic" ADD COLUMN     "country" TEXT,
ADD COLUMN     "ownerId" INTEGER NOT NULL,
ADD COLUMN     "pictureUrl" TEXT,
ADD COLUMN     "suburb" TEXT;

-- CreateTable
CREATE TABLE "_AdministratorToClinic" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_AdministratorToClinic_AB_unique" ON "_AdministratorToClinic"("A", "B");

-- CreateIndex
CREATE INDEX "_AdministratorToClinic_B_index" ON "_AdministratorToClinic"("B");

-- AddForeignKey
ALTER TABLE "Clinic" ADD CONSTRAINT "Clinic_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "Administrator"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AdministratorToClinic" ADD CONSTRAINT "_AdministratorToClinic_A_fkey" FOREIGN KEY ("A") REFERENCES "Administrator"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AdministratorToClinic" ADD CONSTRAINT "_AdministratorToClinic_B_fkey" FOREIGN KEY ("B") REFERENCES "Clinic"("id") ON DELETE CASCADE ON UPDATE CASCADE;
