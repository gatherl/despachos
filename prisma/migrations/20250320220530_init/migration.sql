-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'USER', 'COURIER');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "dni" TEXT NOT NULL,
    "cult" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT,
    "email" TEXT,
    "role" "Role",
    "cellphone" TEXT,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "packages" (
    "id" TEXT NOT NULL,
    "size" TEXT NOT NULL,
    "weight" DOUBLE PRECISION NOT NULL,
    "tracking_id" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "state_date" TIMESTAMP(3) NOT NULL,
    "creation_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "courier_id" TEXT,
    "sender_id" TEXT NOT NULL,
    "receiver_id" TEXT NOT NULL,
    "destination_zip_code" TEXT NOT NULL,
    "destination_street" TEXT NOT NULL,
    "destination_floor" TEXT NOT NULL,
    "destination_city" TEXT NOT NULL,
    "destination_state" TEXT NOT NULL,
    "destination_country" TEXT NOT NULL,
    "destination_apartment" TEXT,
    "destination_btw_st_1" TEXT NOT NULL,
    "destination_btw_st_2" TEXT NOT NULL,
    "origin_zip_code" TEXT NOT NULL,
    "origin_street" TEXT NOT NULL,
    "origin_floor" TEXT NOT NULL,
    "origin_city" TEXT NOT NULL,
    "origin_state" TEXT NOT NULL,
    "origin_country" TEXT NOT NULL,
    "origin_apartment" TEXT NOT NULL,
    "origin_btw_st_1" TEXT NOT NULL,
    "origin_btw_st_2" TEXT NOT NULL,
    "details" TEXT,
    "units_value" DOUBLE PRECISION NOT NULL,
    "units_number" INTEGER NOT NULL,
    "package_type" TEXT NOT NULL,

    CONSTRAINT "packages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "package_log" (
    "id" TEXT NOT NULL,
    "package_id" TEXT NOT NULL,
    "old_package" JSONB NOT NULL,
    "new_package" JSONB NOT NULL,
    "action" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "package_log_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "couriers" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "couriers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "couriers_packages" (
    "id" TEXT NOT NULL,
    "package_id" TEXT NOT NULL,
    "courier_id" TEXT NOT NULL,
    "courier_package_id" TEXT NOT NULL,

    CONSTRAINT "couriers_packages_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_dni_key" ON "users"("dni");

-- CreateIndex
CREATE UNIQUE INDEX "packages_tracking_id_key" ON "packages"("tracking_id");

-- CreateIndex
CREATE UNIQUE INDEX "couriers_packages_courier_package_id_key" ON "couriers_packages"("courier_package_id");

-- AddForeignKey
ALTER TABLE "packages" ADD CONSTRAINT "packages_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "packages" ADD CONSTRAINT "packages_receiver_id_fkey" FOREIGN KEY ("receiver_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "packages" ADD CONSTRAINT "packages_courier_id_fkey" FOREIGN KEY ("courier_id") REFERENCES "couriers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "package_log" ADD CONSTRAINT "package_log_package_id_fkey" FOREIGN KEY ("package_id") REFERENCES "packages"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "couriers_packages" ADD CONSTRAINT "couriers_packages_package_id_fkey" FOREIGN KEY ("package_id") REFERENCES "packages"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "couriers_packages" ADD CONSTRAINT "couriers_packages_courier_id_fkey" FOREIGN KEY ("courier_id") REFERENCES "couriers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
