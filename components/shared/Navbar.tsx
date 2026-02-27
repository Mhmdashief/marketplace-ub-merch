'use client';

import { Search, ShoppingCart, User, Menu, X, ChevronDown, LogOut, Settings, Package, UserPlus } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSession, signOut } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { useCart } from './ShoppingCart';
import CartSheet from './CartSheet';

export default function Navbar() {
    // 1. SEMUA HOOKS HARUS DI PALING ATAS
    const { data: session, status } = useSession();
    const pathname = usePathname();
    const { cart, isCartOpen, setIsCartOpen } = useCart();

    // State hooks
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isMerchandiseOpen, setIsMerchandiseOpen] = useState(false);
    const [isMobileMerchOpen, setIsMobileMerchOpen] = useState(false);
    const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

    // Ref hooks
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const userDropdownRef = useRef<HTMLDivElement>(null);

    // Effect hooks
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (userDropdownRef.current && !userDropdownRef.current.contains(event.target as Node)) {
                setIsUserDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // 2. LOGIKA CONDITIONAL RETURN (Halaman Auth/Admin tidak pakai Navbar ini)
    const isAuthPage = pathname?.startsWith('/auth');
    const isAdminPage = pathname?.startsWith('/admin');

    if (isAuthPage || isAdminPage) return null;

    // 3. LOGIKA HANDLERS
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

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Searching for:', searchQuery);
    };

    const handleLogout = async () => {
        await signOut({ callbackUrl: '/' });
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
        { name: 'Topi', slug: 'topi' }
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

                    {/* Desktop Navigation */}
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

                        <button
                            onClick={() => setIsCartOpen(true)}
                            className="group relative p-2.5 rounded-full hover:bg-gray-100 transition-all duration-300 hover:scale-110 active:scale-95"
                        >
                            <ShoppingCart className="w-6 h-6 text-gray-700 group-hover:text-ub-navy transition-colors" />
                            {cart.length > 0 && (
                                <span className="absolute top-1.5 right-1.5 bg-ub-gold text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center border-2 border-white shadow-sm group-hover:bg-ub-navy transition-colors">
                                    {cart.length}
                                </span>
                            )}
                        </button>

                        {status === 'loading' ? (
                            <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse"></div>
                        ) : session ? (
                            <div className="relative" ref={userDropdownRef}>
                                <button
                                    onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                                    className="group relative p-2.5 rounded-full hover:bg-gray-100 transition-all duration-300 hover:scale-110 active:scale-95 flex items-center space-x-2"
                                >
                                    {session.user?.image ? (
                                        <Image
                                            src={session.user.image}
                                            alt={session.user.name || 'User'}
                                            width={24}
                                            height={24}
                                            className="rounded-full"
                                        />
                                    ) : (
                                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-ub-navy to-ub-gold flex items-center justify-center">
                                            <span className="text-white text-xs font-bold">
                                                {session.user?.name?.charAt(0).toUpperCase() || 'U'}
                                            </span>
                                        </div>
                                    )}
                                </button>

                                {isUserDropdownOpen && (
                                    <div className="absolute right-0 mt-4 w-72 bg-white rounded-3xl shadow-[0_20px_70px_rgba(0,0,0,0.15)] border border-gray-100 overflow-hidden animate-in slide-in-from-top-4 duration-300 z-50">
                                        {/* Dropdown Header */}
                                        <div className="p-6 bg-gray-50/50 border-b border-gray-100">
                                            <p className="text-sm font-black text-black uppercase tracking-tight truncate">
                                                {session.user?.name || 'User Profile'}
                                            </p>
                                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest truncate mt-1">
                                                {session.user?.email}
                                            </p>
                                        </div>

                                        {/* Menu Items */}
                                        <div className="p-2">
                                            {[
                                                { icon: User, label: 'My Profile', href: '/profile' },
                                                { icon: Package, label: 'My Orders', href: '/orders' },
                                            ].map((item) => (
                                                <Link
                                                    key={item.label}
                                                    href={item.href}
                                                    onClick={() => setIsUserDropdownOpen(false)}
                                                    className="flex items-center space-x-3 px-4 py-3 text-gray-600 hover:bg-gray-50 hover:text-black rounded-2xl transition-all duration-200 group"
                                                >
                                                    <div className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center group-hover:bg-white group-hover:shadow-sm transition-all duration-300">
                                                        <item.icon className="w-4 h-4" />
                                                    </div>
                                                    <span className="text-[11px] font-black uppercase tracking-widest">{item.label}</span>
                                                </Link>
                                            ))}
                                        </div>

                                        {/* Logout Section */}
                                        <div className="p-2 border-t border-gray-100 bg-gray-50/30">
                                            <button
                                                onClick={handleLogout}
                                                className="flex items-center space-x-3 w-full px-4 py-3 text-red-500 hover:bg-red-50 rounded-2xl transition-all duration-200 group"
                                            >
                                                <div className="w-8 h-8 rounded-xl bg-red-50 flex items-center justify-center group-hover:bg-white group-hover:shadow-sm transition-all duration-300">
                                                    <LogOut className="w-4 h-4" />
                                                </div>
                                                <span className="text-[11px] font-black uppercase tracking-widest">Logout</span>
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="flex items-center space-x-3">
                                <Link href="/auth/login" className="px-5 py-2 bg-ub-navy text-white rounded-full hover:bg-ub-navy/90 transition-all duration-300 font-medium text-sm shadow-md hover:shadow-lg hover:-translate-y-0.5">
                                    Login
                                </Link>
                                <Link href="/auth/register" className="px-5 py-2 bg-ub-navy text-white rounded-full hover:bg-ub-navy/90 transition-all duration-300 font-medium text-sm shadow-md hover:shadow-lg hover:-translate-y-0.5">
                                    Register
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile Navigation Icons */}
                    <div className="flex lg:hidden items-center space-x-1">
                        <button
                            onClick={() => setIsCartOpen(true)}
                            className="relative p-2.5 rounded-full hover:bg-gray-100 transition-all active:scale-95"
                        >
                            <ShoppingCart className="w-6 h-6 text-gray-700" />
                            {cart.length > 0 && (
                                <span className="absolute top-1.5 right-1.5 bg-ub-gold text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center border-2 border-white shadow-sm">
                                    {cart.length}
                                </span>
                            )}
                        </button>

                        <div className="p-1">
                            {session ? (
                                <Link href="/profile" className="flex items-center">
                                    {session.user?.image ? (
                                        <Image
                                            src={session.user.image}
                                            alt="User"
                                            width={32}
                                            height={32}
                                            className="rounded-full border-2 border-white shadow-sm"
                                        />
                                    ) : (
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-ub-navy to-ub-gold flex items-center justify-center shadow-sm">
                                            <span className="text-white text-xs font-bold">
                                                {session.user?.name?.charAt(0).toUpperCase() || 'U'}
                                            </span>
                                        </div>
                                    )}
                                </Link>
                            ) : (
                                <Link href="/auth/login" className="p-2.5 rounded-full hover:bg-gray-100 transition-all active:scale-95 flex items-center justify-center">
                                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center border border-gray-200">
                                        <User className="w-4 h-4 text-gray-500" />
                                    </div>
                                </Link>
                            )}
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
                    <div className="lg:hidden py-4 space-y-4 animate-fade-in border-t border-gray-100 px-2">
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

                        <div className="space-y-1">
                            <button
                                onClick={() => setIsMobileMerchOpen(!isMobileMerchOpen)}
                                className="w-full flex items-center justify-between px-4 py-2.5 text-left text-gray-700 hover:bg-ub-gold/5 rounded-xl transition-all duration-200 group"
                            >
                                <span className="font-semibold text-gray-500 text-[10px] uppercase tracking-wider">Merchandise</span>
                                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${isMobileMerchOpen ? 'rotate-180 text-ub-navy' : ''}`} />
                            </button>

                            <div className={`space-y-1 pl-4 overflow-hidden transition-all duration-300 ${isMobileMerchOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
                                {merchandiseCategories.map((category) => (
                                    <Link
                                        key={category.name}
                                        href={category.href}
                                        className="block px-4 py-2 text-sm text-gray-600 hover:text-ub-navy hover:bg-gray-50 rounded-lg transition-all duration-200 border-l-2 border-transparent hover:border-ub-gold"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        {category.name}
                                    </Link>
                                ))}
                                <Link href="/merchandise" className="block px-4 py-2 text-xs font-bold text-ub-navy hover:underline mt-2" onClick={() => setIsMenuOpen(false)}>
                                    View All Collection →
                                </Link>
                            </div>

                            {['Services', 'News', 'About Us', 'Contact'].map((item) => (
                                <Link
                                    key={item}
                                    href={`/${item.toLowerCase().replace(' ', '')}`}
                                    className="block px-4 py-2.5 text-gray-700 hover:bg-ub-gold/5 hover:text-ub-navy rounded-xl transition-all duration-200 font-medium"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    {item}
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>
            <CartSheet isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
        </nav>
    );
}