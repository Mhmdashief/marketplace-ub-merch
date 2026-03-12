'use client';

import { useCart } from './ShoppingCart';
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight, Zap, ShieldCheck } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface CartSheetProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function CartSheet({ isOpen, onClose }: CartSheetProps) {
    const { cart, removeFromCart, updateQuantity, totalPrice, isInitialized } = useCart();
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(price);
    };

    if (!isMounted) return null;

    return (
        <div className={`fixed inset-0 z-[100] transition-all duration-500 ${isOpen ? 'visible' : 'invisible pointer-events-none'}`}>
            {/* Ultra-pure Blur Backdrop */}
            <div
                className={`absolute inset-0 bg-black/20 backdrop-blur-md transition-opacity duration-500 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
                onClick={onClose}
            />

            {/* Premium Side Panel */}
            <div className={`absolute inset-y-0 right-0 w-full sm:w-[450px] bg-white shadow-[0_0_100px_rgba(0,0,0,0.1)] transition-transform duration-700 ease-[cubic-bezier(0.32,0,0.07,1)] ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="h-full flex flex-col relative">

                    {/* High-End Header */}
                    <div className="px-8 pt-10 pb-6 flex items-center justify-between">
                        <div className="flex flex-col">
                            <div className="flex items-center gap-3">
                                <h2 className="text-2xl font-black uppercase italic tracking-tighter text-black leading-none">
                                    Your Archive
                                </h2>
                                <div className="bg-black text-white text-[10px] font-black px-2.5 py-1 rounded-full flex items-center justify-center min-w-[24px]">
                                    {cart.length}
                                </div>
                            </div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mt-2">Personal Selection</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="group p-3 hover:bg-black rounded-full transition-all duration-300 active:scale-90"
                        >
                            <X className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
                        </button>
                    </div>

                    {/* Dynamic Items Section */}
                    <div className="flex-1 overflow-y-auto px-8 py-4 space-y-10 custom-scrollbar">
                        {!isInitialized ? (
                            <div className="h-full flex flex-col items-center justify-center">
                                <div className="w-8 h-8 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                            </div>
                        ) : cart.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-center px-4">
                                <div className="relative mb-8">
                                    <div className="w-24 h-24 bg-gray-50 rounded-[2.5rem] flex items-center justify-center scale-110 rotate-12 transition-transform hover:rotate-0 duration-700">
                                        <ShoppingBag className="w-10 h-10 text-gray-200" />
                                    </div>
                                    <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-ub-gold rounded-full flex items-center justify-center shadow-lg animate-bounce">
                                        <Zap className="w-5 h-5 text-white fill-current" />
                                    </div>
                                </div>
                                <h3 className="text-xl font-black text-black uppercase italic tracking-tight">Empty Selection</h3>
                                <p className="text-xs text-gray-400 mt-3 font-medium max-w-[200px] leading-relaxed">
                                    Your personal archive is currently empty. Explore our latest collections.
                                </p>
                                <button
                                    onClick={onClose}
                                    className="mt-10 px-10 py-4 bg-black text-white text-[10px] font-black uppercase tracking-[0.3em] rounded-full hover:bg-ub-navy transition-all shadow-xl shadow-black/5 active:scale-95"
                                >
                                    Browse Shop
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-8 pb-10">
                                {cart.map((item, index) => (
                                    <div
                                        key={`${item.id}-${item.size}`}
                                        className="flex gap-6 group animate-in slide-in-from-right-8 duration-500 fill-mode-both"
                                        style={{ animationDelay: `${index * 100}ms` }}
                                    >
                                        <div className="relative w-28 h-36 rounded-3xl overflow-hidden bg-[#F9F9F9] flex-shrink-0 group-hover:shadow-2xl transition-all duration-500">
                                            <Image
                                                src={item.image}
                                                alt={item.name}
                                                fill
                                                className="object-cover group-hover:scale-110 transition-transform duration-1000"
                                            />
                                            {item.size && (
                                                <div className="absolute bottom-3 left-3">
                                                    <span className="bg-white/90 backdrop-blur-md text-[9px] font-black px-2.5 py-1 rounded-lg shadow-sm border border-white/50 text-black uppercase tracking-wider">
                                                        {item.size}
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex-1 flex flex-col justify-between py-2">
                                            <div>
                                                <div className="flex justify-between items-start">
                                                    <h3 className="text-sm font-black text-black uppercase tracking-tight italic leading-tight group-hover:text-ub-navy transition-colors">
                                                        {item.name}
                                                    </h3>
                                                    <button
                                                        onClick={() => removeFromCart(item.id, item.size)}
                                                        className="p-1 text-gray-300 hover:text-rose-500 transition-all active:scale-90"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                                <div className="mt-2 flex items-center gap-2">
                                                    <span className="text-[10px] font-black text-ub-gold uppercase tracking-widest bg-ub-gold/5 px-2 py-0.5 rounded-md">
                                                        Authentic
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="flex items-end justify-between">
                                                <div className="flex flex-col gap-3">
                                                    <span className="text-sm font-black text-black italic">
                                                        {formatPrice(item.price)}
                                                    </span>
                                                    <div className="flex items-center bg-gray-50 rounded-xl p-1 border border-gray-100 w-fit">
                                                        <button
                                                            onClick={() => updateQuantity(item.id, item.quantity - 1, item.size)}
                                                            className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-black transition-colors"
                                                        >
                                                            <Minus className="w-3 h-3" />
                                                        </button>
                                                        <span className="w-8 text-center text-xs font-black text-black">{item.quantity}</span>
                                                        <button
                                                            onClick={() => updateQuantity(item.id, item.quantity + 1, item.size)}
                                                            className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-black transition-colors"
                                                        >
                                                            <Plus className="w-3 h-3" />
                                                        </button>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-[8px] font-black text-gray-300 uppercase tracking-widest mb-1">Subtotal</p>
                                                    <span className="text-lg font-black text-black italic tracking-tighter">
                                                        {formatPrice(item.price * item.quantity)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Premium Checkout Section */}
                    {cart.length > 0 && (
                        <div className="px-8 py-10 bg-white border-t border-gray-100 shadow-[0_-20px_50px_rgba(0,0,0,0.02)] space-y-6">

                            {/* Trust Info */}
                            <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-2xl mb-4">
                                <ShieldCheck className="w-4 h-4 text-ub-navy" />
                                <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">
                                    Secure Transaction & Originality Guaranteed
                                </span>
                            </div>

                            <div className="flex items-end justify-between">
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Total Valuation</span>
                                    <span className="text-3xl font-black text-black tracking-tighter italic leading-none">
                                        {formatPrice(totalPrice)}
                                    </span>
                                </div>
                            </div>

                            <div className="space-y-4 pt-4">
                                <Link
                                    href="/checkout"
                                    onClick={onClose}
                                    className="group w-full py-6 bg-black text-white text-[11px] font-black uppercase tracking-[0.3em] rounded-[2rem] flex items-center justify-center gap-4 hover:bg-ub-navy transition-all shadow-2xl shadow-black/10 active:scale-[0.98]"
                                >
                                    Proceed to Checkout
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </Link>
                                <button
                                    onClick={onClose}
                                    className="w-full py-4 text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-black transition-colors"
                                >
                                    Continue Acquisition
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <style>{`
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #eeeeee; border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #dddddd; }
            `}</style>
        </div>
    );
}
