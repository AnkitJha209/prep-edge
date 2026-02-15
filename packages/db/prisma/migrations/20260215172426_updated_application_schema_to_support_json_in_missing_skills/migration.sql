/*
  Warnings:

  - You are about to drop the column `experienceGap` on the `applications` table. All the data in the column will be lost.
  - You are about to drop the column `misingSkills` on the `applications` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."applications" DROP COLUMN "experienceGap",
DROP COLUMN "misingSkills",
ADD COLUMN     "experienceGaps" TEXT[],
ADD COLUMN     "missingSkills" JSONB;
