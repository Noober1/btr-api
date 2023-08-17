/*
  Warnings:

  - A unique constraint covering the columns `[code]` on the table `Major` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `courseId` to the `Score` table without a default value. This is not possible if the table is not empty.
  - Added the required column `majorId` to the `Student` table without a default value. This is not possible if the table is not empty.
  - Made the column `birthPlace` on table `Student` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Score" ADD COLUMN     "courseId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Student" ADD COLUMN     "majorId" TEXT NOT NULL,
ALTER COLUMN "birthPlace" SET NOT NULL,
ALTER COLUMN "birthDate" DROP DEFAULT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "refreshToken" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Major_code_key" ON "Major"("code");

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_majorId_fkey" FOREIGN KEY ("majorId") REFERENCES "Major"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Score" ADD CONSTRAINT "Score_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
