-- prisma/migrations/20250402000000_add_sender_receiver_email/migration.sql
-- Add sender_email and receiver_email columns to the shipments table
ALTER TABLE "shipments"
ADD COLUMN "sender_email" TEXT;

ALTER TABLE "shipments"
ADD COLUMN "receiver_email" TEXT;