'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import {
    ChevronLeft,
    ShoppingCart,
    ArrowRight,
    CheckCircle2,
    MapPin,
    Plus,
    ChevronDown,
    UserCheck,
    X,
    Loader2,
    ShieldCheck,
} from 'lucide-react';
import { useCart } from '@/components/shared/ShoppingCart';
import { createOrder } from '@/app/actions/orders';
import { getUserAddresses } from '@/app/actions/addresses';
import AddressManager, { type SavedAddress } from '@/components/shared/AddressManager';
import { getProductById } from '@/app/actions/products';

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

// ─── XENDIT PAYMENT MODAL ─────────────────────────────────────────────────────
function XenditPaymentModal({
    invoiceUrl,
    orderCode,
    onClose,
    onPaymentSuccess,
}: {
    invoiceUrl: string;
    orderCode: string;
    onClose: () => void;
    onPaymentSuccess: () => void;
}) {
    const [isLoaded, setIsLoaded] = useState(false);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    // Poll tiap 5 detik untuk cek status pembayaran
    useEffect(() => {
        intervalRef.current = setInterval(async () => {
            try {
                const res = await fetch(`/api/xendit/check-status?orderCode=${orderCode}`);
                if (res.ok) {
                    const data = await res.json();
                    if (data.paymentStatus === 'PAID') {
                        if (intervalRef.current) clearInterval(intervalRef.current);
                        onPaymentSuccess();
                    }
                }
            } catch {
                // silent fail
            }
        }, 5000);

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [orderCode, onPaymentSuccess]);

    // Kunci scroll body saat modal terbuka
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = '';
        };
    }, []);

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            {/* Backdrop blur — klik untuk tutup */}
            <div
                className="absolute inset-0 bg-black/75 backdrop-blur-md"
                onClick={onClose}
            />

            {/* Modal container */}
            <div className="relative w-full max-w-lg h-[90vh] max-h-[820px] flex flex-col rounded-[2rem] overflow-hidden shadow-[0_40px_120px_rgba(0,0,0,0.6)] border border-white/10 animate-in zoom-in-95 duration-300">

                {/* Header */}
                <div className="flex-shrink-0 flex items-center justify-between bg-black px-6 py-4">
                    <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-ub-gold animate-pulse" />
                        <span className="text-[11px] font-black uppercase tracking-[0.25em] text-white">
                            Pembayaran Aman · Powered by Xendit
                        </span>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all active:scale-95"
                        title="Tutup"
                    >
                        <X className="w-4 h-4 text-white" />
                    </button>
                </div>

                {/* Loading spinner */}
                {!isLoaded && (
                    <div className="absolute inset-0 top-14 flex flex-col items-center justify-center gap-4 bg-[#FDFDFD] z-10">
                        <Loader2 className="w-10 h-10 text-black animate-spin" />
                        <p className="text-[11px] font-black uppercase tracking-widest text-gray-400">
                            Memuat halaman pembayaran...
                        </p>
                    </div>
                )}

                {/* Xendit iframe */}
                <iframe
                    src={invoiceUrl}
                    className="flex-1 w-full border-0 bg-white"
                    onLoad={() => setIsLoaded(true)}
                    allow="payment *; camera *; microphone *"
                    title="Xendit Payment"
                />

                {/* Footer */}
                <div className="flex-shrink-0 flex items-center justify-between bg-gray-50 border-t border-gray-100 px-6 py-3">
                    <div className="flex items-center gap-2">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                        <span className="text-[9px] font-bold uppercase tracking-widest text-gray-400">
                            SSL 256-bit · Transaksi Terenkripsi
                        </span>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-[9px] font-black uppercase tracking-widest text-gray-400 hover:text-black transition-colors"
                    >
                        Tutup
                    </button>
                </div>
            </div>
        </div>
    );
}
// ─────────────────────────────────────────────────────────────────────────────

