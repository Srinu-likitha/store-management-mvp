/*
  Warnings:

  - A unique constraint covering the columns `[serialNumber]` on the table `MaterialInvoice` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `serialNumber` to the `MaterialInvoice` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."MaterialInvoice" ADD COLUMN     "cgst" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "serialNumber" TEXT NOT NULL,
ADD COLUMN     "sgst" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "totalCost" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "transportationCharges" DOUBLE PRECISION NOT NULL DEFAULT 0;

-- CreateIndex
CREATE UNIQUE INDEX "MaterialInvoice_serialNumber_key" ON "public"."MaterialInvoice"("serialNumber");
