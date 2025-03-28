-- CreateMigration
-- prisma/migrations/20250401000000_split_names/migration.sql
-- Add new columns to users table
ALTER TABLE "users"
ADD COLUMN "first_name" TEXT;

ALTER TABLE "users"
ADD COLUMN "last_name" TEXT;

-- Add new columns to shipments table
ALTER TABLE "shipments"
ADD COLUMN "sender_first_name" TEXT;

ALTER TABLE "shipments"
ADD COLUMN "sender_last_name" TEXT;

ALTER TABLE "shipments"
ADD COLUMN "receiver_first_name" TEXT;

ALTER TABLE "shipments"
ADD COLUMN "receiver_last_name" TEXT;

-- Update the new columns with data from existing name columns
-- This is a basic split on the first space - you might need a more sophisticated approach
UPDATE "shipments"
SET
  "sender_first_name" = SUBSTRING(
    "sender_name"
    FROM
      1 FOR POSITION(' ' IN "sender_name") - 1
  ),
  "sender_last_name" = SUBSTRING(
    "sender_name"
    FROM
      POSITION(' ' IN "sender_name") + 1
  )
WHERE
  "sender_name" LIKE '% %';

UPDATE "shipments"
SET
  "receiver_first_name" = SUBSTRING(
    "receiver_name"
    FROM
      1 FOR POSITION(' ' IN "receiver_name") - 1
  ),
  "receiver_last_name" = SUBSTRING(
    "receiver_name"
    FROM
      POSITION(' ' IN "receiver_name") + 1
  )
WHERE
  "receiver_name" LIKE '% %';

-- Handle names without spaces (set first name to full name, last name to empty)
UPDATE "shipments"
SET
  "sender_first_name" = "sender_name",
  "sender_last_name" = ''
WHERE
  "sender_name" IS NOT NULL
  AND "sender_name" NOT LIKE '% %'
  AND "sender_first_name" IS NULL;

UPDATE "shipments"
SET
  "receiver_first_name" = "receiver_name",
  "receiver_last_name" = ''
WHERE
  "receiver_name" IS NOT NULL
  AND "receiver_name" NOT LIKE '% %'
  AND "receiver_first_name" IS NULL;

-- Similarly for users table
UPDATE "users"
SET
  "first_name" = SUBSTRING(
    "name"
    FROM
      1 FOR POSITION(' ' IN "name") - 1
  ),
  "last_name" = SUBSTRING(
    "name"
    FROM
      POSITION(' ' IN "name") + 1
  )
WHERE
  "name" LIKE '% %';

UPDATE "users"
SET
  "first_name" = "name",
  "last_name" = ''
WHERE
  "name" IS NOT NULL
  AND "name" NOT LIKE '% %'
  AND "first_name" IS NULL;