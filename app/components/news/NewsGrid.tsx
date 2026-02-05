'use client';

import NewsCard from './NewsCard';

export default function NewsGrid() {
    // Sample news data - in production, this would come from a CMS or API
    const newsItems = [
        {
            slug: 'peluncuran-koleksi-terbaru-2026',
            title: 'Peluncuran Koleksi Merchandise Terbaru 2026',
            excerpt: 'UB Merch dengan bangga mempersembahkan koleksi merchandise terbaru yang menggabungkan desain modern dengan identitas Universitas Brawijaya. Koleksi ini mencakup hoodie, tote bag, dan aksesoris premium lainnya.',
            image: '/images/reusable/Logo Ub Merch.png',
            date: '28 Jan 2026',
            author: 'Tim UB Merch',
            readTime: '5 min',
            category: 'Produk Baru'
        },
        {
            slug: 'kolaborasi-designer-lokal',
            title: 'Kolaborasi dengan Designer Lokal Malang',
            excerpt: 'Dalam upaya mendukung talenta lokal, UB Merch berkolaborasi dengan desainer muda Malang untuk menciptakan limited edition merchandise yang unik dan eksklusif. Setiap piece dirancang dengan detail yang memukau.',
            image: '/images/reusable/Logo Ub Merch.png',
            date: '25 Jan 2026',
            author: 'Marketing Team',
            readTime: '4 min',
            category: 'Kolaborasi'
        },
        {
            slug: 'program-sustainability',
            title: 'Program Sustainability: Merchandise Ramah Lingkungan',
            excerpt: 'UB Merch berkomitmen terhadap keberlanjutan dengan meluncurkan lini produk ramah lingkungan. Menggunakan bahan organik dan proses produksi yang eco-friendly untuk masa depan yang lebih baik.',
            image: '/images/reusable/Logo Ub Merch.png',
            date: '20 Jan 2026',
            author: 'Sustainability Team',
            readTime: '6 min',
            category: 'Sustainability'
        },
        {
            slug: 'event-anniversary',
            title: 'Rayakan Anniversary dengan Diskon Hingga 40%',
            excerpt: 'Merayakan anniversary UB Merch dengan penawaran spesial! Dapatkan diskon hingga 40% untuk produk pilihan dan merchandise eksklusif. Jangan lewatkan kesempatan emas ini!',
            image: '/images/reusable/Logo Ub Merch.png',
            date: '15 Jan 2026',
            author: 'Promo Team',
            readTime: '3 min',
            category: 'Event'
        },
        {
            slug: 'testimoni-alumni',
            title: 'Testimoni Alumni: Merchandise yang Membanggakan',
            excerpt: 'Para alumni Universitas Brawijaya berbagi cerita mereka tentang bagaimana merchandise UB menjadi simbol kebanggaan mereka di berbagai belahan dunia. Kisah inspiratif yang patut dibaca.',
            image: '/images/reusable/Logo Ub Merch.png',
            date: '10 Jan 2026',
            author: 'Alumni Relations',
            readTime: '7 min',
            category: 'Komunitas'
        },
        {
            slug: 'tips-perawatan-merchandise',
            title: 'Tips Merawat Merchandise Agar Awet dan Tahan Lama',
            excerpt: 'Panduan lengkap merawat merchandise kesayanganmu. Dari cara mencuci hoodie, menyimpan tote bag, hingga merawat aksesoris agar tetap terlihat seperti baru.',
            image: '/images/reusable/Logo Ub Merch.png',
            date: '5 Jan 2026',
            author: 'Customer Care',
            readTime: '5 min',
            category: 'Tips & Trik'
        }
    ];

    return (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {newsItems.map((item, index) => (
                <NewsCard key={index} {...item} />
            ))}
        </div>
    );
}
