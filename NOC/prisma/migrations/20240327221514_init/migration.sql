/*
  Warnings:

  - The values [LOW,MEDIUM,HIGH] on the enum `SeverityLevel` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "SeverityLevel_new" AS ENUM ('low', 'medium', 'high');
ALTER TABLE "LogModel" ALTER COLUMN "level" TYPE "SeverityLevel_new" USING ("level"::text::"SeverityLevel_new");
ALTER TYPE "SeverityLevel" RENAME TO "SeverityLevel_old";
ALTER TYPE "SeverityLevel_new" RENAME TO "SeverityLevel";
DROP TYPE "SeverityLevel_old";
COMMIT;
