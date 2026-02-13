'use client';

import { useState } from "react";
import { Package, ArrowLeft, Upload, X, Star, Zap, TrendingUp, ShieldCheck, Heart, Save } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function NewProductPage() {
    const router = useRouter();
    const [images, setImages] = useState<File[]>([]);
    const [showcaseLabels, setShowcaseLabels] = useState({
        featured: false,
        newArrival: false,
        bestSeller: false,
        exclusive: false,
        koleksiPilihan: false,
    });

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const filesArray = Array.from(e.target.files);
            setImages((prev) => [...prev, ...filesArray]);
        }
    };

    const removeImage = (index: number) => {
        setImages((prev) => prev.filter((_, i) => i !== index));
    };

    return (
        <div className="space-y-10 animate-fade-in py-2 pb-20">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b border-gray-100 pb-10">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <Link href="/admin/products" className="p-2 bg-gray-50 hover:bg-[#001a33] hover:text-white rounded-xl transition-all mr-2">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                        <span className="text-[10px] font-black text-ub-gold uppercase tracking-[0.3em]">Inventory</span>
                    </div>
                    <h1 className="text-4xl font-black text-[#001a33] tracking-tighter uppercase italic">
                        Add <span className="text-gray-200">/</span> New Product
                    </h1>
                </div>

                <button
                    type="button"
                    className="inline-flex items-center gap-3 px-8 py-4 bg-[#001a33] hover:bg-ub-gold text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] transition-all duration-500 shadow-xl shadow-blue-900/10 active:scale-95 group"
                >
                    <Save className="h-4 w-4" />
                    Publish Product
                </button>
            </div>

            <form className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                {/* Left Column - Product Details */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Basic Info */}
                    <div className="bg-white rounded-[40px] shadow-sm border border-gray-100 p-8 space-y-6">
                        <h2 className="text-sm font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Basic Information</h2>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-[#001a33] uppercase tracking-widest ml-1">Product Name</label>
                            <input
                                type="text"
                                placeholder="ENTER PRODUCT NAME EX: UB OFFICIAL HOODIE..."
                                className="w-full px-6 py-4 bg-gray-50 text-black border-none rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] focus:ring-2 focus:ring-[#001a33] transition-all"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-[#001a33] uppercase tracking-widest ml-1">Description</label>
                            <textarea
                                rows={6}
                                placeholder="WRITE A COMPELLING PRODUCT DESCRIPTION..."
                                className="w-full px-6 py-4 bg-gray-50 text-black border-none rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] focus:ring-2 focus:ring-[#001a33] transition-all resize-none"
                            ></textarea>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-[#001a33] uppercase tracking-widest ml-1">Category</label>
                                <select className="w-full px-6 py-4 bg-gray-50 text-black border-none rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] focus:ring-2 focus:ring-[#001a33] transition-all appearance-none cursor-pointer">
                                    <option>SELECT CATEGORY</option>
                                    <option>APPAREL</option>
                                    <option>ACCESSORIES</option>
                                    <option>DRINKWARE</option>
                                    <option>STATIONERY</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-[#001a33] uppercase tracking-widest ml-1">Stock Quantity</label>
                                <input
                                    type="number"
                                    placeholder="0"
                                    className="w-full px-6 py-4 bg-gray-50 text-black border-none rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] focus:ring-2 focus:ring-[#001a33] transition-all"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Pricing & Discounts */}
                    <div className="bg-white rounded-[40px] shadow-sm border border-gray-100 p-8 space-y-6 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 blur-3xl rounded-full -mr-16 -mt-16 group-hover:bg-emerald-100 transition-colors duration-500"></div>
                        <h2 className="text-sm font-black text-gray-400 uppercase tracking-[0.2em] mb-4 relative z-10">Pricing Strategy</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-[#001a33] uppercase tracking-widest ml-1">Regular Price (IDR)</label>
                                <div className="relative">
                                    <span className="absolute left-6 top-1/2 -translate-y-1/2 text-[10px] font-black text-black">Rp</span>
                                    <input
                                        type="number"
                                        placeholder="0"
                                        className="w-full pl-14 pr-6 text-black py-4 bg-gray-50 border-none rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] focus:ring-2 focus:ring-[#001a33] transition-all"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-[#001a33] uppercase tracking-widest ml-1">Discount Price (Optional)</label>
                                <div className="relative">
                                    <span className="absolute left-6 top-1/2 -translate-y-1/2 text-[10px] font-black text-black">Rp</span>
                                    <input
                                        type="number"
                                        placeholder="0"
                                        className="w-full pl-14 pr-6 py-4 bg-emerald-50/30 border-none rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] focus:ring-2 focus:ring-emerald-500 transition-all text-emerald-600 placeholder:text-emerald-300"
                                    />
                                </div>
                                <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest mt-1 ml-1">Leave empty if no discount applies.</p>
                            </div>
                        </div>
                    </div>

                    {/* Media Upload */}
                    <div className="bg-white rounded-[40px] shadow-sm border border-gray-100 p-8 space-y-6">
                        <h2 className="text-sm font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Product Assets</h2>

                        <div className="border-2 border-dashed border-gray-100 rounded-[32px] p-12 flex flex-col items-center justify-center hover:border-ub-navy hover:bg-gray-50 transition-all cursor-pointer relative group">
                            <input
                                type="file"
                                multiple
                                accept="image/*"
                                className="absolute inset-0 opacity-0 cursor-pointer"
                                onChange={handleImageChange}
                            />
                            <div className="p-4 bg-gray-50 group-hover:bg-white rounded-2xl mb-4 transition-colors">
                                <Upload className="h-8 w-8 text-gray-300 group-hover:text-ub-navy" />
                            </div>
                            <p className="text-[10px] font-black text-[#001a33] uppercase tracking-widest">Drag & Drop or Click to Upload</p>
                            <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest mt-2">Support PNG, JPG, WEBP (Max 5MB)</p>
                        </div>

                        {images.length > 0 && (
                            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-4 mt-6">
                                {images.map((file, idx) => (
                                    <div key={idx} className="relative aspect-square rounded-2xl overflow-hidden border border-gray-100 group">
                                        <img
                                            src={URL.createObjectURL(file)}
                                            alt="Preview"
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeImage(idx)}
                                            className="absolute top-2 right-2 p-1.5 bg-rose-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <X className="h-3 w-3" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Column - Labelling & Settings */}
                <div className="space-y-8">
                    {/* Collection Labelling */}
                    <div className="bg-[#001a33] rounded-[40px] shadow-2xl shadow-blue-900/20 p-8 border border-white/5 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-ub-gold/10 blur-3xl rounded-full -mr-16 -mt-16"></div>
                        <h2 className="text-sm font-black text-ub-gold uppercase tracking-[0.2em] mb-8 relative z-10">Showcase Labels</h2>

                        <div className="space-y-3 relative z-10">
                            <label className="flex items-center justify-between p-5 bg-white/5 hover:bg-white/10 rounded-2xl cursor-pointer transition-all border border-white/5 group">
                                <div className="flex items-center gap-4">
                                    <div className="p-2 bg-ub-gold/20 rounded-lg text-ub-gold">
                                        <Star className="h-4 w-4" />
                                    </div>
                                    <span className="text-[10px] font-black text-white uppercase tracking-widest">Featured Product</span>
                                </div>
                                <input
                                    type="checkbox"
                                    className="w-5 h-5 rounded-lg border-white/20 bg-transparent text-ub-gold focus:ring-ub-gold focus:ring-offset-0 transition-all cursor-pointer"
                                />
                            </label>

                            <label className="flex items-center justify-between p-5 bg-white/5 hover:bg-white/10 rounded-2xl cursor-pointer transition-all border border-white/5 group">
                                <div className="flex items-center gap-4">
                                    <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400">
                                        <Zap className="h-4 w-4" />
                                    </div>
                                    <span className="text-[10px] font-black text-white uppercase tracking-widest">New Arrivals</span>
                                </div>
                                <input
                                    type="checkbox"
                                    className="w-5 h-5 rounded-lg border-white/20 bg-transparent text-blue-400 focus:ring-blue-400 focus:ring-offset-0 transition-all cursor-pointer"
                                />
                            </label>

                            <label className="flex items-center justify-between p-5 bg-white/5 hover:bg-white/10 rounded-2xl cursor-pointer transition-all border border-white/5 group">
                                <div className="flex items-center gap-4">
                                    <div className="p-2 bg-emerald-500/20 rounded-lg text-emerald-400">
                                        <TrendingUp className="h-4 w-4" />
                                    </div>
                                    <span className="text-[10px] font-black text-white uppercase tracking-widest">Best Sellers</span>
                                </div>
                                <input
                                    type="checkbox"
                                    className="w-5 h-5 rounded-lg border-white/20 bg-transparent text-emerald-400 focus:ring-emerald-400 focus:ring-offset-0 transition-all cursor-pointer"
                                />
                            </label>

                            <label className="flex items-center justify-between p-5 bg-white/5 hover:bg-white/10 rounded-2xl cursor-pointer transition-all border border-white/5 group">
                                <div className="flex items-center gap-4">
                                    <div className="p-2 bg-purple-500/20 rounded-lg text-purple-400">
                                        <ShieldCheck className="h-4 w-4" />
                                    </div>
                                    <span className="text-[10px] font-black text-white uppercase tracking-widest">Exclusive Showcase</span>
                                </div>
                                <input
                                    type="checkbox"
                                    className="w-5 h-5 rounded-lg border-white/20 bg-transparent text-purple-400 focus:ring-purple-400 focus:ring-offset-0 transition-all cursor-pointer"
                                />
                            </label>

                            <label className="flex items-center justify-between p-5 bg-white/5 hover:bg-white/10 rounded-2xl cursor-pointer transition-all border border-white/5 group">
                                <div className="flex items-center gap-4">
                                    <div className="p-2 bg-rose-500/20 rounded-lg text-rose-400">
                                        <Heart className="h-4 w-4" />
                                    </div>
                                    <span className="text-[10px] font-black text-white uppercase tracking-widest">Koleksi Pilihan</span>
                                </div>
                                <input
                                    type="checkbox"
                                    className="w-5 h-5 rounded-lg border-white/20 bg-transparent text-rose-400 focus:ring-rose-400 focus:ring-offset-0 transition-all cursor-pointer"
                                />
                            </label>
                        </div>
                    </div>

                    {/* Meta Settings */}
                    <div className="bg-white rounded-[40px] shadow-sm border border-gray-100 p-8 space-y-6">
                        <h2 className="text-sm font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Availability</h2>

                        <div className="space-y-4">
                            <label className="flex items-center gap-3 cursor-pointer group">
                                <input
                                    type="checkbox"
                                    defaultChecked
                                    className="w-6 h-6 rounded-lg border-gray-200 text-[#001a33] focus:ring-[#001a33] focus:ring-offset-0 transition-all"
                                />
                                <div className="flex flex-col">
                                    <span className="text-[11px] font-black text-[#001a33] uppercase tracking-widest">Publish Immediately</span>
                                    <span className="text-[8px] font-bold text-gray-400 uppercase tracking-widest italic">Product will be visible to all users.</span>
                                </div>
                            </label>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}