export default function CheckoutClient() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { data: session } = useSession();
    const { cart, clearCart, isInitialized } = useCart();

    // ── Direct-purchase mode (from Buy Now on product page) ────────────────
    const directProductId = searchParams.get('directProductId');
    const directQty = parseInt(searchParams.get('qty') || '1', 10);
    const directSize = searchParams.get('size') || null;

    type DirectProduct = { id: string; name: string; price: number; image: string } | null;
    const [directProduct, setDirectProduct] = useState<DirectProduct>(null);
    const [directProductLoading, setDirectProductLoading] = useState(!!directProductId);

    useEffect(() => {
        if (!directProductId) return;
        setDirectProductLoading(true);
        getProductById(directProductId).then((p) => {
            if (p) {
                setDirectProduct({
                    id: p.id,
                    name: p.name,
                    price: Number(p.discountPrice ?? p.regularPrice),
                    image: p.images[0] ?? '/images/reusable/placeholder.png',
                });
            }
            setDirectProductLoading(false);
        });
    }, [directProductId]);

    const checkoutItems = directProductId && directProduct
        ? [{ id: directProduct.id, name: directProduct.name, price: directProduct.price, image: directProduct.image, quantity: directQty, size: directSize }]
        : cart;

    const checkoutTotal = checkoutItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
    // ──────────────────────────────────────────────────────────────────────

    const [isMounted, setIsMounted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submittingMessage, setSubmittingMessage] = useState('Memproses pesanan...');
    const [checkoutError, setCheckoutError] = useState<string | null>(null);
    const [isStaleCart, setIsStaleCart] = useState(false);

    // ── State untuk Xendit modal ───────────────────────────────────────────
    const [invoiceUrl, setInvoiceUrl] = useState<string | null>(null);
    const [activeOrderCode, setActiveOrderCode] = useState<string | null>(null);
    const [showPaymentModal, setShowPaymentModal] = useState(false);

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

    useEffect(() => {
        if (session?.user?.id) {
            getUserAddresses(session.user.id).then((res) => {
                if (res.success && res.addresses) {
                    setSavedAddresses(res.addresses);
                }
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [session]);

    const fillFromSession = () => {
        if (!session?.user) return;
        setFormData((prev) => ({
            ...prev,
            name: session.user?.name || '',
            email: session.user?.email || '',
        }));
    };

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

    // Callback saat pembayaran berhasil terdeteksi
    const handlePaymentSuccess = useCallback(() => {
        setShowPaymentModal(false);
        router.push('/orders');
    }, [router]);

    if (!isMounted || directProductLoading || !isInitialized) return null;

    // Guard: tidak ada item
    // Kita cek juga isSubmitting & showPaymentModal agar tidak "flash" empty screen 
    // saat cart baru saja dikosongkan setelah order berhasil dibuat.
    if (checkoutItems.length === 0 && !isSubmitting && !showPaymentModal && !checkoutError) {
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
    const finalTotal = checkoutTotal + shippingPrice;

    const selectedAddress = savedAddresses.find((a) => a.id === selectedAddressId);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmittingMessage('Memproses pesanan...');
        setCheckoutError(null);
        setIsStaleCart(false);

        const fullAddress = `${formData.address}${formData.notes ? ` (${formData.notes})` : ''}, ${formData.city}, ${formData.province}, ${formData.postalCode}`;

        // Step 1: Buat order
        const result = await createOrder({
            items: checkoutItems.map((item) => ({
                productId: item.id,
                quantity: item.quantity,
                size: item.size ?? null,
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

        if (!result.success) {
            setIsSubmitting(false);
            setCheckoutError(result.error ?? 'Terjadi kesalahan.');
            if ('staleCart' in result && result.staleCart) setIsStaleCart(true);
            return;
        }

        // Step 2: Bersihkan cart
        if (!directProductId) clearCart();

        // Step 3: Buat Xendit invoice → tampilkan modal langsung
        try {
            setSubmittingMessage('Menyiapkan pembayaran...');
            const invoiceRes = await fetch('/api/xendit/create-invoice', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ orderId: result.orderId }),
            });

            const invoiceData = await invoiceRes.json();

            if (!invoiceRes.ok) {
                throw new Error(invoiceData.error || 'Gagal membuat invoice pembayaran');
            }

            // Simpan invoice URL & order code → buka modal
            setInvoiceUrl(invoiceData.invoiceUrl);
            setActiveOrderCode(invoiceData.orderCode ?? result.orderCode);
            setIsSubmitting(false);
            setShowPaymentModal(true);
        } catch (err) {
            console.error('[checkout] Invoice creation failed:', err);
            setCheckoutError('Pesanan berhasil dibuat, namun gagal membuka pembayaran. Cek halaman Pesanan Saya.');
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <div className="min-h-screen bg-[#FDFDFD] pt-32 pb-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                    {/* ─── FORM ─── */}
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

                            {/* Error banner */}
                            {checkoutError && (
                                <div className="bg-rose-50 border border-rose-200 rounded-3xl p-6 flex flex-col sm:flex-row sm:items-center gap-4">
                                    <div className="flex-1">
                                        <p className="text-xs font-black text-rose-600 uppercase tracking-widest mb-1">Gagal Membuat Pesanan</p>
                                        <p className="text-sm text-rose-500 font-medium">{checkoutError}</p>
                                    </div>
                                    {isStaleCart && (
                                        <button
                                            type="button"
                                            onClick={() => { clearCart(); setCheckoutError(null); setIsStaleCart(false); }}
                                            className="flex-shrink-0 px-6 py-3 bg-rose-600 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-rose-700 transition-all active:scale-95"
                                        >
                                            Kosongkan Keranjang
                                        </button>
                                    )}
                                </div>
                            )}

                            <form id="checkout-form" onSubmit={handleSubmit} className="space-y-10">

                                {/* ── SECTION 1: Customer Info ── */}
                                <section className="space-y-8 p-10 bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.02)] border border-gray-100">
                                    <div className="flex items-center justify-between flex-wrap gap-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-black text-white flex items-center justify-center font-black text-sm italic">1</div>
                                            <h2 className="text-lg font-black text-black uppercase italic tracking-tight">Informasi Customer</h2>
                                        </div>
                                        {session?.user && (
                                            <button
                                                type="button"
                                                onClick={fillFromSession}
                                                className="flex items-center gap-2 px-5 py-2.5 bg-gray-50 text-[10px] font-black uppercase tracking-widest text-black rounded-2xl hover:bg-black hover:text-white transition-all border border-gray-100"
                                            >
                                                <UserCheck className="w-3.5 h-3.5" />
                                                Isi dari Akun Saya
                                            </button>
                                        )}
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 px-2">Nama Lengkap</label>
                                            <input
                                                required
                                                type="text"
                                                className="w-full px-6 py-5 bg-gray-50 border-transparent rounded-2xl text-black focus:bg-white focus:ring-4 focus:ring-black/5 focus:outline-none transition-all text-sm font-bold"
                                                placeholder="John Doe..."
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 px-2">Email (Invoice)</label>
                                            <input
                                                required
                                                type="email"
                                                className="w-full px-6 py-5 bg-gray-50 border-transparent text-black rounded-2xl focus:bg-white focus:ring-4 focus:ring-black/5 focus:outline-none transition-all text-sm font-bold"
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
                                                className="w-full px-6 py-5 bg-gray-50 border-transparent text-black rounded-2xl focus:bg-white focus:ring-4 focus:ring-black/5 focus:outline-none transition-all text-sm font-bold"
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
                                            <h2 className="text-lg font-black uppercase text-black italic tracking-tight">Alamat Pengiriman</h2>
                                        </div>
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
                                                className="w-full px-6 py-5 bg-gray-50 border-transparent rounded-2xl text-black focus:bg-white focus:ring-4 focus:ring-black/5 focus:outline-none transition-all text-sm font-bold"
                                                placeholder="John Doe..."
                                                value={formData.recipientName}
                                                onChange={(e) => setFormData({ ...formData, recipientName: e.target.value })}
                                            />
                                        </div>
                                        <div className="md:col-span-2 space-y-2">
                                            <label className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 px-2">Alamat Lengkap</label>
                                            <textarea
                                                required
                                                rows={2}
                                                className="w-full px-6 py-5 bg-gray-50 border-transparent text-black rounded-2xl focus:bg-white focus:ring-4 focus:ring-black/5 focus:outline-none transition-all text-sm font-bold resize-none"
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
                                                className="w-full px-6 py-5 bg-gray-50 border-transparent rounded-2xl text-black focus:bg-white focus:ring-4 focus:ring-black/5 focus:outline-none transition-all text-sm font-bold"
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
                                                className="w-full px-6 py-5 bg-gray-50 border-transparent text-black rounded-2xl focus:bg-white focus:ring-4 focus:ring-black/5 focus:outline-none transition-all text-sm font-bold"
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
                                                className="w-full px-6 py-5 bg-gray-50 border-transparent text-black rounded-2xl focus:bg-white focus:ring-4 focus:ring-black/5 focus:outline-none transition-all text-sm font-bold"
                                                placeholder="65145"
                                                value={formData.postalCode}
                                                onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 px-2">Catatan (Opsional)</label>
                                            <input
                                                type="text"
                                                className="w-full px-6 py-5 bg-gray-50 border-transparent text-black rounded-2xl focus:bg-white focus:ring-4 focus:ring-black/5 focus:outline-none transition-all text-sm font-bold"
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
                                        <h2 className="text-lg font-black text-black uppercase italic tracking-tight">Metode Pengiriman</h2>
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

                                <h3 className="text-xl font-black uppercase italic tracking-tighter mb-10 pb-6 border-b border-white/10 flex items-center gap-3">
                                    Order Registry
                                    {directProductId && (
                                        <span className="text-[9px] font-black uppercase tracking-widest bg-ub-gold text-black px-2 py-1 rounded-lg">Beli Langsung</span>
                                    )}
                                </h3>

                                <div className="space-y-8 mb-12 max-h-[380px] overflow-y-auto pr-2" style={{ scrollbarWidth: 'none' }}>
                                    {checkoutItems.map((item) => (
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
                                        <span className="text-white">{formatPrice(checkoutTotal)}</span>
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
                                        <div className="flex items-center gap-3">
                                            <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                                            <span className="text-[10px] font-black uppercase tracking-widest">{submittingMessage}</span>
                                        </div>
                                    ) : (
                                        <>
                                            Place Final Order
                                            <ArrowRight className="w-4 h-4" />
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ✅ Xendit Payment Modal — muncul langsung setelah order dibuat */}
            {showPaymentModal && invoiceUrl && activeOrderCode && (
                <XenditPaymentModal
                    invoiceUrl={invoiceUrl}
                    orderCode={activeOrderCode}
                    onClose={() => {
                        setShowPaymentModal(false);
                        // Jika user tutup modal, arahkan ke halaman orders
                        router.push(`/orders`);
                    }}
                    onPaymentSuccess={handlePaymentSuccess}
                />
            )}
        </>
    );
}
