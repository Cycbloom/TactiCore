-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "TaskPriority" ADD VALUE 'urgent';
ALTER TYPE "TaskPriority" ADD VALUE 'minimal';

-- AlterTable
ALTER TABLE "Task" ADD COLUMN     "actualHours" DOUBLE PRECISION,
ADD COLUMN     "dependencies" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "estimatedHours" DOUBLE PRECISION,
ADD COLUMN     "isBlocked" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isUrgent" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "lastPostponed" TIMESTAMP(3),
ADD COLUMN     "postponeCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "priorityScore" INTEGER NOT NULL DEFAULT 50;
