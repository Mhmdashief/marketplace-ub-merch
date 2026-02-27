'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import {
    ChevronLeft,
    ShoppingCart,
    ArrowRight,
    CheckCircle2,
    Lock,
    MapPin,
    Plus,
    ChevronDown,
} from 'lucide-react';
import { useCart } from '@/components/shared/ShoppingCart';
import { createOrder } from '@/app/actions/orders';
import { getUserAddresses } from '@/app/actions/addresses';
import AddressManager, { type SavedAddress } from '@/components/shared/AddressManager';

const SHIPPING_METHODS = [
    {
        id: 'JNE',
        name: 'JNE Express',
        services: [
            { id: 'REG', name: 'Regular', price: 15000, desc: '2-3 hari kerja' },
            { id: 'YES', name: 'Yakin Esok Sampai', price: 30000, desc: '1 hari kerja' },
        ],
    },
    {
        id: 'J&T',
        name: 'J&T Express',
        services: [{ id: 'REG', name: 'EZ', price: 14000, desc: '2-4 hari kerja' }],
    },
    {
        id: 'SiCepat',
        name: 'SiCepat',
        services: [
            { id: 'REG', name: 'Regular', price: 14000, desc: '2-3 hari kerja' },
            { id: 'BEST', name: 'BEST', price: 25000, desc: '1 hari kerja' },
        ],
    },
];

