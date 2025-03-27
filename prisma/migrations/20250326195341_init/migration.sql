-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'TRANSPORTIST', 'EMPLOYEE');

-- CreateEnum
CREATE TYPE "ShipmentState" AS ENUM ('CREATED', 'PICKED_UP', 'IN_TRANSIT', 'DELIVERED', 'RETURNED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PAGO', 'NO_PAGO', 'PAGA_DESTINO');

-- CreateEnum
CREATE TYPE "LogAction" AS ENUM ('CREATE', 'DELETE', 'UPDATE');

-- CreateEnum
CREATE TYPE "PackageType" AS ENUM ('DOCUMENT', 'PARCEL', 'FRAGILE', 'ELECTRONICS', 'PERISHABLE');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "dni" TEXT,
    "cuit" TEXT,
    "name" TEXT NOT NULL,
    "password" TEXT,
    "email" TEXT,
    "role" "UserRole",
    "cellphone" TEXT,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "shipments" (
    "id" TEXT NOT NULL,
    "tracking_id" TEXT NOT NULL,
    "state" "ShipmentState" NOT NULL,
    "state_date" TIMESTAMP(3) NOT NULL,
    "creation_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "courier_id" TEXT,
    "transportist_id" TEXT,
    "details" TEXT,
    "destination_zip_code" TEXT NOT NULL,
    "destination_street" TEXT NOT NULL,
    "destination_street_number" TEXT NOT NULL,
    "destination_floor" TEXT,
    "destination_apartment" TEXT,
    "destination_city" TEXT NOT NULL,
    "destination_state" TEXT NOT NULL,
    "origin_zip_code" TEXT NOT NULL,
    "origin_street" TEXT NOT NULL,
    "origin_street_number" TEXT NOT NULL,
    "origin_floor" TEXT,
    "origin_apartment" TEXT,
    "origin_city" TEXT NOT NULL,
    "origin_state" TEXT NOT NULL,
    "payment" "PaymentStatus" NOT NULL,

    CONSTRAINT "shipments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "shipment_log" (
    "id" TEXT NOT NULL,
    "shipment_id" TEXT NOT NULL,
    "old_shipment" JSONB NOT NULL,
    "new_shipment" JSONB NOT NULL,
    "action" "LogAction" NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "shipment_log_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "couriers" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "couriers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "courier_shipments" (
    "id" TEXT NOT NULL,
    "shipment_id" TEXT NOT NULL,
    "courier_id" TEXT NOT NULL,
    "courier_package_id" TEXT NOT NULL,

    CONSTRAINT "courier_shipments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "packages" (
    "id" TEXT NOT NULL,
    "weight" DOUBLE PRECISION NOT NULL,
    "height" DOUBLE PRECISION,
    "width" DOUBLE PRECISION,
    "length" DOUBLE PRECISION,
    "shipment_id" TEXT NOT NULL,
    "package_type" "PackageType" NOT NULL,

    CONSTRAINT "packages_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "shipments_tracking_id_key" ON "shipments"("tracking_id");

-- AddForeignKey
ALTER TABLE "shipments" ADD CONSTRAINT "shipments_transportist_id_fkey" FOREIGN KEY ("transportist_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shipments" ADD CONSTRAINT "shipments_courier_id_fkey" FOREIGN KEY ("courier_id") REFERENCES "couriers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shipment_log" ADD CONSTRAINT "shipment_log_shipment_id_fkey" FOREIGN KEY ("shipment_id") REFERENCES "shipments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "courier_shipments" ADD CONSTRAINT "courier_shipments_shipment_id_fkey" FOREIGN KEY ("shipment_id") REFERENCES "shipments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "courier_shipments" ADD CONSTRAINT "courier_shipments_courier_id_fkey" FOREIGN KEY ("courier_id") REFERENCES "couriers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "packages" ADD CONSTRAINT "packages_shipment_id_fkey" FOREIGN KEY ("shipment_id") REFERENCES "shipments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
