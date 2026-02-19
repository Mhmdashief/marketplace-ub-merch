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
    Landmark,
    Wallet,
    Smartphone,
    CreditCard,
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

    const getPaymentConfig = (method: string) => {
        switch (method) {
            case "Bank Transfer":
                return { icon: Landmark, color: "text-blue-400", bg: "bg-blue-500/10" };
            case "GoPay":
                return { icon: Wallet, color: "text-emerald-400", bg: "bg-emerald-500/10" };
            case "Google Pay":
                return { icon: Smartphone, color: "text-white", bg: "bg-white/10" };
            case "Credit Card":
                return { icon: CreditCard, color: "text-amber-400", bg: "bg-amber-500/10" };
            default:
                return { icon: CreditCard, color: "text-gray-400", bg: "bg-white/5" };
        }
    };

    const paymentMethod = "Bank Transfer"; // Mock data
    const payment = getPaymentConfig(paymentMethod);
    const PaymentIcon = payment.icon;

    return (
        <div className="space-y-10 animate-fade-in py-2 pb-20">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b border-white/5 pb-10">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <Link href="/admin/orders" className="p-2 bg-white/5 hover:bg-ub-gold hover:text-white rounded-xl transition-all mr-2 border border-white/5">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                        <span className="text-[10px] font-black text-ub-gold uppercase tracking-[0.3em]">Transactions</span>
                    </div>
                    <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic">
                        Order <span className="text-white/10">/</span> {params.id}
                    </h1>
                </div>

                <div className="flex items-center gap-3">
                    <button className="inline-flex items-center gap-2 px-6 py-4 bg-white/5 hover:bg-white/10 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all border border-white/5">
                        <Printer className="h-4 w-4" />
                        Print Invoice
                    </button>
                    <button
                        onClick={() => setStatus("Delivered")}
                        className="inline-flex items-center gap-3 px-8 py-4 bg-ub-gold hover:bg-ub-gold/90 text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] transition-all duration-500 shadow-xl shadow-ub-gold/10 active:scale-95"
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
                    <div className="bg-[#001a33] rounded-[40px] shadow-2xl border border-white/5 p-8">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-sm font-black text-gray-500 uppercase tracking-[0.2em]">Purchase Details</h2>
                            <span className="text-[10px] font-black px-3 py-1 bg-ub-gold/10 text-ub-gold rounded-lg border border-ub-gold/20 uppercase tracking-widest">{orderItems.length} Products</span>
                        </div>

                        <div className="space-y-4">
                            {orderItems.map((item) => (
                                <div key={item.id} className="flex items-center justify-between p-6 bg-white/2 rounded-3xl border border-transparent hover:border-white/10 transition-all group">
                                    <div className="flex items-center gap-6">
                                        <div className="h-20 w-20 bg-black/40 rounded-2xl flex items-center justify-center border border-white/5 shadow-sm group-hover:rotate-2 transition-transform">
                                            <Box className="h-8 w-8 text-gray-700" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-black text-white uppercase italic group-hover:text-ub-gold transition-colors">{item.name}</p>
                                            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1">Size: {item.size} <span className="text-white/5 mx-2">|</span> Qty: {item.qty}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-black text-white font-mono">Rp {(item.price * item.qty).toLocaleString('id-ID')}</p>
                                        <p className="text-[10px] font-bold text-gray-500">@ Rp {item.price.toLocaleString('id-ID')}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Order Summary */}
                        <div className="mt-10 pt-10 border-t border-dashed border-white/10 space-y-4 px-4 font-mono">
                            <div className="flex justify-between text-[11px] font-bold text-gray-500 uppercase tracking-widest">
                                <span>Subtotal</span>
                                <span>Rp 420.000</span>
                            </div>
                            <div className="flex justify-between text-[11px] font-bold text-gray-500 uppercase tracking-widest">
                                <span>Shipping Fee (JNE Regular)</span>
                                <span>Rp 30.000</span>
                            </div>
                            <div className="flex justify-between items-center pt-4">
                                <span className="text-sm font-black text-ub-gold uppercase tracking-widest italic">Total Amount</span>
                                <span className="text-2xl font-black text-white">Rp 450.000</span>
                            </div>
                        </div>
                    </div>

                    {/* Refund Flow Section (Point 5) */}
                    <div className={`bg-[#001a33] rounded-[40px] shadow-2xl border border-white/5 p-8 relative overflow-hidden transition-all duration-500 ${isRefunding ? 'ring-2 ring-rose-500/50' : ''}`}>
                        <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/10 blur-3xl rounded-full -mr-16 -mt-16 opacity-50"></div>
                        <div className="flex items-center justify-between mb-8 relative z-10">
                            <div>
                                <h2 className="text-sm font-black text-gray-500 uppercase tracking-[0.2em]">Safety & Refund Policy</h2>
                                <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest mt-1">Manage return requests and payment reversals</p>
                            </div>
                            <RefreshCcw className={`h-5 w-5 ${isRefunding ? 'text-rose-500 animate-spin' : 'text-gray-700'}`} />
                        </div>

                        {!isRefunding ? (
                            <div className="p-6 bg-white/2 rounded-3xl border border-white/5 flex items-center justify-between group cursor-pointer hover:bg-rose-500/5 hover:border-rose-500/10 transition-all" onClick={() => setIsRefunding(true)}>
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-black/40 rounded-xl shadow-sm text-rose-500">
                                        <AlertCircle className="h-5 w-5" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[11px] font-black text-white uppercase tracking-widest group-hover:text-rose-400 transition-colors">Initiate Refund Flow</span>
                                        <span className="text-[9px] font-bold text-gray-600 uppercase italic">Start the formal process for returns or payment reversal.</span>
                                    </div>
                                </div>
                                <ChevronRight className="h-4 w-4 text-gray-700 group-hover:text-rose-500 group-hover:translate-x-1 transition-all" />
                            </div>
                        ) : (
                            <div className="space-y-6 animate-fade-in">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-white uppercase tracking-widest ml-1">Refund Reason</label>
                                    <select className="w-full px-6 py-4 bg-black/20 border border-white/5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-white focus:ring-2 focus:ring-rose-500 transition-all appearance-none cursor-pointer">
                                        <option className="bg-[#001a33]">PRODUCT DEFECT / DAMAGED</option>
                                        <option className="bg-[#001a33]">WRONG ITEM RECEIVED</option>
                                        <option className="bg-[#001a33]">SIZE MISMATCH</option>
                                        <option className="bg-[#001a33]">CUSTOMER CHANGE OF MIND</option>
                                    </select>
                                </div>
                                <div className="flex gap-3">
                                    <button onClick={() => setIsRefunding(false)} className="flex-1 py-4 bg-white/5 text-gray-500 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all">Cancel</button>
                                    <button className="flex-1 py-4 bg-rose-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-rose-600 shadow-xl shadow-rose-500/20 transition-all">Approve Refund</button>
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

                    {/* Payment Information */}
                    <div className="bg-[#001a33] rounded-[40px] shadow-2xl border border-white/5 p-8 space-y-6">
                        <h2 className="text-sm font-black text-gray-500 uppercase tracking-[0.2em]">Settlement Information</h2>
                        <div className="p-6 bg-white/2 rounded-3xl border border-white/5 flex items-center justify-between group">
                            <div className="flex items-center gap-4">
                                <div className={`p-3 rounded-xl shadow-sm ${payment.bg}`}>
                                    <PaymentIcon className={`h-5 w-5 ${payment.color}`} />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[11px] font-black text-white uppercase tracking-widest">{paymentMethod}</span>
                                    <span className="text-[9px] font-bold text-emerald-500 uppercase italic">Transaction Verified</span>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-sm font-black text-white font-mono">Rp 450.000</p>
                                <p className="text-[9px] font-bold text-gray-600 uppercase">Paid on Feb 13</p>
                            </div>
                        </div>
                    </div>

                    {/* Logistics Tracking (Point 4) */}
                    <div className="bg-[#001a33] rounded-[40px] shadow-2xl border border-white/5 p-8 space-y-6">
                        <h2 className="text-sm font-black text-gray-500 uppercase tracking-[0.2em] mb-4">Logistics Hub</h2>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-white uppercase tracking-widest ml-1">Master Tracking ID</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={trackingNumber}
                                        onChange={(e) => setTrackingNumber(e.target.value)}
                                        placeholder="ENTER AWB / TRACKING ID..."
                                        className="w-full px-6 py-4 bg-black/20 border border-white/5 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] focus:ring-2 focus:ring-ub-gold transition-all text-white"
                                    />
                                    <button className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/5 rounded-lg shadow-sm border border-white/5 hover:text-ub-gold transition-colors text-gray-600">
                                        <CheckCircle2 className="h-3 w-3" />
                                    </button>
                                </div>
                            </div>

                            <div className="pt-4 space-y-6">
                                {timeline.map((step, idx) => (
                                    <div key={idx} className="flex gap-4 group">
                                        <div className="flex flex-col items-center">
                                            <div className={`h-4 w-4 rounded-full border-2 ${step.status === 'completed' ? 'bg-ub-gold border-ub-gold' :
                                                step.status === 'current' ? 'bg-transparent border-ub-gold animate-pulse' :
                                                    'bg-transparent border-white/10'
                                                }`}></div>
                                            {idx !== timeline.length - 1 && <div className={`w-[1.5px] h-10 ${step.status === 'completed' ? 'bg-ub-gold' : 'bg-white/5'}`}></div>}
                                        </div>
                                        <div className="-mt-1">
                                            <p className={`text-[10px] font-black uppercase tracking-widest ${step.status === 'upcoming' ? 'text-gray-700' : 'text-white'}`}>{step.event}</p>
                                            <p className="text-[9px] font-bold text-gray-600 uppercase mt-0.5">{step.date}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Customer Profile */}
                    <div className="bg-[#001a33] rounded-[40px] shadow-2xl border border-white/5 p-8 space-y-8 group hover:shadow-ub-gold/5 transition-all duration-500">
                        <div className="flex items-center gap-4">
                            <div className="h-16 w-16 rounded-3xl bg-white/5 flex items-center justify-center border border-white/5 group-hover:scale-105 transition-transform">
                                <User className="h-8 w-8 text-gray-700 group-hover:text-ub-gold transition-colors" />
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-white tracking-tight uppercase italic transition-colors group-hover:text-ub-gold">Ahmad Fauzi</h3>
                                <div className="flex items-center gap-3 mt-1">
                                    <span className="text-[9px] font-black text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full uppercase tracking-widest border border-emerald-500/20">Verified Buyer</span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4 pt-6 border-t border-dashed border-white/10">
                            <div className="flex items-center gap-4 group/info">
                                <div className="p-2 bg-white/5 rounded-xl group-hover/info:bg-ub-gold/10 transition-colors border border-white/5">
                                    <Mail className="h-3 w-3 text-gray-600 group-hover/info:text-ub-gold" />
                                </div>
                                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">ahmad.f@example.com</span>
                            </div>
                            <div className="flex items-center gap-4 group/info">
                                <div className="p-2 bg-white/5 rounded-xl group-hover/info:bg-ub-gold/10 transition-colors border border-white/5">
                                    <Phone className="h-3 w-3 text-gray-600 group-hover/info:text-ub-gold" />
                                </div>
                                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">+62 812-3456-7890</span>
                            </div>
                            <div className="flex flex-col gap-2 group/info pt-2">
                                <div className="flex items-center gap-4">
                                    <div className="p-2 bg-white/5 rounded-xl group-hover/info:bg-ub-gold/10 transition-colors border border-white/5">
                                        <MapPin className="h-3 w-3 text-gray-600 group-hover/info:text-ub-gold" />
                                    </div>
                                    <span className="text-[10px] font-black text-white uppercase tracking-widest">Shipping Address</span>
                                </div>
                                <p className="pl-11 text-[10px] font-bold text-gray-600 uppercase tracking-widest leading-relaxed">
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
