'use client';

import { motion } from 'framer-motion';
import { Calendar, Clock } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface NewsCardProps {
    title: string;
    excerpt: string;
    image: string;
    date: string;
    author: string;
    readTime: string;
    category: string;
    slug: string;
}

export default function NewsCard({
    title,
    excerpt,
    image,
    date,
    readTime,
    category,
    slug
}: NewsCardProps) {
    return (
        <motion.article
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="group bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-ub-gold"
        >
            {/* Image Container */}
            <Link href={`/news/${slug}`} className="block relative h-64 overflow-hidden">
                <Image
                    src={image}
                    alt={title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                />
                {/* Category Badge */}
                <div className="absolute top-4 left-4 bg-gradient-to-r from-ub-navy to-ub-dark-navy text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                    {category}
                </div>
            </Link>

            {/* Content */}
            <div className="p-6">
                {/* Meta Info */}
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                    <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{date}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{readTime}</span>
                    </div>
                </div>

                {/* Title */}
                <Link href={`/news/${slug}`}>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-ub-navy transition-colors line-clamp-2">
                        {title}
                    </h3>
                </Link>

                {/* Excerpt */}
                <p className="text-gray-600 mb-4 line-clamp-3 leading-relaxed">
                    {excerpt}
                </p>

                {/* Read More Link */}
                <Link
                    href={`/news/${slug}`}
                    className="inline-flex items-center text-ub-navy font-semibold hover:text-ub-gold transition-colors group/link"
                >
                    Baca Selengkapnya
                    <svg
                        className="w-5 h-5 ml-2 group-hover/link:translate-x-2 transition-transform"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                </Link>
            </div>
        </motion.article>
    );
}
