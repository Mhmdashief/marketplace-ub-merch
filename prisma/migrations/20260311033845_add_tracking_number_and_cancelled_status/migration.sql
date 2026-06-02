-- AlterEnum
ALTER TYPE "ShippingStatus" ADD VALUE 'CANCELLED';

-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "trackingNumber" TEXT;
