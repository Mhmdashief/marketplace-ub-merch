'use client';

import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface ServiceCardProps {
    icon: LucideIcon;
    title: string;
    description: string;
    features: string[];
    color: string;
    index: number;
}

export default function ServiceCard({
    icon: Icon,
    title,
    description,
    features,
    color,
    index
}: ServiceCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className="group relative bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-ub-gold overflow-hidden"
        >
            {/* Background Gradient Effect */}
            <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />

            {/* Content */}
            <div className="relative z-10">
                {/* Icon */}
                <div className={`w-20 h-20 bg-gradient-to-br ${color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg`}>
                    <Icon className="w-10 h-10 text-white" />
                </div>

                {/* Title */}
                <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-ub-navy transition-colors">
                    {title}
                </h3>

                {/* Description */}
                <p className="text-gray-600 mb-6 leading-relaxed">
                    {description}
                </p>

                {/* Features List */}
                <ul className="space-y-3">
                    {features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                            <svg
                                className={`w-5 h-5 mt-0.5 flex-shrink-0 bg-gradient-to-br ${color} rounded-full p-1`}
                                fill="white"
                                viewBox="0 0 20 20"
                            >
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            <span className="text-gray-700">{feature}</span>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Decorative Corner */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-ub-gold/10 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </motion.div>
    );
}
