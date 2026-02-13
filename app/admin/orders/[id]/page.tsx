'use client';

import {
    ArrowLeft,
    Truck,
    User,
    MapPin,
    ChevronRight,
    Printer,
    Mail,
    Phone,
    CheckCircle2,
    Clock,
    AlertCircle,
    RefreshCcw,
    ShieldCheck,
    Box,
    XCircle,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function OrderDetailPage({ params }: { params: { id: string } }) {
    const [status, setStatus] = useState("Shipped");
    const [trackingNumber, setTrackingNumber] = useState("UB-TRK-77821");
    const [isRefunding, setIsRefunding] = useState(false);

    const orderItems = [
        { id: 1, name: "UB Official Navy Hoodie", size: "L", qty: 1, price: 250000, image: null },
        { id: 2, name: "Premium UB Tote Bag", size: "One Size", qty: 2, price: 85000, image: null },
    ];

    const timeline = [
        { date: "13 Feb 2024, 14:20", event: "Order Paid", status: "completed" },
        { date: "13 Feb 2024, 16:45", event: "Order Processed", status: "completed" },
        { date: "14 Feb 2024, 09:12", event: "Shipped via JNE", status: "completed" },
        { date: "Pending", event: "In Transit", status: "current" },
        { date: "Pending", event: "Delivered", status: "upcoming" },
    ];

    return (
        <div className="space-y-10 animate-fade-in py-2 pb-20 text-black">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b border-gray-100 pb-10">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <Link href="/admin/orders" className="p-2 bg-gray-50 hover:bg-[#001a33] hover:text-white rounded-xl transition-all mr-2">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                        <span className="text-[10px] font-black text-ub-gold uppercase tracking-[0.3em]">Transactions</span>
                    </div>
                    <h1 className="text-4xl font-black text-[#001a33] tracking-tighter uppercase italic">
                        Order <span className="text-gray-200">/</span> {params.id}
                    </h1>
                </div>

                <div className="flex items-center gap-3">
                    <button className="inline-flex items-center gap-2 px-6 py-4 bg-gray-50 hover:bg-gray-100 text-[#001a33] rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all border border-gray-100">
                        <Printer className="h-4 w-4" />
                        Print Invoice
                    </button>
                    <button
                        onClick={() => setStatus("Delivered")}
                        className="inline-flex items-center gap-3 px-8 py-4 bg-[#001a33] hover:bg-ub-gold text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] transition-all duration-500 shadow-xl shadow-blue-900/10 active:scale-95"
                    >
                        <ShieldCheck className="h-4 w-4" />
                        Mark as Delivered
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                {/* Left Column - Order Items & Payment */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Items List */}
                    <div className="bg-white rounded-[40px] shadow-sm border border-gray-100 p-8">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-sm font-black text-gray-400 uppercase tracking-[0.2em]">Purchase Details</h2>
                            <span className="text-[10px] font-black px-3 py-1 bg-blue-50 text-blue-500 rounded-lg border border-blue-100 uppercase tracking-widest">{orderItems.length} Products</span>
                        </div>

                        <div className="space-y-4">
                            {orderItems.map((item) => (
                                <div key={item.id} className="flex items-center justify-between p-6 bg-gray-50/50 rounded-3xl border border-transparent hover:border-gray-100 transition-all group">
                                    <div className="flex items-center gap-6">
                                        <div className="h-20 w-20 bg-white rounded-2xl flex items-center justify-center border border-gray-100 shadow-sm group-hover:rotate-2 transition-transform">
                                            <Box className="h-8 w-8 text-gray-200" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-black text-[#001a33] uppercase italic">{item.name}</p>
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Size: {item.size} <span className="text-gray-200 mx-2">|</span> Qty: {item.qty}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-black text-[#001a33]">Rp {(item.price * item.qty).toLocaleString('id-ID')}</p>
                                        <p className="text-[10px] font-bold text-gray-400">@ Rp {item.price.toLocaleString('id-ID')}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Order Summary */}
                        <div className="mt-10 pt-10 border-t border-dashed border-gray-100 space-y-4 px-4">
                            <div className="flex justify-between text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                                <span>Subtotal</span>
                                <span>Rp 420.000</span>
                            </div>
                            <div className="flex justify-between text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                                <span>Shipping Fee (JNE Regular)</span>
                                <span>Rp 30.000</span>
                            </div>
                            <div className="flex justify-between items-center pt-4">
                                <span className="text-sm font-black text-[#001a33] uppercase tracking-widest italic">Total Amount</span>
                                <span className="text-2xl font-black text-[#001a33]">Rp 450.000</span>
                            </div>
                        </div>
                    </div>

                    {/* Refund Flow Section (Point 5) */}
                    <div className={`bg-white rounded-[40px] shadow-sm border border-gray-100 p-8 relative overflow-hidden transition-all duration-500 ${isRefunding ? 'ring-2 ring-rose-500' : ''}`}>
                        <div className="absolute top-0 right-0 w-32 h-32 bg-rose-50 blur-3xl rounded-full -mr-16 -mt-16 opacity-50"></div>
                        <div className="flex items-center justify-between mb-8 relative z-10">
                            <div>
                                <h2 className="text-sm font-black text-[#001a33] uppercase tracking-[0.2em]">Safety & Refund Policy</h2>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Manage return requests and payment reversals</p>
                            </div>
                            <RefreshCcw className={`h-5 w-5 ${isRefunding ? 'text-rose-500 animate-spin' : 'text-gray-300'}`} />
                        </div>

                        {!isRefunding ? (
                            <div className="p-6 bg-gray-50/50 rounded-3xl border border-gray-100 flex items-center justify-between group cursor-pointer hover:bg-rose-50 hover:border-rose-100 transition-all" onClick={() => setIsRefunding(true)}>
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-white rounded-xl shadow-sm text-rose-500">
                                        <AlertCircle className="h-5 w-5" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[11px] font-black text-[#001a33] uppercase tracking-widest group-hover:text-rose-600 transition-colors">Initiate Refund Flow</span>
                                        <span className="text-[9px] font-bold text-gray-400 uppercase italic">Start the formal process for returns or payment reversal.</span>
                                    </div>
                                </div>
                                <ChevronRight className="h-4 w-4 text-gray-300 group-hover:text-rose-500 group-hover:translate-x-1 transition-all" />
                            </div>
                        ) : (
                            <div className="space-y-6 animate-fade-in">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-[#001a33] uppercase tracking-widest ml-1">Refund Reason</label>
                                    <select className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] focus:ring-2 focus:ring-rose-500 transition-all appearance-none cursor-pointer">
                                        <option>PRODUCT DEFECT / DAMAGED</option>
                                        <option>WRONG ITEM RECEIVED</option>
                                        <option>SIZE MISMATCH</option>
                                        <option>CUSTOMER CHANGE OF MIND</option>
                                    </select>
                                </div>
                                <div className="flex gap-3">
                                    <button onClick={() => setIsRefunding(false)} className="flex-1 py-4 bg-gray-50 text-gray-400 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-gray-100 transition-all">Cancel</button>
                                    <button className="flex-1 py-4 bg-rose-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-rose-600 shadow-lg shadow-rose-200 transition-all">Approve Refund</button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Column - Status, Customer & Logistics */}
                <div className="space-y-8">
                    {/* Status Workflow (Point 1) */}
                    <div className="bg-[#001a33] rounded-[40px] shadow-2xl shadow-blue-900/20 p-8 border border-white/5 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-ub-gold/10 blur-3xl rounded-full -mr-16 -mt-16"></div>
                        <h2 className="text-sm font-black text-ub-gold uppercase tracking-[0.2em] mb-8 relative z-10 font-black">Lifecycle Control</h2>

                        <div className="space-y-4 relative z-10">
                            <div className="flex flex-col gap-1">
                                <span className="text-[9px] font-black text-gray-400 uppercase tracking-[0.3em]">Operational Status</span>
                                <div className="flex items-center gap-3 mt-1">
                                    <div className="h-3 w-3 rounded-full bg-blue-500 animate-pulse shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
                                    <span className="text-lg font-black text-white italic tracking-tighter uppercase">{status}</span>
                                </div>
                            </div>

                            <div className="pt-6 border-t border-white/5 space-y-3">
                                <button onClick={() => setStatus("Processing")} className="w-full py-4 px-6 bg-white/5 hover:bg-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white transition-all border border-white/5 text-left flex justify-between items-center group">
                                    <div className="flex items-center gap-3">
                                        <Clock className="h-4 w-4 text-gray-400" />
                                        Process Order
                                    </div>
                                    <ChevronRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-all transform group-hover:translate-x-1" />
                                </button>
                                <button onClick={() => setStatus("Shipped")} className="w-full py-4 px-6 bg-white/5 hover:bg-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white transition-all border border-white/5 text-left flex justify-between items-center group">
                                    <div className="flex items-center gap-3">
                                        <Truck className="h-4 w-4 text-gray-400" />
                                        Update Shipping
                                    </div>
                                    <ChevronRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-all transform group-hover:translate-x-1" />
                                </button>
                                <button onClick={() => setStatus("Cancelled")} className="w-full py-4 px-6 bg-white/5 hover:bg-rose-500/20 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white transition-all border border-white/5 hover:border-rose-500/50 text-left flex justify-between items-center group">
                                    <div className="flex items-center gap-3">
                                        <XCircle className="h-4 w-4 text-rose-500" />
                                        Cancel Transaction
                                    </div>
                                    <ChevronRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-all transform group-hover:translate-x-1" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Logistics Tracking (Point 4) */}
                    <div className="bg-white rounded-[40px] shadow-sm border border-gray-100 p-8 space-y-6">
                        <h2 className="text-sm font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Logistics Hub</h2>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-[#001a33] uppercase tracking-widest ml-1 text-black">Master Tracking ID</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={trackingNumber}
                                        onChange={(e) => setTrackingNumber(e.target.value)}
                                        placeholder="ENTER AWB / TRACKING ID..."
                                        className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] focus:ring-2 focus:ring-[#001a33] transition-all text-black border-2 border-transparent focus:border-gray-100"
                                    />
                                    <button className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white rounded-lg shadow-sm border border-gray-100 hover:text-blue-500 transition-colors">
                                        <CheckCircle2 className="h-3 w-3" />
                                    </button>
                                </div>
                            </div>

                            <div className="pt-4 space-y-6">
                                {timeline.map((step, idx) => (
                                    <div key={idx} className="flex gap-4 group">
                                        <div className="flex flex-col items-center">
                                            <div className={`h-4 w-4 rounded-full border-2 ${step.status === 'completed' ? 'bg-blue-500 border-blue-500' :
                                                step.status === 'current' ? 'bg-white border-blue-500 animate-pulse' :
                                                    'bg-white border-gray-200'
                                                }`}></div>
                                            {idx !== timeline.length - 1 && <div className={`w-[1.5px] h-10 ${step.status === 'completed' ? 'bg-blue-500' : 'bg-gray-100'}`}></div>}
                                        </div>
                                        <div className="-mt-1">
                                            <p className={`text-[10px] font-black uppercase tracking-widest ${step.status === 'upcoming' ? 'text-gray-300' : 'text-[#001a33]'}`}>{step.event}</p>
                                            <p className="text-[9px] font-bold text-gray-400 uppercase mt-0.5">{step.date}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Customer Profile */}
                    <div className="bg-white rounded-[40px] shadow-sm border border-gray-100 p-8 space-y-8 group hover:shadow-xl hover:shadow-blue-900/5 transition-all duration-500">
                        <div className="flex items-center gap-4">
                            <div className="h-16 w-16 rounded-3xl bg-gray-50 flex items-center justify-center border border-gray-100 group-hover:scale-105 transition-transform">
                                <User className="h-8 w-8 text-gray-200 group-hover:text-ub-navy transition-colors" />
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-[#001a33] tracking-tight uppercase italic transition-colors">Ahmad Fauzi</h3>
                                <div className="flex items-center gap-3 mt-1">
                                    <span className="text-[9px] font-black text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-full uppercase tracking-widest">Verified Buyer</span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4 pt-6 border-t border-dashed border-gray-100">
                            <div className="flex items-center gap-4 group/info">
                                <div className="p-2 bg-gray-50 rounded-xl group-hover/info:bg-blue-50 transition-colors">
                                    <Mail className="h-3 w-3 text-gray-400 group-hover/info:text-blue-500" />
                                </div>
                                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">ahmad.f@example.com</span>
                            </div>
                            <div className="flex items-center gap-4 group/info">
                                <div className="p-2 bg-gray-50 rounded-xl group-hover/info:bg-blue-50 transition-colors">
                                    <Phone className="h-3 w-3 text-gray-400 group-hover/info:text-blue-500" />
                                </div>
                                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">+62 812-3456-7890</span>
                            </div>
                            <div className="flex flex-col gap-2 group/info pt-2">
                                <div className="flex items-center gap-4">
                                    <div className="p-2 bg-gray-50 rounded-xl group-hover/info:bg-blue-50 transition-colors text-black">
                                        <MapPin className="h-3 w-3 text-gray-400 group-hover/info:text-blue-500" />
                                    </div>
                                    <span className="text-[10px] font-black text-[#001a33] uppercase tracking-widest">Shipping Address</span>
                                </div>
                                <p className="pl-11 text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-relaxed">
                                    Jl. Veteran No. 12, Ketawanggede, Lowokwaru, Kota Malang, Jawa Timur 65145 Indonesia
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
