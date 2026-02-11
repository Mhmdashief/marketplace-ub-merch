'use client';

import { motion } from 'framer-motion';
import {
    ArrowRight,
    Palette,
    Package,
    Sparkles,
    PenTool,
    Video,
    Camera,
    Calendar,
    Globe,
    Check
} from 'lucide-react';

interface ServiceCardProps {
    iconName: string;
    title: string;
    description: string;
    features: string[];
    gradient: string;
    index: number;
    className?: string; // For bento grid spans
}

// Icon mapping
const iconMap: Record<string, any> = {
    'Palette': Palette,
    'Package': Package,
    'Sparkles': Sparkles,
    'PenTool': PenTool,
    'Video': Video,
    'Camera': Camera,
    'Calendar': Calendar,
    'Globe': Globe,
    'Check': Check,
};

export default function ServiceCard({ iconName, title, description, features, gradient, index, className = '' }: ServiceCardProps) {
    const Icon = iconMap[iconName] || Sparkles;

    // Deteksi apakah ini kartu besar (wide) untuk menerapkan Dark Theme
    const isWide = className?.includes('col-span-2');

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className={`group relative flex flex-col justify-between overflow-hidden rounded-[2.5rem] transition-all duration-500 ${className}
                ${isWide
                    ? 'bg-ub-navy text-white shadow-2xl hover:shadow-ub-gold/20'
                    : 'bg-white text-gray-900 border border-gray-100 hover:border-transparent hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)]'
                }
            `}
        >
            {/* --- Background Effects --- */}

            {/* 1. Gradient Orb Background */}
            <div className={`absolute -top-20 -right-20 w-64 h-64 rounded-full bg-gradient-to-br ${gradient} blur-[100px] transition-all duration-700 opacity-40 group-hover:opacity-60 group-hover:scale-125`} />

            {/* 2. Bottom Glow for Grid Consistency */}
            <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${gradient} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left`} />

            {/* --- Content --- */}
            <div className="relative z-10 p-8 md:p-10 flex flex-col h-full">

                {/* Header: Number & Icon */}
                <div className="flex justify-between items-start mb-8">
                    <div className={`
                        flex items-center justify-center w-14 h-14 rounded-2xl backdrop-blur-md border transition-all duration-500
                        ${isWide
                            ? 'bg-white/10 border-white/10 group-hover:bg-white/20'
                            : 'bg-gray-50 border-gray-100 group-hover:bg-white group-hover:shadow-lg'
                        }
                    `}>
                        <Icon className={`w-7 h-7 transition-colors duration-300 ${isWide ? 'text-white' : 'text-gray-900'}`} strokeWidth={1.5} />
                    </div>

                    <span className={`font-mono text-xl font-bold tracking-tighter opacity-20 ${isWide ? 'text-white' : 'text-gray-900'}`}>
                        0{index + 1}
                    </span>
                </div>

                {/* Main Content */}
                <div className="flex-grow">
                    <h3 className={`text-3xl md:text-4xl font-black mb-4 leading-tight tracking-tight ${isWide ? 'text-white' : 'text-gray-900'}`}>
                        {title}
                    </h3>

                    <p className={`text-lg leading-relaxed mb-8 font-medium ${isWide ? 'text-gray-300' : 'text-gray-500'}`}>
                        {description}
                    </p>

                    {/* Features - Styled Differently based on Variant */}
                    <div className="border-t border-dashed border-opacity-20 border-gray-500 pt-6">
                        <ul className={`grid gap-3 ${isWide ? 'grid-cols-2' : 'grid-cols-1'}`}>
                            {features.slice(0, 4).map((feature, idx) => (
                                <li key={idx} className="flex items-center gap-3">
                                    <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${gradient}`} />
                                    <span className={`text-sm font-semibold tracking-wide ${isWide ? 'text-gray-300' : 'text-gray-600'}`}>
                                        {feature}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Footer Action - Order Button */}
                <div className="mt-8 pt-2">
                    <a
                        href={`https://wa.me/6282126667575?text=Halo%20UB%20Merch,%20saya%20tertarik%20dengan%20layanan%20${encodeURIComponent(title)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`
                            group/btn w-full flex items-center justify-center gap-3 py-4 rounded-xl font-bold tracking-wide transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]
                            ${isWide
                                ? 'bg-white text-ub-navy hover:bg-gray-100 shadow-lg shadow-black/20'
                                : 'bg-ub-navy text-white hover:bg-ub-dark-navy shadow-lg shadow-ub-navy/20'
                            }
                        `}
                    >
                        Order Now
                        <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover/btn:translate-x-1" />
                    </a>
                </div>
            </div>

            {/* --- Artistic Elements --- */}
            {/* Giant Outlined Text/Number overlay for modern feel */}
            <div className={`absolute -bottom-4 -left-4 text-[120px] font-black leading-none opacity-[0.03] select-none pointer-events-none transition-transform duration-700 group-hover:translate-x-4 ${isWide ? 'text-white' : 'text-black'}`}>
                {index + 1}
            </div>
        </motion.div>
    );
}
