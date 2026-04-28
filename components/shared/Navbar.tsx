'use client';

import { Menu, X, ChevronDown } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';


export default function Navbar() {
    const pathname = usePathname();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isMerchandiseOpen, setIsMerchandiseOpen] = useState(false);
    const [isMobileMerchOpen, setIsMobileMerchOpen] = useState(false);

    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const navLinks = [
        { name: 'About Us', href: '/about' },
        { name: 'News', href: '/news' },
        { name: 'Services', href: '/services' },
        { name: 'Contact', href: '/contact' },
    ];

    // Auto-close mobile menu when route changes (prevents dispatchEvent null bug)
    useEffect(() => {
        setIsMenuOpen(false);
        setIsMobileMerchOpen(false);
    }, [pathname]);



    const isAuthPage = pathname?.startsWith('/auth');
    const isAdminPage = pathname?.startsWith('/admin');

    if (isAuthPage || isAdminPage) return null;
    const handleMouseEnter = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }
        setIsMerchandiseOpen(true);
    };

    const handleMouseLeave = () => {
        timeoutRef.current = setTimeout(() => {
            setIsMerchandiseOpen(false);
        }, 500);
    };


    const merchandiseCategories = [
        { name: 'Tote Bag & Slempang', slug: 'totebag-and-slempang' },
        { name: 'T-shirt', slug: 't-shirt' },
        { name: 'Tumbler', slug: 'tumbler' },
        { name: 'Crewneck & Hoodie', slug: 'crewneck-and-hoodie' },
        { name: 'Varsity', slug: 'varsity' },
        { name: 'Polo', slug: 'polo' },
        { name: 'Leather Jacket', slug: 'leather-jacket' },
        { name: 'Leather Product', slug: 'leather-product' },
        { name: 'T-Shirt Colourful', slug: 't-shirt-colourful' },
        { name: 'Vest', slug: 'vest' },
        { name: 'Sepatu', slug: 'sepatu' },
        { name: 'Topi', slug: 'topi' },
        { name: 'Pengharum ruangan', slug: 'pengharum-ruangan' }
    ].map(cat => ({
        ...cat,
        href: `/merchandise?category=${cat.slug}`
    }));

    return (
        <nav className="sticky top-0 z-[60] backdrop-blur-glass bg-white/95 border-b border-gray-200 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    <Link href="/" className="flex items-center space-x-3 flex-shrink-0">
                        <Image
                            src="/images/reusable/Logo Ub Merch.png"
                            alt="UB Merch Logo"
                            width={120}
                            height={40}
                            className="h-10 w-auto"
                            priority
                        />
                    </Link>

                    <div className="hidden lg:flex items-center space-x-8 flex-1 justify-center">
                        <div className="relative group/merch">
                            <button
                                onMouseEnter={handleMouseEnter}
                                onMouseLeave={handleMouseLeave}
                                className="flex items-center space-x-1 text-gray-700 hover:text-ub-navy font-medium transition-all duration-300 py-2 relative after:content-[''] after:absolute after:bottom-1 after:left-0 after:w-0 after:h-0.5 after:bg-ub-gold after:transition-all after:duration-300 group-hover/merch:after:w-full"
                            >
                                <span>Merchandise</span>
                                <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isMerchandiseOpen ? 'rotate-180 text-ub-navy' : ''}`} />
                            </button>

                            {isMerchandiseOpen && (
                                <div
                                    onMouseEnter={handleMouseEnter}
                                    onMouseLeave={handleMouseLeave}
                                    className="absolute top-full left-1/2 -translate-x-1/2 mt-1 w-[480px] bg-white rounded-2xl shadow-2xl border border-gray-100 p-4 animate-fade-in ring-1 ring-black/5"
                                >
                                    <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                                        {merchandiseCategories.map((category) => (
                                            <Link
                                                key={category.name}
                                                href={category.href}
                                                className="block px-4 py-2.5 text-gray-600 hover:bg-gray-50 hover:text-ub-navy rounded-lg transition-all duration-200 border-l-2 border-transparent hover:border-ub-gold group"
                                            >
                                                <span className="group-hover:translate-x-1 inline-block transition-transform duration-200">
                                                    {category.name}
                                                </span>
                                            </Link>
                                        ))}
                                    </div>
                                    <div className="mt-4 pt-4 border-t border-gray-50 flex justify-between items-center px-2">
                                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">UB Merchandise</span>
                                        <Link href="/merchandise" className="text-xs text-ub-navy font-bold hover:underline">View All Collection →</Link>
                                    </div>
                                </div>
                            )}
                        </div>

                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className="text-gray-700 hover:text-ub-navy font-medium transition-all duration-300 relative after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-0.5 after:bg-ub-gold after:transition-all after:duration-300 hover:after:w-full"
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>

                    {/* Desktop Search & Icons */}
                    <div className="hidden lg:flex items-center space-x-3">
                        {/* Auth links removed */}
                    </div>

                    {/* Mobile Navigation Icons */}
                    <div className="flex lg:hidden items-center space-x-1">


                        <div className="p-1">
                            {/* Mobile Auth links removed */}
                        </div>

                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="p-2.5 hover:bg-gray-100 rounded-full transition-all duration-300 active:scale-95"
                        >
                            {isMenuOpen ? <X className="w-6 h-6 text-ub-navy" /> : <Menu className="w-6 h-6 text-gray-700" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu Content */}
                {isMenuOpen && (
                    <div className="lg:hidden py-6 space-y-6 animate-fade-in border-t border-gray-100 px-4">
                        <div className="space-y-2">
                            <button
                                onClick={() => setIsMobileMerchOpen(!isMobileMerchOpen)}
                                className="w-full flex items-center justify-between px-4 py-3 text-left text-gray-700 hover:bg-ub-gold/5 rounded-2xl transition-all duration-200 group"
                            >
                                <span className="font-black text-black text-[12px] uppercase tracking-widest">Merchandise</span>
                                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${isMobileMerchOpen ? 'rotate-180 text-ub-navy' : ''}`} />
                            </button>

                            <div className={`space-y-1 pl-4 overflow-hidden transition-all duration-500 ease-in-out ${isMobileMerchOpen ? 'max-h-[800px] opacity-100 mt-2' : 'max-h-0 opacity-0'}`}>
                                {merchandiseCategories.map((category) => (
                                    <Link
                                        key={category.name}
                                        href={category.href}
                                        className="block px-4 py-3 text-sm text-gray-600 hover:text-ub-navy hover:bg-gray-50 rounded-xl transition-all duration-200 border-l-2 border-transparent hover:border-ub-gold"
                                    >
                                        {category.name}
                                    </Link>
                                ))}
                                <Link
                                    href="/merchandise"
                                    className="block px-4 py-3 text-xs font-black text-ub-navy hover:underline mt-4 tracking-tight"
                                >
                                    VIEW ALL COLLECTION →
                                </Link>
                            </div>

                            <div className="pt-4 space-y-2 border-t border-gray-50">
                                {navLinks.map((link) => (
                                    <Link
                                        key={link.name}
                                        href={link.href}
                                        className="block px-4 py-3.5 text-gray-900 hover:bg-ub-navy hover:text-white rounded-2xl transition-all duration-300 font-bold group flex items-center justify-between"
                                    >
                                        <span className="text-[11px] uppercase tracking-[0.2em]">{link.name}</span>
                                        <ChevronDown className="w-4 h-4 -rotate-90 opacity-0 group-hover:opacity-100 transition-all duration-300" />
                                    </Link>
                                ))}
                            </div>


                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
}
