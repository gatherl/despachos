-- AlterTable
ALTER TABLE "shipments" ADD COLUMN     "receiver_dni" TEXT,
ADD COLUMN     "receiver_name" TEXT,
ADD COLUMN     "receiver_phone" TEXT,
ADD COLUMN     "sender_dni" TEXT,
ADD COLUMN     "sender_name" TEXT,
ADD COLUMN     "sender_phone" TEXT;
