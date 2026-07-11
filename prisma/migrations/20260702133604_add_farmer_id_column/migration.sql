/*
  Warnings:

  - Added the required column `farmerId` to the `farmHistory` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "farmHistory" ADD COLUMN     "farmerId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "farmHistory" ADD CONSTRAINT "farmHistory_farmerId_fkey" FOREIGN KEY ("farmerId") REFERENCES "farmers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
