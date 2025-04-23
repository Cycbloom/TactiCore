-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- AlterTable
ALTER TABLE "Task" ADD COLUMN     "path" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- CreateTable
CREATE TABLE "DatabaseFunction" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "definition" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DatabaseFunction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DatabaseTrigger" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "table" TEXT NOT NULL,
    "event" TEXT NOT NULL,
    "function" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DatabaseTrigger_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Task_parentId_idx" ON "Task"("parentId");
