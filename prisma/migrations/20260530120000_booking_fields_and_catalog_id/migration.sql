-- AlterTable
ALTER TABLE "Truck" ADD COLUMN "catalogId" TEXT;

-- Backfill catalogId for any existing trucks (use id as fallback)
UPDATE "Truck" SET "catalogId" = "id" WHERE "catalogId" IS NULL;

ALTER TABLE "Truck" ALTER COLUMN "catalogId" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Truck_catalogId_key" ON "Truck"("catalogId");

-- AlterTable
ALTER TABLE "Booking" ADD COLUMN "driverOption" TEXT NOT NULL DEFAULT 'self',
ADD COLUMN "paymentMethod" TEXT NOT NULL DEFAULT 'card',
ADD COLUMN "invoiceNumber" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Booking_invoiceNumber_key" ON "Booking"("invoiceNumber");
