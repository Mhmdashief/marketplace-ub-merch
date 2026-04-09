'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
    User,
    Shield,
    Calendar,
    Camera,
    Pencil,
    X,
    CheckCircle2,
    Mail,
    Lock,
    Eye,
    EyeOff,
    ShoppingBag,
    AlertCircle,
    Loader2,
    ChevronRight,
    Heart,
    ArrowRight
} from 'lucide-react';
import { getUserProfile, updateUserProfile, changeUserPassword, updateUserAvatar, softDeleteAccount } from '@/app/actions/profile';
import { getUserWishlists } from '@/app/actions/wishlist/wishlist';
import { getUserActivities } from '@/app/actions/activity/activity';

type UserProfile = {
    id: string;
    name: string;
    email: string;
    image: string | null;
    role: string;
    createdAt: Date;
    _count: { wishlists: number; clickTrackings: number };
};

type ActiveTab = 'account' | 'activity' | 'wishlist' | 'security';

export default function ProfileClient() {
    const { data: session, status, update: updateSession } = useSession();
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [wishlists, setWishlists] = useState<any[]>([]);
    const [activities, setActivities] = useState<any[]>([]);
    const [activeTab, setActiveTab] = useState<ActiveTab>('account');

    // Edit profile state
    const [isEditingName, setIsEditingName] = useState(false);
    const [editName, setEditName] = useState('');
    const [isSavingName, setIsSavingName] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [nameError, setNameError] = useState('');

    // Change password state
    const [pwForm, setPwForm] = useState({ current: '', newPw: '', confirm: '' });
    const [showPw, setShowPw] = useState({ current: false, new: false, confirm: false });
    const [isSavingPw, setIsSavingPw] = useState(false);
    const [pwError, setPwError] = useState('');
    const [pwSuccess, setPwSuccess] = useState(false);

    // Delete account state
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/auth/login');
            return;
        }
        if (status === 'authenticated' && session?.user?.id) {
            loadData();
        }
    }, [status, session?.user?.id]);

    const loadData = async () => {
        const userId = session!.user!.id;
        const [profileRes, wishlistRes, activityRes] = await Promise.all([
            getUserProfile(userId),
            getUserWishlists(userId),
            getUserActivities(userId),
        ]);
        
        if (profileRes.success && profileRes.user) {
            setProfile(profileRes.user as unknown as UserProfile);
            setEditName(profileRes.user.name);
        }
        if (wishlistRes.success && wishlistRes.wishlists) {
            setWishlists(wishlistRes.wishlists);
        }
        if (activityRes.success && activityRes.activities) {
            setActivities(activityRes.activities);
        }
    };

    const handleSaveName = async () => {
        if (!editName.trim()) { setNameError('Nama tidak boleh kosong'); return; }
        setIsSavingName(true);
        setNameError('');
        const result = await updateUserProfile(session!.user!.id, { name: editName.trim() });
        if (result.success && result.user) {
            setProfile((prev) => prev ? { ...prev, name: result.user!.name } : prev);
            await updateSession({ name: result.user.name });
            setIsEditingName(false);
        } else {
            setNameError(result.error || 'Gagal mengupdate nama');
        }
        setIsSavingName(false);
    };

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        const formData = new FormData();
        formData.append('image', file);

        const result = await updateUserAvatar(session!.user!.id, formData);
        if (result.success && result.image) {
            setProfile((prev) => prev ? { ...prev, image: result.image! } : prev);
            await updateSession({ image: result.image });
        } else {
            alert(result.error || 'Gagal mengupload foto');
        }
        setIsUploading(false);
    };

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setPwError('');
        setPwSuccess(false);

        if (pwForm.newPw.length < 8) {
            setPwError('Password baru minimal 8 karakter');
            return;
        }
        if (pwForm.newPw !== pwForm.confirm) {
            setPwError('Konfirmasi password tidak cocok');
            return;
        }

        setIsSavingPw(true);
        const result = await changeUserPassword(session!.user!.id, {
            currentPassword: pwForm.current,
            newPassword: pwForm.newPw,
        });

        if (result.success) {
            setPwSuccess(true);
            setPwForm({ current: '', newPw: '', confirm: '' });
        } else {
            setPwError(result.error || 'Gagal mengubah password');
        }
        setIsSavingPw(false);
    };

    const handleDeleteAccount = async () => {
        setIsDeleting(true);
        const result = await softDeleteAccount(session!.user!.id);
        if (result.success) {
            await signOut({ callbackUrl: '/' });
        } else {
            alert(result.error || 'Gagal menonaktifkan akun');
        }
        setIsDeleting(false);
    };

    if (status === 'loading' || !profile) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 border-4 border-ub-gold/20 border-t-ub-gold rounded-full animate-spin" />
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Loading Registry...</p>
                </div>
            </div>
        );
    }

    const tabs: { id: ActiveTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
        { id: 'account', label: 'Profil Saya', icon: User },
        { id: 'activity', label: 'Aktivitas Saya', icon: Eye },
        { id: 'wishlist', label: 'Wishlist / Favorit', icon: Heart },
        { id: 'security', label: 'Keamanan Akun', icon: Lock },
    ];

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(price);
    };

    return (
        <div className="min-h-screen bg-[#FAFAFA] pb-24">
            {/* ─── PREMIUM HERO HEADER ─── */}
            <div className="relative pt-32 pb-48 bg-white border-b border-gray-100 overflow-hidden">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-ub-gold/5 blur-[120px] rounded-full -mr-48 -mt-48" />
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-ub-navy/5 blur-[100px] rounded-full -ml-32 -mb-32" />
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />

                <div className="max-w-6xl mx-auto px-6 relative z-10">
                    <div className="flex flex-col lg:flex-row items-center lg:items-end gap-10 lg:gap-16">
                        {/* Avatar Section */}
                        <div className="relative group">
                            <div className="w-48 h-48 sm:w-56 sm:h-56 lg:w-64 lg:h-64 rounded-full bg-white p-2 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.15)] ring-1 ring-gray-100 relative">
                                <div className="w-full h-full rounded-full bg-gray-50 flex items-center justify-center relative overflow-hidden">
                                    {profile.image ? (
                                        <Image src={profile.image} alt={profile.name} fill className="object-cover" />
                                    ) : (
                                        <div className="w-full h-full bg-gradient-to-br from-ub-navy to-black flex items-center justify-center text-white text-7xl font-black italic">
                                            {profile.name.charAt(0).toUpperCase()}
                                        </div>
                                    )}

                                    <button
                                        onClick={() => fileInputRef.current?.click()}
                                        className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col items-center justify-center gap-2 text-white"
                                    >
                                        <Camera className="w-8 h-8 text-ub-gold" />
                                        <span className="text-[10px] font-black uppercase tracking-widest">Update Photo</span>
                                    </button>

                                    {isUploading && (
                                        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center">
                                            <Loader2 className="w-10 h-10 text-ub-gold animate-spin" />
                                        </div>
                                    )}
                                </div>
                            </div>
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                accept="image/*"
                                onChange={handleImageChange}
                            />
                        </div>

                        {/* Identity Section */}
                        <div className="flex-1 text-center lg:text-left space-y-6">
                            <div className="space-y-3">
                                <div className="flex items-center justify-center lg:justify-start gap-4">
                                    <div className="px-4 py-1.5 bg-black text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-full flex items-center gap-2">
                                        <Shield className="w-3.5 h-3.5 text-ub-gold" />
                                        {profile.role}
                                    </div>
                                    <div className="px-3 py-1.5 bg-gray-100 text-gray-500 text-[10px] font-black uppercase tracking-[0.2em] rounded-full border border-gray-200/50">
                                        ID: {profile.id.substring(0, 8).toUpperCase()}
                                    </div>
                                </div>

                                {isEditingName ? (
                                    <div className="flex items-center justify-center lg:justify-start gap-3">
                                        <input
                                            autoFocus
                                            value={editName}
                                            onChange={(e) => setEditName(e.target.value)}
                                            onKeyDown={(e) => { if (e.key === 'Enter') handleSaveName(); if (e.key === 'Escape') setIsEditingName(false); }}
                                            className="text-4xl lg:text-6xl font-black text-black uppercase italic tracking-tighter bg-transparent border-b-4 border-ub-gold focus:outline-none px-1 w-full max-w-xl"
                                        />
                                        <button onClick={handleSaveName} disabled={isSavingName}
                                            className="p-4 bg-black text-white rounded-2xl hover:bg-ub-navy transition-all shadow-xl disabled:opacity-50">
                                            {isSavingName ? <Loader2 className="w-6 h-6 animate-spin" /> : <Mail className="w-6 h-6" />}
                                        </button>
                                        <button onClick={() => setIsEditingName(false)}
                                            className="p-4 bg-white border border-gray-200 rounded-2xl text-gray-400 hover:bg-gray-50">
                                            <X className="w-6 h-6" />
                                        </button>
                                    </div>
                                ) : (
                                    <div className="group/name relative inline-flex items-center justify-center lg:justify-start gap-6">
                                        <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black text-black uppercase italic tracking-tighter leading-tight">
                                            {profile.name}
                                        </h1>
                                        <button
                                            onClick={() => setIsEditingName(true)}
                                            className="w-12 h-12 rounded-2xl bg-white border border-gray-100 shadow-sm flex items-center justify-center text-gray-300 hover:text-ub-gold hover:border-ub-gold hover:shadow-xl hover:scale-110 transition-all duration-500"
                                        >
                                            <Pencil className="w-5 h-5" />
                                        </button>
                                    </div>
                                )}
                            </div>

                            <p className="text-gray-400 font-bold text-xs sm:text-sm uppercase tracking-[0.4em] flex items-center justify-center lg:justify-start gap-3">
                                <span className="w-2.5 h-2.5 rounded-full bg-ub-gold shadow-[0_0_15px_rgba(196,173,119,0.8)]" />
                                {profile.email}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* ─── MAIN CONTENT ─── */}
            <div className="max-w-6xl mx-auto px-6 -mt-24 relative z-20">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* Sidebar / Stats */}
                    <div className="lg:col-span-4 space-y-6">
                        {/* Stats Card */}
                        <div className="bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.03)] border border-gray-100 p-10 overflow-hidden relative">
                            <div className="absolute top-0 right-0 p-8">
                                <ShoppingBag className="w-12 h-12 text-gray-50 opacity-10" />
                            </div>

                            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-600 mb-10">Account Overview</h3>

                            <div className="space-y-10">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-1">
                                        <p className="text-3xl font-black text-black italic leading-none">{profile._count.clickTrackings}</p>
                                        <p className="text-[8px] font-black uppercase tracking-widest text-gray-600">Total Produk Diklik</p>
                                    </div>
                                    <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center">
                                        <Eye className="w-5 h-5 text-black" />
                                    </div>
                                </div>
                                <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                                    <div className="space-y-1">
                                        <p className="text-xl font-black text-black italic leading-none">{profile._count.wishlists}</p>
                                        <p className="text-[8px] font-black uppercase tracking-widest text-gray-600">Wishlist Count</p>
                                    </div>
                                    <div className="w-12 h-12 rounded-2xl bg-rose-50 flex items-center justify-center">
                                        <Heart className="w-5 h-5 text-rose-500" />
                                    </div>
                                </div>
                                <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                                    <div className="space-y-1">
                                        <p className="text-xl font-black text-black italic leading-none">{new Date(profile.createdAt).getFullYear()}</p>
                                        <p className="text-[8px] font-black uppercase tracking-widest text-gray-600">Member Since</p>
                                    </div>
                                    <div className="w-12 h-12 rounded-2xl bg-ub-gold/10 flex items-center justify-center">
                                        <Calendar className="w-5 h-5 text-ub-gold" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Navigation Menu */}
                        <div className="bg-black rounded-[2.5rem] p-4 shadow-2xl">
                            <div className="space-y-2">
                                {tabs.map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`w-full flex items-center justify-between p-5 rounded-[1.8rem] transition-all group ${activeTab === tab.id
                                            ? 'bg-ub-gold text-black shadow-xl shadow-ub-gold/20'
                                            : 'text-gray-400 hover:text-white hover:bg-white/5'
                                            }`}
                                    >
                                        <div className="flex items-center gap-4">
                                            <tab.icon className={`w-5 h-5 ${activeTab === tab.id ? 'text-black' : 'text-gray-500'}`} />
                                            <span className="text-[10px] font-black uppercase tracking-widest">{tab.label}</span>
                                        </div>
                                        <ChevronRight className={`w-4 h-4 transition-transform group-hover:translate-x-1 ${activeTab === tab.id ? 'text-black' : 'text-gray-700'}`} />
                                    </button>
                                ))}
                                <button
                                    onClick={() => signOut({ callbackUrl: '/' })}
                                    className="w-full flex items-center gap-4 p-5 rounded-[1.8rem] text-rose-500 hover:bg-rose-500/10 transition-all text-[10px] font-black uppercase tracking-widest"
                                >
                                    <AlertCircle className="w-5 h-5" />
                                    Sign Out
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Tab Content */}
                    <div className="lg:col-span-8">
                        <div className="bg-white rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.03)] border border-gray-100 p-8 sm:p-12 min-h-[600px]">

                            {activeTab === 'account' && (
                                <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-xl font-black text-black">Registry Details</h3>
                                        <div className="w-12 h-1 bg-ub-gold rounded-full" />
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                                        {[
                                            { label: 'Display Name', value: profile.name, icon: User },
                                            { label: 'Official Email', value: profile.email, icon: Mail, verified: true },
                                            { label: 'Authentication', value: 'Google / OAuth', icon: Shield },
                                            { label: 'Account Tier', value: profile.role, icon: Shield, highlight: true },
                                        ].map((field) => (
                                            <div key={field.label} className="group pb-6 border-b border-gray-50 flex items-start gap-4">
                                                <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-black group-hover:bg-black group-hover:text-white transition-all">
                                                    <field.icon className="w-5 h-5" />
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-[9px] font-black uppercase tracking-widest text-gray-600">{field.label}</p>
                                                    <p className={`text-sm font-bold truncate ${field.highlight ? 'text-ub-gold' : 'text-black'}`}>
                                                        {field.value}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {activeTab === 'activity' && (
                                <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-xl font-black text-gray-600 tracking-widest uppercase italic">Aktivitas Saya</h3>
                                        <div className="w-12 h-1 bg-ub-gold rounded-full" />
                                    </div>
                                    
                                    <div className="bg-gray-50 rounded-3xl p-6 md:p-8 space-y-6 border border-gray-100">
                                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Produk Dilihat Terakhir</h4>
                                        {activities.length > 0 ? (
                                            <div className="space-y-4">
                                                {activities.map((act) => (
                                                    <Link href={`/merchandise/${act.product.slug}`} key={act.id} className="group flex items-center justify-between p-5 bg-white rounded-2xl hover:bg-black transition-all border border-transparent shadow-sm hover:shadow-2xl">
                                                        <div className="flex items-center gap-4">
                                                            <div className="p-3 bg-gray-50 text-gray-400 rounded-xl group-hover:bg-white/10 group-hover:text-ub-gold transition-colors">
                                                                <ShoppingBag className="w-5 h-5" />
                                                            </div>
                                                            <div className="font-bold text-sm text-black group-hover:text-white transition-colors">{act.product.name}</div>
                                                        </div>
                                                        <div className="flex items-center gap-3">
                                                            <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-white transition-colors" />
                                                            <span className="text-[10px] font-black uppercase tracking-widest text-ub-gold bg-ub-gold/10 group-hover:bg-white/10 px-4 py-2 rounded-full transition-colors">{act.platform}</span>
                                                        </div>
                                                    </Link>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-sm font-medium text-gray-400 bg-white p-6 rounded-2xl border border-gray-100 text-center">
                                                Belum ada aktivitas klik menuju marketplace.
                                            </p>
                                        )}
                                    </div>
                                </div>
                            )}

                            {activeTab === 'wishlist' && (
                                <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-xl font-black text-gray-600 tracking-widest uppercase italic">Wishlist / Favorit</h3>
                                        <div className="w-12 h-1 bg-ub-gold rounded-full" />
                                    </div>
                                    
                                    {wishlists.length > 0 ? (
                                        <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
                                            {wishlists.map((w) => (
                                                <Link key={w.id} href={`/merchandise/${w.product.slug}`} className="group relative flex flex-col bg-white border border-gray-100 rounded-[2rem] overflow-hidden hover:shadow-2xl hover:border-transparent transition-all duration-500">
                                                    <div className="aspect-[4/5] relative bg-gray-50">
                                                        <Image
                                                            src={w.product.assets?.[0]?.url || '/images/reusable/placeholder.png'}
                                                            alt={w.product.name}
                                                            fill
                                                            className="object-cover group-hover:scale-105 transition duration-700"
                                                        />
                                                    </div>
                                                    <div className="p-5 flex-1 flex flex-col justify-between">
                                                        <h4 className="font-bold text-xs leading-tight mb-2 line-clamp-2 text-black group-hover:text-ub-gold transition-colors">{w.product.name}</h4>
                                                        <div className="text-black font-black italic text-sm mt-auto">
                                                            {formatPrice(w.product.discountPrice ?? w.product.regularPrice)}
                                                        </div>
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-20 bg-gray-50 rounded-3xl border border-gray-100">
                                            <Heart className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                                            <p className="text-gray-400 text-sm font-medium">Belum ada wishlist tersimpan. Tambahkan produk favoritmu!</p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {activeTab === 'security' && (
                                <div className="space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-600">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="text-xl font-black text-black tracking-widest uppercase italic">Security Protocol</h3>
                                            <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-1">Manage encryption and access credentials</p>
                                        </div>
                                        <div className="w-12 h-1 bg-ub-gold rounded-full" />
                                    </div>

                                    <div className="max-w-md mx-auto py-4">
                                        <form onSubmit={handleChangePassword} className="space-y-8">
                                            {pwSuccess && (
                                                <div className="flex items-center gap-4 bg-emerald-50 text-emerald-700 p-6 rounded-[2rem] text-[10px] font-black uppercase tracking-widest border border-emerald-100 animate-in zoom-in-95 duration-300">
                                                    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
                                                        <Mail className="w-5 h-5 text-emerald-500" />
                                                    </div>
                                                    <span>Security cleared. Password updated.</span>
                                                </div>
                                            )}
                                            {pwError && (
                                                <div className="flex items-center gap-4 bg-rose-50 text-rose-700 p-6 rounded-[2rem] text-[10px] font-black uppercase tracking-widest border border-rose-100 animate-in zoom-in-95 duration-300">
                                                    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
                                                        <AlertCircle className="w-5 h-5 text-rose-500" />
                                                    </div>
                                                    <span>{pwError}</span>
                                                </div>
                                            )}

                                            <div className="space-y-6">
                                                {[
                                                    { key: 'current', label: 'Current Password', show: showPw.current },
                                                    { key: 'newPw', label: 'New Password', show: showPw.new },
                                                    { key: 'confirm', label: 'Confirm New', show: showPw.confirm },
                                                ].map((field) => (
                                                    <div key={field.key} className="space-y-3">
                                                        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 px-2">{field.label}</label>
                                                        <div className="relative group">
                                                            <div className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-black transition-colors">
                                                                <Lock className="w-4 h-4" />
                                                            </div>
                                                            <input
                                                                required
                                                                type={field.show ? 'text' : 'password'}
                                                                value={pwForm[field.key as keyof typeof pwForm]}
                                                                onChange={(e) => setPwForm({ ...pwForm, [field.key]: e.target.value })}
                                                                className="w-full pl-14 pr-16 py-5 bg-gray-50 hover:bg-gray-100 focus:bg-white border-transparent focus:border-ub-gold focus:ring-4 focus:ring-ub-gold/5 rounded-2xl text-sm font-bold text-black placeholder:text-gray-300 transition-all outline-none"
                                                                placeholder="••••••••"
                                                            />
                                                            <button
                                                                type="button"
                                                                onClick={() => setShowPw({ ...showPw, [field.key === 'newPw' ? 'new' : field.key]: !field.show })}
                                                                className="absolute right-6 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center text-gray-300 hover:text-black hover:bg-gray-100 rounded-xl transition-all"
                                                            >
                                                                {field.show ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>

                                            <button
                                                type="submit"
                                                disabled={isSavingPw}
                                                className="w-full py-6 bg-black text-white text-[11px] font-black uppercase tracking-[0.3em] rounded-3xl hover:bg-ub-navy shadow-2xl shadow-black/20 hover:scale-[1.02] transition-all disabled:opacity-50 flex items-center justify-center gap-4 active:scale-95"
                                            >
                                                {isSavingPw ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                                                    <>
                                                        Finalize Encryption
                                                        <ChevronRight className="w-4 h-4" />
                                                    </>
                                                )}
                                            </button>
                                        </form>

                                        {/* Danger Zone */}
                                        <div className="mt-20 pt-12 border-t border-gray-100">
                                            <div className="flex items-center gap-4 mb-8">
                                                <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center">
                                                    <AlertCircle className="w-5 h-5 text-rose-500" />
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-black uppercase tracking-widest text-black">Danger Zone</p>
                                                    <p className="text-[9px] text-gray-400 font-bold uppercase tracking-tight">Serious account actions</p>
                                                </div>
                                            </div>

                                            <div className="p-8 bg-rose-50/30 rounded-[2.5rem] border border-rose-100/50 flex flex-col sm:flex-row items-center justify-between gap-6">
                                                <div className="text-center sm:text-left">
                                                    <p className="text-[10px] font-black uppercase text-rose-600 tracking-widest">Deactivate Account</p>
                                                    <p className="text-[9px] text-rose-400 font-bold uppercase tracking-tight mt-1">This will temporarily disable your account access</p>
                                                </div>

                                                {showDeleteConfirm ? (
                                                    <div className="flex items-center gap-3 animate-in fade-in zoom-in-95 duration-300">
                                                        <button
                                                            disabled={isDeleting}
                                                            onClick={handleDeleteAccount}
                                                            className="px-6 py-3 bg-rose-600 text-white text-[9px] font-black uppercase tracking-widest rounded-xl hover:bg-rose-700 transition-all flex items-center gap-2"
                                                        >
                                                            {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                                                            Confirm
                                                        </button>
                                                        <button
                                                            onClick={() => setShowDeleteConfirm(false)}
                                                            className="px-6 py-3 bg-white text-gray-400 text-[9px] font-black uppercase tracking-widest rounded-xl border border-gray-100 hover:bg-gray-50 transition-all"
                                                        >
                                                            Cancel
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <button
                                                        onClick={() => setShowDeleteConfirm(true)}
                                                        className="px-8 py-4 bg-white border border-rose-200 text-rose-500 text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-rose-50 hover:border-rose-300 transition-all"
                                                    >
                                                        Hapus Akun
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Add simple CSS animation
const style = `
@keyframes spin-slow {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
}
.animate-spin-slow {
    animation: spin-slow 8s linear infinite;
}
`;

if (typeof document !== 'undefined') {
    const s = document.createElement('style');
    s.innerHTML = style;
    document.head.appendChild(s);
}
