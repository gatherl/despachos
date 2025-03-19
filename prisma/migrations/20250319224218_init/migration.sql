-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'USER',

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "packages" (
    "id" SERIAL NOT NULL,
    "destination" TEXT NOT NULL,
    "origin" TEXT NOT NULL,
    "size" TEXT NOT NULL,
    "weight" DOUBLE PRECISION NOT NULL,
    "tracking_id" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "state_date" TIMESTAMP(3) NOT NULL,
    "creation_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "courier_id" INTEGER,
    "sender_id" INTEGER NOT NULL,

    CONSTRAINT "packages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "couriers" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "couriers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "package_log" (
    "id" SERIAL NOT NULL,
    "package_id" INTEGER NOT NULL,
    "old_package" JSONB,
    "new_package" JSONB,
    "action" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "package_log_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "courier_packages" (
    "id" SERIAL NOT NULL,
    "package_id" INTEGER NOT NULL,
    "courier_id" INTEGER NOT NULL,
    "courier_package_id" TEXT,

    CONSTRAINT "courier_packages_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "packages_tracking_id_key" ON "packages"("tracking_id");

-- AddForeignKey
ALTER TABLE "packages" ADD CONSTRAINT "packages_courier_id_fkey" FOREIGN KEY ("courier_id") REFERENCES "couriers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "packages" ADD CONSTRAINT "packages_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "package_log" ADD CONSTRAINT "package_log_package_id_fkey" FOREIGN KEY ("package_id") REFERENCES "packages"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "courier_packages" ADD CONSTRAINT "courier_packages_package_id_fkey" FOREIGN KEY ("package_id") REFERENCES "packages"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "courier_packages" ADD CONSTRAINT "courier_packages_courier_id_fkey" FOREIGN KEY ("courier_id") REFERENCES "couriers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
