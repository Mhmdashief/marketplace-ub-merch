-- Migration: replace-asset-url-with-binary-storage
-- Mengganti kolom `url` (String) di product_assets dengan penyimpanan binary langsung di PostgreSQL.
-- Data lama (2 rows dari Cloudinary) akan dihapus karena tidak bisa dikonversi otomatis ke binary.

-- Langkah 1: Hapus semua data lama di product_assets (data dari Cloudinary tidak bisa dikonversi ke binary)
-- Ini aman dilakukan karena produk akan diupload ulang via admin panel.
DELETE FROM "product_assets";

-- Langkah 2: Hapus kolom url yang lama
ALTER TABLE "product_assets" DROP COLUMN "url";

-- Langkah 3: Tambah kolom-kolom baru untuk binary storage
ALTER TABLE "product_assets" ADD COLUMN "data"      BYTEA        NOT NULL DEFAULT '';
ALTER TABLE "product_assets" ADD COLUMN "mimeType"  TEXT         NOT NULL DEFAULT 'image/jpeg';
ALTER TABLE "product_assets" ADD COLUMN "fileName"  TEXT         NOT NULL DEFAULT 'image.jpg';
ALTER TABLE "product_assets" ADD COLUMN "size"      INTEGER      NOT NULL DEFAULT 0;
ALTER TABLE "product_assets" ADD COLUMN "sortOrder" INTEGER      NOT NULL DEFAULT 0;

-- Langkah 4: Hapus default sementara setelah kolom ditambahkan
ALTER TABLE "product_assets" ALTER COLUMN "data"     DROP DEFAULT;
ALTER TABLE "product_assets" ALTER COLUMN "mimeType" DROP DEFAULT;
ALTER TABLE "product_assets" ALTER COLUMN "fileName" DROP DEFAULT;
ALTER TABLE "product_assets" ALTER COLUMN "size"     DROP DEFAULT;

-- Langkah 5: Tambah index untuk sortOrder
CREATE INDEX "product_assets_productId_sortOrder_idx" ON "product_assets"("productId", "sortOrder");
