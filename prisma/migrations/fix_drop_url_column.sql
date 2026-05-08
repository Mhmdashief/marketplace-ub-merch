-- Drop kolom url lama yang masih tersisa di database
ALTER TABLE "product_assets" DROP COLUMN IF EXISTS "url";
