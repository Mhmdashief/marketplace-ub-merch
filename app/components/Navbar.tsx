'use client';

import { Search, ShoppingCart, User, Menu, X, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isMerchandiseOpen, setIsMerchandiseOpen] = useState(false);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Searching for:', searchQuery);
    };

    const merchandiseCategories = [
        { name: 'Ready Stock', href: '/ready-stock' },
        { name: 'Custom Design', href: '/custom-design' },
        { name: 'Keychain', href: '/keychain' },
        { name: 'Sticker', href: '/sticker' },
        { name: 'Tote Bag', href: '/tote-bag' },
        { name: 'T-shirt', href: '/t-shirt' },
        { name: 'Tumbler', href: '/tumbler' },
        { name: 'Hoodie', href: '/hoodie' },
        { name: 'Sweater', href: '/sweater' },
        { name: 'Varsity', href: '/varsity' },
        { name: 'Polo', href: '/polo' },
        { name: 'Long Sleeve', href: '/long-sleeve' },
        { name: 'Baseball', href: '/baseball' },
        { name: 'Best Seller', href: '/best-seller' }

    ];

    return (
        <nav className="sticky top-0 z-50 backdrop-blur-glass bg-white/95 border-b border-gray-200 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    {/* Logo */}
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

                    {/* Desktop Navigation Menu */}
                    <div className="hidden lg:flex items-center space-x-8 flex-1 justify-center">
                        {/* Merchandise Dropdown */}
                        <div className="relative group/merch">
                            <button
                                onMouseEnter={() => setIsMerchandiseOpen(true)}
                                onMouseLeave={() => setIsMerchandiseOpen(false)}
                                className="flex items-center space-x-1 text-gray-700 hover:text-ub-navy font-medium transition-all duration-300 py-2 relative after:content-[''] after:absolute after:bottom-1 after:left-0 after:w-0 after:h-0.5 after:bg-ub-gold after:transition-all after:duration-300 group-hover/merch:after:w-full"
                            >
                                <span>Merchandise</span>
                                <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isMerchandiseOpen ? 'rotate-180 text-ub-navy' : ''}`} />
                            </button>

                            {/* Dropdown Menu (Mega Menu Style) */}
                            {isMerchandiseOpen && (
                                <div
                                    onMouseEnter={() => setIsMerchandiseOpen(true)}
                                    onMouseLeave={() => setIsMerchandiseOpen(false)}
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

                        {[
                            { name: 'About Us', href: '/about' },
                            { name: 'News', href: '/news' },
                            { name: 'Services', href: '/services' },
                            { name: 'Contact', href: '/contact' },
                        ].map((link) => (
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
                        {/* Search Bar */}
                        <form onSubmit={handleSearch} className="relative group">
                            <input
                                type="text"
                                placeholder="Search products..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-40 focus:w-64 px-4 py-2 pl-10 pr-4 rounded-full border border-gray-500 bg-gray-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-ub-navy/20 focus:border-ub-navy transition-all duration-500 text-sm text-black"
                            />
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-ub-navy transition-colors" />
                        </form>

                        {/* Cart Icon */}
                        <button className="group relative p-2.5 rounded-full hover:bg-gray-100 transition-all duration-300 hover:scale-110 active:scale-95">
                            <ShoppingCart className="w-6 h-6 text-gray-700 group-hover:text-ub-navy transition-colors" />
                            <span className="absolute top-1.5 right-1.5 bg-ub-gold text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center border-2 border-white shadow-sm group-hover:bg-ub-navy transition-colors">
                                0
                            </span>
                        </button>

                        {/* User Icon */}
                        <button className="group relative p-2.5 rounded-full hover:bg-gray-100 transition-all duration-300 hover:scale-110 active:scale-95">
                            <User className="w-6 h-6 text-gray-700 group-hover:text-ub-navy transition-colors" />
                        </button>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="lg:hidden p-2.5 hover:bg-gray-100 rounded-xl transition-all duration-300 active:scale-95"
                    >
                        {isMenuOpen ? (
                            <X className="w-6 h-6 text-ub-navy" />
                        ) : (
                            <Menu className="w-6 h-6 text-gray-700" />
                        )}
                    </button>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className="lg:hidden py-4 space-y-4 animate-fade-in border-t border-gray-100 px-2">
                        {/* Mobile Search */}
                        <form onSubmit={handleSearch}>
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search products..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full px-4 py-2 pl-10 pr-4 rounded-full border border-gray-200 bg-gray-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-ub-navy/20 focus:border-ub-navy transition-all duration-300 text-black"
                                />
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            </div>
                        </form>

                        {/* Mobile Navigation Links */}
                        <div className="space-y-1">
                            <div className="space-y-1">
                                <div className="font-semibold text-gray-400 text-[10px] uppercase tracking-wider px-4 py-2">Merchandise</div>
                                {merchandiseCategories.map((category) => (
                                    <Link
                                        key={category.name}
                                        href={category.href}
                                        className="block px-8 py-2.5 text-gray-700 hover:bg-ub-gold/5 hover:text-ub-navy rounded-xl transition-all duration-200"
                                    >
                                        {category.name}
                                    </Link>
                                ))}
                            </div>

                            {[
                                { name: 'Services', href: '/services' },
                                { name: 'News', href: '/news' },
                                { name: 'About Us', href: '/about' },
                                { name: 'Contact', href: '/contact' },
                            ].map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    className="block px-4 py-2.5 text-gray-700 hover:bg-ub-gold/5 hover:text-ub-navy rounded-xl transition-all duration-200 font-medium"
                                >
                                    {link.name}
                                </Link>
                            ))}
                        </div>

                        {/* Mobile Icons */}
                        <div className="flex items-center justify-around pt-6 border-t border-gray-100">
                            <button className="group flex flex-col items-center space-y-1.5 transition-all active:scale-90">
                                <div className="relative p-2 rounded-xl group-hover:bg-ub-gold/10 transition-colors">
                                    <ShoppingCart className="w-6 h-6 text-gray-700 group-hover:text-ub-navy transition-colors" />
                                    <span className="absolute top-1 right-1 bg-ub-gold text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center border-2 border-white shadow-sm">
                                        0
                                    </span>
                                </div>
                                <span className="text-xs font-medium text-gray-600 group-hover:text-ub-navy">Cart</span>
                            </button>
                            <button className="group flex flex-col items-center space-y-1.5 transition-all active:scale-90">
                                <div className="p-2 rounded-xl group-hover:bg-ub-gold/10 transition-colors">
                                    <User className="w-6 h-6 text-gray-700 group-hover:text-ub-navy transition-colors" />
                                </div>
                                <span className="text-xs font-medium text-gray-600 group-hover:text-ub-navy">Profile</span>
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
}