export default function CheckoutClient() {
    const router = useRouter();
    const { data: session } = useSession();
    const { cart, totalPrice, clearCart } = useCart();

    const [isMounted, setIsMounted] = useState(false);
    const [checkoutStep, setCheckoutStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [createdOrderCode, setCreatedOrderCode] = useState<string | null>(null);

    // Saved addresses
    const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>([]);
    const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
    const [showAddressPicker, setShowAddressPicker] = useState(false);
    const [showAddressManager, setShowAddressManager] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        recipientName: '',
        address: '',
        city: '',
        province: '',
        postalCode: '',
        notes: '',
        courier: 'JNE',
        courierService: 'REG',
    });

    useEffect(() => {
        setIsMounted(true);
    }, []);

    // Load saved addresses when session is ready
    useEffect(() => {
        if (session?.user?.id) {
            getUserAddresses(session.user.id).then((res) => {
                if (res.success && res.addresses) {
                    setSavedAddresses(res.addresses);
                    // Auto-select default address and pre-fill form
                    const def = res.addresses.find((a) => a.isDefault);
                    if (def) {
                        applyAddress(def, false);
                    }
                }
            });
            // Pre-fill customer info from session
            setFormData((prev) => ({
                ...prev,
                name: session.user?.name || '',
                email: session.user?.email || '',
            }));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [session]);

    const applyAddress = (addr: SavedAddress, closePanel = true) => {
        setSelectedAddressId(addr.id);
        setFormData((prev) => ({
            ...prev,
            recipientName: addr.recipientName,
            phone: addr.phone,
            address: addr.address,
            city: addr.city,
            province: addr.province,
            postalCode: addr.postalCode,
        }));
        if (closePanel) setShowAddressPicker(false);
    };

    if (!isMounted) return null;

    if (cart.length === 0 && checkoutStep === 1) {
        return (
            <div className="min-h-screen pt-32 pb-20 px-4 flex flex-col items-center justify-center text-center">
                <div className="w-24 h-24 bg-gray-50 rounded-[2.5rem] flex items-center justify-center mb-8 rotate-12">
                    <ShoppingCart className="w-10 h-10 text-gray-200" />
                </div>
                <h1 className="text-3xl font-black uppercase italic tracking-tighter text-black mb-4">
                    Your Archive is Empty
                </h1>
                <p className="text-gray-500 mb-10 max-w-sm mx-auto">
                    Please add some items to your cart before proceeding to checkout.
                </p>
                <Link
                    href="/merchandise"
                    className="px-12 py-5 bg-black text-white text-[11px] font-black uppercase tracking-[0.3em] rounded-full hover:bg-ub-navy transition-all"
                >
                    Browse Collection
                </Link>
            </div>
        );
    }

    const formatPrice = (price: number) =>
        new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price);

    const currentCourier = SHIPPING_METHODS.find((m) => m.id === formData.courier);
    const currentService = currentCourier?.services.find((s) => s.id === formData.courierService);
    const shippingPrice = currentService?.price || 0;
    const finalTotal = totalPrice + shippingPrice;

    const selectedAddress = savedAddresses.find((a) => a.id === selectedAddressId);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        const fullAddress = `${formData.address}${formData.notes ? ` (${formData.notes})` : ''}, ${formData.city}, ${formData.province}, ${formData.postalCode}`;

        const result = await createOrder({
            items: cart.map((item) => ({
                productId: item.id,
                quantity: item.quantity,
                size: item.size,
            })),
            userId: session?.user?.id ?? null,
            customerName: formData.name,
            customerEmail: formData.email,
            customerPhone: formData.phone,
            address: fullAddress,
            shippingAmount: shippingPrice,
            courier: formData.courier,
            courierService: formData.courierService,
        });

        setIsSubmitting(false);
        if (result.success) {
            setCreatedOrderCode(result.orderCode ?? null);
            setCheckoutStep(2);
            clearCart();
        } else {
            alert(result.error);
        }
    };

    return (
        <div className="min-h-screen bg-[#FDFDFD] pt-32 pb-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {checkoutStep === 1 ? (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">

                        {/* ═══ LEFT: FORM ═══ */}
                        <div className="lg:col-span-8 space-y-12">
                            <div className="flex flex-col gap-4">
                                <Link
                                    href="/merchandise"
                                    className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-black transition-colors group"
                                >
                                    <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                                    Back to Archive
                                </Link>
                                <h1 className="text-5xl font-black text-black tracking-tighter uppercase italic">
                                    Checkout
                                </h1>
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.3em]">
                                    Finalize Your Acquisition
                                </p>
                            </div>

                            <form id="checkout-form" onSubmit={handleSubmit} className="space-y-10">

                                {/* ── SECTION 1: Customer Info ── */}
                                <section className="space-y-8 p-10 bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.02)] border border-gray-100">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-black text-white flex items-center justify-center font-black text-sm italic">1</div>
                                        <h2 className="text-lg font-black uppercase italic tracking-tight">Informasi Customer</h2>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 px-2">Nama Lengkap</label>
                                            <input
                                                required
                                                type="text"
                                                className="w-full px-6 py-5 bg-gray-50 border-transparent rounded-2xl focus:bg-white focus:ring-4 focus:ring-black/5 focus:outline-none transition-all text-sm font-bold"
                                                placeholder="Ahmad Syaifulloh"
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 px-2">Email (Invoice)</label>
                                            <input
                                                required
                                                type="email"
                                                className="w-full px-6 py-5 bg-gray-50 border-transparent rounded-2xl focus:bg-white focus:ring-4 focus:ring-black/5 focus:outline-none transition-all text-sm font-bold"
                                                placeholder="user@example.com"
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            />
                                        </div>
                                        <div className="md:col-span-2 space-y-2">
                                            <label className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 px-2">Nomor HP / WhatsApp</label>
                                            <input
                                                required
                                                type="tel"
                                                className="w-full px-6 py-5 bg-gray-50 border-transparent rounded-2xl focus:bg-white focus:ring-4 focus:ring-black/5 focus:outline-none transition-all text-sm font-bold"
                                                placeholder="081234567890"
                                                value={formData.phone}
                                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                </section>

                                {/* ── SECTION 2: Shipping Address ── */}
                                <section className="space-y-6 p-10 bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.02)] border border-gray-100">
                                    <div className="flex items-center justify-between flex-wrap gap-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-black text-white flex items-center justify-center font-black text-sm italic">2</div>
                                            <h2 className="text-lg font-black uppercase italic tracking-tight">Alamat Pengiriman</h2>
                                        </div>

                                        {/* Saved address picker trigger */}
                                        {savedAddresses.length > 0 && (
                                            <button
                                                type="button"
                                                onClick={() => setShowAddressPicker(!showAddressPicker)}
                                                className="flex items-center gap-2 px-5 py-2.5 bg-gray-50 text-[10px] font-black uppercase tracking-widest text-black rounded-2xl hover:bg-black hover:text-white transition-all border border-gray-100"
                                            >
                                                <MapPin className="w-3.5 h-3.5" />
                                                {selectedAddress ? selectedAddress.label : 'Pilih Alamat Tersimpan'}
                                                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showAddressPicker ? 'rotate-180' : ''}`} />
                                            </button>
                                        )}
                                    </div>

                                    {/* Saved address picker panel */}
                                    {showAddressPicker && (
                                        <div className="animate-in slide-in-from-top-2 duration-300">
                                            <div className="bg-gray-50 rounded-3xl p-6 border border-gray-100 space-y-4">
                                                <p className="text-[9px] font-black uppercase tracking-widest text-gray-400">
                                                    Pilih Salah Satu Alamat Tersimpan
                                                </p>
                                                <AddressManager
                                                    userId={session?.user?.id || ''}
                                                    initialAddresses={savedAddresses}
                                                    onSelect={(addr) => applyAddress(addr)}
                                                    selectedId={selectedAddressId || undefined}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setShowAddressPicker(false);
                                                        setShowAddressManager(true);
                                                    }}
                                                    className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-ub-gold hover:text-black transition-colors"
                                                >
                                                    <Plus className="w-3 h-3" />
                                                    Tambah Alamat Baru
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    {/* Add new address inline */}
                                    {showAddressManager && !showAddressPicker && (
                                        <div className="bg-gray-50 rounded-3xl p-6 border border-gray-100 animate-in slide-in-from-top-2 duration-300">
                                            <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-4">
                                                Tambah & Kelola Alamat
                                            </p>
                                            <AddressManager
                                                userId={session?.user?.id || ''}
                                                initialAddresses={savedAddresses}
                                                onSelect={(addr) => {
                                                    setSavedAddresses((prev) => {
                                                        const exists = prev.find((a) => a.id === addr.id);
                                                        if (exists) return prev;
                                                        return [...prev, addr];
                                                    });
                                                    applyAddress(addr);
                                                    setShowAddressManager(false);
                                                }}
                                            />
                                        </div>
                                    )}

                                    {/* Manual form fields */}
                                    {selectedAddressId && (
                                        <div className="bg-emerald-50 border border-emerald-100 rounded-2xl px-6 py-4 flex items-center gap-3">
                                            <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                                            <p className="text-[10px] font-black uppercase tracking-widest text-emerald-700">
                                                Menggunakan alamat tersimpan: {selectedAddress?.label} · {selectedAddress?.city}
                                            </p>
                                            <button
                                                type="button"
                                                onClick={() => setSelectedAddressId(null)}
                                                className="ml-auto text-[9px] font-black text-gray-400 hover:text-black uppercase tracking-widest"
                                            >
                                                Ubah Manual
                                            </button>
                                        </div>
                                    )}

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 px-2">Nama Penerima</label>
                                            <input
                                                required
                                                type="text"
                                                className="w-full px-6 py-5 bg-gray-50 border-transparent rounded-2xl focus:bg-white focus:ring-4 focus:ring-black/5 focus:outline-none transition-all text-sm font-bold"
                                                placeholder="Ahmad Syaifulloh"
                                                value={formData.recipientName}
                                                onChange={(e) => setFormData({ ...formData, recipientName: e.target.value })}
                                            />
                                        </div>
                                        <div className="md:col-span-2 space-y-2">
                                            <label className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 px-2">Alamat Lengkap</label>
                                            <textarea
                                                required
                                                rows={2}
                                                className="w-full px-6 py-5 bg-gray-50 border-transparent rounded-2xl focus:bg-white focus:ring-4 focus:ring-black/5 focus:outline-none transition-all text-sm font-bold resize-none"
                                                placeholder="Jl. Veteran No. 10, RT 01/RW 02"
                                                value={formData.address}
                                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 px-2">Kota / Kabupaten</label>
                                            <input
                                                required
                                                type="text"
                                                className="w-full px-6 py-5 bg-gray-50 border-transparent rounded-2xl focus:bg-white focus:ring-4 focus:ring-black/5 focus:outline-none transition-all text-sm font-bold"
                                                placeholder="Kota Malang"
                                                value={formData.city}
                                                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 px-2">Provinsi</label>
                                            <input
                                                required
                                                type="text"
                                                className="w-full px-6 py-5 bg-gray-50 border-transparent rounded-2xl focus:bg-white focus:ring-4 focus:ring-black/5 focus:outline-none transition-all text-sm font-bold"
                                                placeholder="Jawa Timur"
                                                value={formData.province}
                                                onChange={(e) => setFormData({ ...formData, province: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 px-2">Kode Pos</label>
                                            <input
                                                required
                                                type="text"
                                                className="w-full px-6 py-5 bg-gray-50 border-transparent rounded-2xl focus:bg-white focus:ring-4 focus:ring-black/5 focus:outline-none transition-all text-sm font-bold"
                                                placeholder="65145"
                                                value={formData.postalCode}
                                                onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 px-2">Catatan (Opsional)</label>
                                            <input
                                                type="text"
                                                className="w-full px-6 py-5 bg-gray-50 border-transparent rounded-2xl focus:bg-white focus:ring-4 focus:ring-black/5 focus:outline-none transition-all text-sm font-bold"
                                                placeholder="Pagar warna hitam"
                                                value={formData.notes}
                                                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                </section>

                                {/* ── SECTION 3: Shipping Method ── */}
                                <section className="space-y-8 p-10 bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.02)] border border-gray-100">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-black text-white flex items-center justify-center font-black text-sm italic">3</div>
                                        <h2 className="text-lg font-black uppercase italic tracking-tight">Metode Pengiriman</h2>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        {SHIPPING_METHODS.map((m) => (
                                            <button
                                                key={m.id}
                                                type="button"
                                                onClick={() => {
                                                    setFormData({ ...formData, courier: m.id, courierService: m.services[0].id });
                                                }}
                                                className={`py-6 rounded-3xl border-2 transition-all font-black text-[11px] uppercase tracking-widest ${formData.courier === m.id
                                                    ? 'bg-black text-white border-black shadow-xl'
                                                    : 'bg-white text-gray-400 border-gray-100 hover:border-gray-300'
                                                    }`}
                                            >
                                                {m.name}
                                            </button>
                                        ))}
                                    </div>

                                    <div className="space-y-4">
                                        {currentCourier?.services.map((s) => (
                                            <button
                                                key={s.id}
                                                type="button"
                                                onClick={() => setFormData({ ...formData, courierService: s.id })}
                                                className={`w-full p-8 rounded-[2rem] border-2 flex items-center justify-between transition-all ${formData.courierService === s.id
                                                    ? 'bg-white border-black ring-8 ring-black/5'
                                                    : 'bg-gray-50 border-transparent hover:bg-gray-100'
                                                    }`}
                                            >
                                                <div className="text-left">
                                                    <p className={`text-sm font-black uppercase tracking-widest ${formData.courierService === s.id ? 'text-black' : 'text-gray-600'}`}>
                                                        {s.name}
                                                    </p>
                                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight mt-1">{s.desc}</p>
                                                </div>
                                                <div className={`text-lg font-black italic ${formData.courierService === s.id ? 'text-black' : 'text-gray-400'}`}>
                                                    {formatPrice(s.price)}
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </section>
                            </form>
                        </div>

                        {/* ═══ RIGHT: ORDER SUMMARY ═══ */}
                        <div className="lg:col-span-4 sticky top-32 space-y-8">
                            <div className="bg-black text-white p-10 rounded-[3rem] shadow-2xl relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-ub-gold/20 blur-3xl -mr-16 -mt-16 rounded-full" />

                                <h3 className="text-xl font-black uppercase italic tracking-tighter mb-10 pb-6 border-b border-white/10">
                                    Order Registry
                                </h3>

                                <div className="space-y-8 mb-12 max-h-[380px] overflow-y-auto pr-2" style={{ scrollbarWidth: 'none' }}>
                                    {cart.map((item) => (
                                        <div key={`${item.id}-${item.size}`} className="flex gap-6 group">
                                            <div className="relative w-20 h-24 rounded-2xl overflow-hidden bg-white/5 flex-shrink-0">
                                                <Image src={item.image} alt={item.name} fill className="object-cover" />
                                            </div>
                                            <div className="flex-1 flex flex-col justify-center">
                                                <h4 className="text-[11px] font-black uppercase tracking-tight leading-snug group-hover:text-ub-gold transition-colors">
                                                    {item.name}
                                                </h4>
                                                <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-2">
                                                    {item.size && `Size: ${item.size} · `}Qty: {item.quantity}
                                                </p>
                                                <p className="text-[11px] font-bold text-white mt-2">{formatPrice(item.price * item.quantity)}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="space-y-6 pt-6 border-t border-white/10">
                                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-gray-400">
                                        <span>Merchandise</span>
                                        <span className="text-white">{formatPrice(totalPrice)}</span>
                                    </div>
                                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-gray-400">
                                        <span>Ongkir ({formData.courier})</span>
                                        <span className="text-white">{formatPrice(shippingPrice)}</span>
                                    </div>
                                    <div className="pt-6 border-t border-white/20">
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-black text-ub-gold uppercase tracking-widest leading-none mb-2">
                                                Total Payable
                                            </span>
                                            <span className="text-3xl font-black text-white italic tracking-tighter leading-none">
                                                {formatPrice(finalTotal)}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    form="checkout-form"
                                    disabled={isSubmitting}
                                    className="w-full py-6 mt-12 bg-ub-gold text-black text-[11px] font-black uppercase tracking-[0.3em] rounded-[2rem] hover:bg-white hover:scale-[1.02] transition-all flex items-center justify-center gap-4 active:scale-[0.98] disabled:opacity-50"
                                >
                                    {isSubmitting ? (
                                        <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                                    ) : (
                                        <>
                                            Place Final Order
                                            <ArrowRight className="w-4 h-4" />
                                        </>
                                    )}
                                </button>
                            </div>

                            <div className="p-8 bg-gray-50 rounded-[2rem] border border-gray-100 flex items-center gap-6">
                                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                                    <Lock className="w-6 h-6 text-emerald-500" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase text-black tracking-widest">Secure Handshake</p>
                                    <p className="text-[9px] text-gray-400 font-bold uppercase tracking-tight mt-1">
                                        End-to-end encrypted order processing
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    /* ═══ SUCCESS SCREEN ═══ */
                    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center space-y-10 animate-in zoom-in-95 duration-1000">
                        <div className="w-40 h-40 bg-emerald-50 rounded-full flex items-center justify-center ring-[16px] ring-emerald-50/50">
                            <CheckCircle2 className="w-20 h-20 text-emerald-500" />
                        </div>
                        <div className="space-y-6">
                            <h2 className="text-6xl font-black text-black tracking-tighter uppercase italic">Registry Complete</h2>
                            <p className="text-[12px] font-black text-ub-gold uppercase tracking-[0.4em]">
                                Order Reference: {createdOrderCode}
                            </p>
                            <p className="text-xl text-gray-500 font-medium max-w-lg mx-auto leading-relaxed border-l-4 border-emerald-100 pl-8">
                                Pesanan Anda telah berhasil dicatat. Tahap berikutnya adalah integrasi payment gateway.
                            </p>
                        </div>
                        <div className="pt-12 flex flex-col sm:flex-row gap-6 w-full max-w-lg">
                            <button
                                type="button"
                                onClick={() => router.push('/orders')}
                                className="flex-1 py-7 bg-black text-white text-[11px] font-black uppercase tracking-[0.3em] rounded-[2rem] shadow-2xl hover:bg-ub-navy transition-all active:scale-[0.98]"
                            >
                                View My Orders
                            </button>
                            <button
                                type="button"
                                onClick={() => router.push('/merchandise')}
                                className="flex-1 py-7 bg-gray-50 text-black text-[11px] font-black uppercase tracking-[0.3em] rounded-[2rem] hover:bg-gray-100 transition-all active:scale-[0.98]"
                            >
                                Back to Archive
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
