export interface Product {
    id: number;
    name: string;
    price: number;
    category: string;
    image: string;
    rating: number;
    sales: number;
    slug: string;
    description?: string;
    specs?: string[];
}

export const allProducts: Product[] = [
    // Varsity Collection (1-2)
    {
        id: 1,
        name: 'Varsity Jacket UB Limited Edition',
        price: 450000,
        category: 'Varsity',
        image: '/images/products/Varsity/1.png',
        rating: 4.9,
        sales: 245,
        slug: 'varsity-jacket-ub-limited-edition',
        description: 'Exclusively crafted for the bold. This limited edition Varsity Jacket features high-quality materials and signature UB embroidery, perfect for showcasing your university spirit with style.',
        specs: ['Material: Premium Wool & Genuine Leather', 'Embroidery: Signature UB Crest', 'Inner Lining: Silk Quilted', 'Fit: Unisex Relaxed Fit']
    },
    {
        id: 2,
        name: 'Varsity Jacket UB Classic',
        price: 450000,
        category: 'Varsity',
        image: '/images/products/Varsity/2.png',
        rating: 4.8,
        sales: 189,
        slug: 'varsity-jacket-ub-classic',
        description: 'The timeless classic. A staple for every UB student and alumnus, combining confort with the heritage colors of Universitas Brawijaya.',
        specs: ['Material: Premium Wool Blend', 'Sleeves: High-grade Synthetic Leather', 'Colors: Navy & Gold', 'Buttons: Branded UB Snap Buttons']
    },

    // Sepatu Collection (3-12)
    { id: 3, name: 'Sepatu Sneakers UB Collection', price: 385000, category: 'Sepatu', image: '/images/products/Sepatu/1.png', rating: 4.8, sales: 198, slug: 'sepatu-sneakers-ub-collection' },
    { id: 4, name: 'Sepatu Sneakers UB White Edition', price: 395000, category: 'Sepatu', image: '/images/products/Sepatu/2.png', rating: 4.7, sales: 167, slug: 'sepatu-sneakers-ub-white-edition' },
    { id: 5, name: 'Sepatu Sneakers Navy', price: 395000, category: 'Sepatu', image: '/images/products/Sepatu/3.png', rating: 4.6, sales: 145, slug: 'sepatu-sneakers-navy' },
    { id: 6, name: 'Sepatu Sneakers UB Navy', price: 385000, category: 'Sepatu', image: '/images/products/Sepatu/4.png', rating: 4.8, sales: 178, slug: 'sepatu-sneakers-ub-navy' },
    { id: 7, name: 'Sepatu Sneakers White', price: 385000, category: 'Sepatu', image: '/images/products/Sepatu/5.png', rating: 4.9, sales: 203, slug: 'sepatu-sneakers-white' },
    { id: 8, name: 'Sepatu Sneakers UB Red', price: 395000, category: 'Sepatu', image: '/images/products/Sepatu/6.png', rating: 4.7, sales: 134, slug: 'sepatu-sneakers-ub-red' },
    { id: 9, name: 'Sepatu Sneakers Series', price: 385000, category: 'Sepatu', image: '/images/products/Sepatu/7.png', rating: 4.8, sales: 189, slug: 'sepatu-sneakers-series' },
    { id: 10, name: 'Sepatu Sneakers UB Edition', price: 385000, category: 'Sepatu', image: '/images/products/Sepatu/8.png', rating: 4.7, sales: 156, slug: 'sepatu-sneakers-ub-edition' },
    { id: 11, name: 'Sepatu Sneakers UB Premium', price: 395000, category: 'Sepatu', image: '/images/products/Sepatu/9.png', rating: 4.8, sales: 178, slug: 'sepatu-sneakers-ub-premium' },
    { id: 12, name: 'Sepatu Sneakers UB Limited', price: 395000, category: 'Sepatu', image: '/images/products/Sepatu/10.png', rating: 4.9, sales: 192, slug: 'sepatu-sneakers-ub-limited' },

    // Topi Collection (13-16)
    { id: 13, name: 'Topi Baseball UB Premium', price: 95000, category: 'Topi', image: '/images/products/Topi/1.png', rating: 4.6, sales: 234, slug: 'topi-baseball-ub-premium' },
    { id: 14, name: 'Topi Baseball Classic', price: 95000, category: 'Topi', image: '/images/products/Topi/2.png', rating: 4.7, sales: 198, slug: 'topi-baseball-classic' },
    { id: 15, name: 'Topi Baseball UB Black', price: 95000, category: 'Topi', image: '/images/products/Topi/3.png', rating: 4.5, sales: 167, slug: 'topi-baseball-ub-black' },
    { id: 16, name: 'Topi Baseball UB Navy', price: 95000, category: 'Topi', image: '/images/products/Topi/4.png', rating: 4.6, sales: 156, slug: 'topi-baseball-ub-navy' },

    // T-shirt Collection (17-21)
    { id: 17, name: 'T-shirt UB Official', price: 125000, category: 'T-shirt', image: '/images/products/T-Shirt/1.png', rating: 4.7, sales: 289, slug: 't-shirt-ub-official' },
    { id: 18, name: 'T-shirt UB Premium', price: 135000, category: 'T-shirt', image: '/images/products/T-Shirt/2.png', rating: 4.6, sales: 234, slug: 't-shirt-ub-premium' },
    { id: 19, name: 'T-shirt UB Classic', price: 125000, category: 'T-shirt', image: '/images/products/T-Shirt/3.png', rating: 4.8, sales: 267, slug: 't-shirt-ub-classic' },
    { id: 20, name: 'T-shirt UB Edition', price: 125000, category: 'T-shirt', image: '/images/products/T-Shirt/4.png', rating: 4.7, sales: 245, slug: 't-shirt-ub-edition' },
    { id: 21, name: 'T-shirt UB Limited', price: 135000, category: 'T-shirt', image: '/images/products/T-Shirt/5.png', rating: 4.8, sales: 256, slug: 't-shirt-ub-limited' },

    // T-Shirt Colourful Collection (22-28)
    { id: 22, name: 'T-Shirt Colourful UB Complete', price: 135000, category: 'T-Shirt Colourful', image: '/images/products/T-Shirt Colourful/1.png', rating: 4.7, sales: 178, slug: 't-shirt-colourful-ub-complete' },
    { id: 23, name: 'T-Shirt Colourful UB Limited', price: 125000, category: 'T-Shirt Colourful', image: '/images/products/T-Shirt Colourful/2.png', rating: 4.6, sales: 145, slug: 't-shirt-colourful-ub-limited' },
    { id: 24, name: 'T-Shirt Colourful UB Edition', price: 135000, category: 'T-Shirt Colourful', image: '/images/products/T-Shirt Colourful/3.png', rating: 4.8, sales: 198, slug: 't-shirt-colourful-ub-edition' },
    { id: 25, name: 'T-Shirt Colourful UB Premium', price: 135000, category: 'T-Shirt Colourful', image: '/images/products/T-Shirt Colourful/4.png', rating: 4.7, sales: 167, slug: 't-shirt-colourful-ub-premium' },
    { id: 26, name: 'T-Shirt Colourful UB Classic', price: 125000, category: 'T-Shirt Colourful', image: '/images/products/T-Shirt Colourful/5.png', rating: 4.8, sales: 189, slug: 't-shirt-colourful-ub-classic' },
    { id: 27, name: 'T-Shirt Colourful UB Special', price: 135000, category: 'T-Shirt Colourful', image: '/images/products/T-Shirt Colourful/6.png', rating: 4.7, sales: 156, slug: 't-shirt-colourful-ub-special' },
    { id: 28, name: 'T-Shirt Colourful UB Exclusive', price: 135000, category: 'T-Shirt Colourful', image: '/images/products/T-Shirt Colourful/7.png', rating: 4.9, sales: 201, slug: 't-shirt-colourful-ub-exclusive' },

    // Leather Product Collection (29-35)
    { id: 29, name: 'Leather Product UB Collection', price: 135000, category: 'Leather Product', image: '/images/products/Leather Product/1.png', rating: 4.8, sales: 156, slug: 'leather-product-ub-collection' },
    { id: 30, name: 'Leather Product Set UB Collection', price: 145000, category: 'Leather Product', image: '/images/products/Leather Product/2.png', rating: 4.7, sales: 134, slug: 'leather-product-set-ub-collection' },
    { id: 31, name: 'Leather Product Bundle', price: 150000, category: 'Leather Product', image: '/images/products/Leather Product/3.png', rating: 4.9, sales: 167, slug: 'leather-product-bundle' },
    { id: 32, name: 'Leather Product Premium', price: 155000, category: 'Leather Product', image: '/images/products/Leather Product/4.png', rating: 4.8, sales: 145, slug: 'leather-product-premium' },
    { id: 33, name: 'Leather Product Limited', price: 160000, category: 'Leather Product', image: '/images/products/Leather Product/5.png', rating: 4.7, sales: 128, slug: 'leather-product-limited' },
    { id: 34, name: 'Leather Product Exclusive', price: 165000, category: 'Leather Product', image: '/images/products/Leather Product/6.png', rating: 4.9, sales: 178, slug: 'leather-product-exclusive' },
    { id: 35, name: 'Leather Product Special', price: 170000, category: 'Leather Product', image: '/images/products/Leather Product/7.png', rating: 4.8, sales: 156, slug: 'leather-product-special' },

    // Leather Jacket Collection (36-37)
    { id: 36, name: 'Leather Jacket UB Edition', price: 555000, category: 'Leather Jacket', image: '/images/products/Leather jacket/1.png', rating: 4.9, sales: 89, slug: 'leather-jacket-ub-edition' },
    { id: 37, name: 'Leather Jacket UB Premium', price: 565000, category: 'Leather Jacket', image: '/images/products/Leather jacket/8.png', rating: 4.8, sales: 76, slug: 'leather-jacket-ub-premium' },

    // Tote Bag \u0026 Slempang Collection (38-41)
    { id: 38, name: 'Tote Bag UB Official', price: 145000, category: 'Tote Bag & Slempang', image: '/images/products/Totebag & Slempang/1.png', rating: 4.6, sales: 198, slug: 'tote-bag-ub-official' },
    { id: 39, name: 'Tote Bag UB Premium', price: 150000, category: 'Tote Bag & Slempang', image: '/images/products/Totebag & Slempang/2.png', rating: 4.7, sales: 178, slug: 'tote-bag-ub-premium' },
    { id: 40, name: 'Slempang UB Collection', price: 155000, category: 'Tote Bag & Slempang', image: '/images/products/Totebag & Slempang/3.png', rating: 4.5, sales: 145, slug: 'slempang-ub-collection' },
    { id: 41, name: 'Tote Bag UB Limited', price: 160000, category: 'Tote Bag & Slempang', image: '/images/products/Totebag & Slempang/4.png', rating: 4.8, sales: 167, slug: 'tote-bag-ub-limited' },

    // Crewneck \u0026 Hoodie Collection (42-48)
    { id: 42, name: 'Crewneck & Hoodie Set', price: 220000, category: 'Crewneck & Hoodie', image: '/images/products/Crewneck & Hoodie/1.png', rating: 4.8, sales: 167, slug: 'crewneck-hoodie-set' },
    { id: 43, name: 'Crewneck UB Premium', price: 215000, category: 'Crewneck & Hoodie', image: '/images/products/Crewneck & Hoodie/2.png', rating: 4.7, sales: 156, slug: 'crewneck-ub-premium' },
    { id: 44, name: 'Hoodie UB Classic', price: 225000, category: 'Crewneck & Hoodie', image: '/images/products/Crewneck & Hoodie/3.png', rating: 4.9, sales: 189, slug: 'hoodie-ub-classic' },
    { id: 45, name: 'Crewneck UB Limited', price: 230000, category: 'Crewneck & Hoodie', image: '/images/products/Crewneck & Hoodie/4.png', rating: 4.8, sales: 178, slug: 'crewneck-ub-limited' },
    { id: 46, name: 'Hoodie UB Premium', price: 235000, category: 'Crewneck & Hoodie', image: '/images/products/Crewneck & Hoodie/5.png', rating: 4.7, sales: 145, slug: 'hoodie-ub-premium' },
    { id: 47, name: 'Crewneck UB Edition', price: 220000, category: 'Crewneck & Hoodie', image: '/images/products/Crewneck & Hoodie/6.png', rating: 4.9, sales: 198, slug: 'crewneck-ub-edition' },
    { id: 48, name: 'Hoodie UB Exclusive', price: 240000, category: 'Crewneck & Hoodie', image: '/images/products/Crewneck & Hoodie/7.png', rating: 4.8, sales: 167, slug: 'hoodie-ub-exclusive' },

    // Tumbler Collection (49-54)
    { id: 49, name: 'Tumbler UB Official', price: 135000, category: 'Tumbler', image: '/images/products/Tumbler/1.png', rating: 4.6, sales: 234, slug: 'tumbler-ub-official' },
    { id: 50, name: 'Tumbler UB Premium', price: 145000, category: 'Tumbler', image: '/images/products/Tumbler/2.png', rating: 4.7, sales: 198, slug: 'tumbler-ub-premium' },
    { id: 51, name: 'Tumbler UB Limited Edition', price: 140000, category: 'Tumbler', image: '/images/products/Tumbler/3.png', rating: 4.8, sales: 212, slug: 'tumbler-ub-limited-edition' },
    { id: 52, name: 'Tumbler UB Exclusive', price: 150000, category: 'Tumbler', image: '/images/products/Tumbler/4.png', rating: 4.7, sales: 178, slug: 'tumbler-ub-exclusive' },
    { id: 53, name: 'Tumbler UB Edition', price: 155000, category: 'Tumbler', image: '/images/products/Tumbler/5.png', rating: 4.8, sales: 167, slug: 'tumbler-ub-edition' },
    { id: 54, name: 'Tumbler UB Special', price: 160000, category: 'Tumbler', image: '/images/products/Tumbler/6.png', rating: 4.7, sales: 156, slug: 'tumbler-ub-special' },

    // Polo Collection (55-57)
    { id: 55, name: 'Polo Shirt UB Classic', price: 165000, category: 'Polo', image: '/images/products/Polo/1.png', rating: 4.7, sales: 145, slug: 'polo-shirt-ub-classic' },
    { id: 56, name: 'Polo Shirt UB Premium', price: 175000, category: 'Polo', image: '/images/products/Polo/2.png', rating: 4.8, sales: 167, slug: 'polo-shirt-ub-premium' },
    { id: 57, name: 'Polo Shirt UB Limited', price: 180000, category: 'Polo', image: '/images/products/Polo/3.png', rating: 4.7, sales: 156, slug: 'polo-shirt-ub-limited' },

    // Vest Collection (58-59)
    { id: 58, name: 'Vest UB Official', price: 185000, category: 'Vest', image: '/images/products/Vest/1.png', rating: 4.6, sales: 123, slug: 'vest-ub-official' },
    { id: 59, name: 'Vest UB Premium', price: 195000, category: 'Vest', image: '/images/products/Vest/2.png', rating: 4.7, sales: 134, slug: 'vest-ub-premium' },
];

export const getProductBySlug = (slug: string) => {
    return allProducts.find(p => p.slug === slug);
};
