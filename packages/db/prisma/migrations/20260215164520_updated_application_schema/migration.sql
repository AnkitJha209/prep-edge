/*
  Warnings:

  - The `requirements` column on the `jobs` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `misingSkills` to the `applications` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."applications" ADD COLUMN     "experienceGap" TEXT[],
ADD COLUMN     "improvementSuggestion" TEXT[],
ADD COLUMN     "misingSkills" TEXT NOT NULL,
ADD COLUMN     "overallAssessment" TEXT,
ADD COLUMN     "scoreJustification" TEXT,
ADD COLUMN     "strengths" TEXT[];

-- AlterTable
ALTER TABLE "public"."jobs" DROP COLUMN "requirements",
ADD COLUMN     "requirements" TEXT[];
