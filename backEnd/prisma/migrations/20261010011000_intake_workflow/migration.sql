ALTER TABLE "Intake" ADD COLUMN "clientId" TEXT,
  ADD COLUMN "protocol" TEXT NOT NULL DEFAULT '',
  ADD COLUMN "benefitNumber" TEXT NOT NULL DEFAULT '',
  ADD COLUMN "requestedAt" TIMESTAMP(3),
  ADD COLUMN "requirementDueAt" TIMESTAMP(3),
  ADD COLUMN "lastActivityAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
UPDATE "Intake" SET "lastActivityAt" = "updatedAt";
ALTER TABLE "Intake" ADD CONSTRAINT "Intake_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE SET NULL ON UPDATE CASCADE;
CREATE INDEX "Intake_clientId_idx" ON "Intake"("clientId");
ALTER TABLE "IntakeItem" ADD COLUMN "fileId" TEXT;
ALTER TABLE "IntakeItem" ADD CONSTRAINT "IntakeItem_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "StoredFile"("id") ON DELETE SET NULL ON UPDATE CASCADE;
