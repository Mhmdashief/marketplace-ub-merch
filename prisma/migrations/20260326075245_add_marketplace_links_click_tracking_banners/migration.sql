-- CreateEnum
CREATE TYPE "MarketplacePlatform" AS ENUM ('TOKOPEDIA', 'SHOPEE', 'LAZADA', 'TIKTOK', 'BUKALAPAK', 'OFFICIAL_WEBSITE');

-- CreateTable
CREATE TABLE "marketplace_links" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "platform" "MarketplacePlatform" NOT NULL,
    "url" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "marketplace_links_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "click_trackings" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "marketplaceLinkId" TEXT,
    "platform" "MarketplacePlatform" NOT NULL,
    "clickedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "click_trackings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "banners" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "subtitle" TEXT,
    "imageUrl" TEXT NOT NULL,
    "linkUrl" TEXT,
    "linkLabel" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "banners_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "marketplace_links_productId_idx" ON "marketplace_links"("productId");

-- CreateIndex
CREATE UNIQUE INDEX "marketplace_links_productId_platform_key" ON "marketplace_links"("productId", "platform");

-- CreateIndex
CREATE INDEX "click_trackings_productId_idx" ON "click_trackings"("productId");

-- CreateIndex
CREATE INDEX "click_trackings_platform_idx" ON "click_trackings"("platform");

-- CreateIndex
CREATE INDEX "click_trackings_clickedAt_idx" ON "click_trackings"("clickedAt");

-- CreateIndex
CREATE INDEX "banners_isActive_sortOrder_idx" ON "banners"("isActive", "sortOrder");

-- AddForeignKey
ALTER TABLE "marketplace_links" ADD CONSTRAINT "marketplace_links_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "click_trackings" ADD CONSTRAINT "click_trackings_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "click_trackings" ADD CONSTRAINT "click_trackings_marketplaceLinkId_fkey" FOREIGN KEY ("marketplaceLinkId") REFERENCES "marketplace_links"("id") ON DELETE SET NULL ON UPDATE CASCADE;
