'use client';

import { Menu, X, ChevronDown } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';


export default function Navbar() {
    const pathname = usePathname();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const navLinks = [
        { name: 'Merchandise', href: '/merchandise' },
        { name: 'About Us', href: '/about' },
        { name: 'News', href: '/news' },
        { name: 'Services', href: '/services' },
        { name: 'Contact', href: '/contact' },
    ];

    // Auto-close mobile menu when route changes (prevents dispatchEvent null bug)
    useEffect(() => {
        setIsMenuOpen(false);
    }, [pathname]);



    const isAuthPage = pathname?.startsWith('/auth');
    const isAdminPage = pathname?.startsWith('/admin');

    if (isAuthPage || isAdminPage) return null;

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
                            aria-label="Toggle mobile menu"
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
                            <div className="space-y-2">
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
