'use client';

import { useState } from 'react';
import {
    MapPin,
    Plus,
    Pencil,
    Trash2,
    Star,
    Phone,
    CheckCircle2,
    User,
    Loader2,
    X,
    Home,
    Briefcase,
} from 'lucide-react';
import {
    addUserAddress,
    updateUserAddress,
    deleteUserAddress,
    setDefaultAddress,
    type UserAddressData,
} from '@/app/actions/addresses';

export type SavedAddress = {
    id: string;
    label: string;
    recipientName: string;
    phone: string;
    address: string;
    city: string;
    province: string;
    postalCode: string;
    isDefault: boolean;
};

type AddressManagerProps = {
    userId: string;
    initialAddresses: SavedAddress[];
    onSelect?: (address: SavedAddress) => void;
    selectedId?: string;
};

const LABEL_ICONS: Record<string, React.ElementType> = {
    Rumah: Home,
    Kantor: Briefcase,
    Kos: MapPin,
};

const emptyForm: UserAddressData = {
    label: 'Rumah',
    recipientName: '',
    phone: '',
    address: '',
    city: '',
    province: '',
    postalCode: '',
    isDefault: false,
};

export default function AddressManager({
    userId,
    initialAddresses,
    onSelect,
    selectedId,
}: AddressManagerProps) {
    const [addresses, setAddresses] = useState<SavedAddress[]>(initialAddresses);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState<UserAddressData>(emptyForm);
    const [isLoading, setIsLoading] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const isSelectMode = !!onSelect;

    const openAdd = () => {
        setEditingId(null);
        setFormData(emptyForm);
        setShowForm(true);
    };

    const openEdit = (addr: SavedAddress) => {
        setEditingId(addr.id);
        setFormData({
            label: addr.label,
            recipientName: addr.recipientName,
            phone: addr.phone,
            address: addr.address,
            city: addr.city,
            province: addr.province,
            postalCode: addr.postalCode,
            isDefault: addr.isDefault,
        });
        setShowForm(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        let result;
        if (editingId) {
            result = await updateUserAddress(userId, editingId, formData);
        } else {
            result = await addUserAddress(userId, formData);
        }

        if (result.success) {
            if (editingId) {
                setAddresses((prev) =>
                    prev.map((a) => {
                        if (a.id === editingId) {
                            return { ...a, ...formData };
                        }
                        if (formData.isDefault) return { ...a, isDefault: false };
                        return a;
                    }).map(a => a.id === editingId ? { ...a, isDefault: formData.isDefault ?? a.isDefault } : a)
                );
            } else if (result.address) {
                setAddresses((prev) => {
                    const updated = formData.isDefault
                        ? prev.map((a) => ({ ...a, isDefault: false }))
                        : prev;
                    return [
                        ...updated,
                        {
                            id: result.address!.id,
                            label: result.address!.label,
                            recipientName: result.address!.recipientName,
                            phone: result.address!.phone,
                            address: result.address!.address,
                            city: result.address!.city,
                            province: result.address!.province,
                            postalCode: result.address!.postalCode,
                            isDefault: result.address!.isDefault,
                        },
                    ].sort((a, b) => (b.isDefault ? 1 : 0) - (a.isDefault ? 1 : 0));
                });
            }
            setShowForm(false);
            setEditingId(null);
        }
        setIsLoading(false);
    };

    const handleDelete = async (id: string) => {
        setDeletingId(id);
        const result = await deleteUserAddress(userId, id);
        if (result.success) {
            setAddresses((prev) => {
                const remaining = prev.filter((a) => a.id !== id);
                const wasDefault = prev.find((a) => a.id === id)?.isDefault;
                if (wasDefault && remaining.length > 0) {
                    remaining[0] = { ...remaining[0], isDefault: true };
                }
                return remaining;
            });
        }
        setDeletingId(null);
    };

    const handleSetDefault = async (id: string) => {
        const result = await setDefaultAddress(userId, id);
        if (result.success) {
            setAddresses((prev) =>
                prev.map((a) => ({ ...a, isDefault: a.id === id }))
                    .sort((a, b) => (b.isDefault ? 1 : 0) - (a.isDefault ? 1 : 0))
            );
        }
    };

    return (
        <div className="space-y-6">
            {/* Address Cards */}
            <div className="space-y-4">
                {addresses.length === 0 && !showForm && (
                    <div className="text-center py-12 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                        <MapPin className="w-10 h-10 text-gray-200 mx-auto mb-4" />
                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                            No Saved Addresses
                        </p>
                        <p className="text-xs text-gray-400 mt-2">Add your first delivery address below</p>
                    </div>
                )}

                {addresses.map((addr) => {
                    const LabelIcon = LABEL_ICONS[addr.label] ?? MapPin;
                    const isSelected = selectedId === addr.id;

                    return (
                        <div
                            key={addr.id}
                            onClick={() => isSelectMode && onSelect?.(addr)}
                            className={`relative rounded-3xl border-2 transition-all duration-300 overflow-hidden
                                ${isSelectMode ? 'cursor-pointer hover:border-black hover:shadow-lg' : ''}
                                ${isSelected ? 'border-black bg-black text-white shadow-xl' : 'border-gray-100 bg-white'}
                            `}
                        >
                            {/* Default badge */}
                            {addr.isDefault && (
                                <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5
                                    ${isSelected ? 'bg-ub-gold text-black' : 'bg-black text-white'}`}>
                                    <Star className="w-2.5 h-2.5 fill-current" />
                                    Default
                                </div>
                            )}

                            {isSelected && (
                                <div className="absolute top-4 left-4">
                                    <CheckCircle2 className="w-5 h-5 text-ub-gold" />
                                </div>
                            )}

                            <div className="p-6">
                                <div className={`flex items-start gap-4 ${isSelected ? 'pl-8' : ''}`}>
                                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0
                                        ${isSelected ? 'bg-white/10' : 'bg-gray-50'}`}>
                                        <LabelIcon className={`w-5 h-5 ${isSelected ? 'text-white' : 'text-gray-400'}`} />
                                    </div>
                                    <div className="flex-1 min-w-0 pr-16">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className={`text-[10px] font-black uppercase tracking-widest
                                                ${isSelected ? 'text-ub-gold' : 'text-black'}`}>
                                                {addr.label}
                                            </span>
                                        </div>
                                        <p className={`text-sm font-bold ${isSelected ? 'text-white' : 'text-black'}`}>
                                            {addr.recipientName}
                                        </p>
                                        <div className={`flex items-center gap-1.5 mt-0.5 ${isSelected ? 'text-gray-300' : 'text-gray-400'}`}>
                                            <Phone className="w-3 h-3" />
                                            <span className="text-[11px] font-medium">{addr.phone}</span>
                                        </div>
                                        <p className={`text-[11px] mt-2 leading-relaxed ${isSelected ? 'text-gray-300' : 'text-gray-500'}`}>
                                            {addr.address}, {addr.city}, {addr.province} {addr.postalCode}
                                        </p>
                                    </div>
                                </div>

                                {/* Action buttons — only in manage mode */}
                                {!isSelectMode && (
                                    <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-50">
                                        {!addr.isDefault && (
                                            <button
                                                type="button"
                                                onClick={() => handleSetDefault(addr.id)}
                                                className="flex items-center gap-1.5 px-3 py-1.5 text-[9px] font-black uppercase tracking-widest text-gray-400 hover:text-black hover:bg-gray-50 rounded-xl transition-all"
                                            >
                                                <Star className="w-3 h-3" />
                                                Set Default
                                            </button>
                                        )}
                                        <button
                                            type="button"
                                            onClick={() => openEdit(addr)}
                                            className="flex items-center gap-1.5 px-3 py-1.5 text-[9px] font-black uppercase tracking-widest text-gray-400 hover:text-black hover:bg-gray-50 rounded-xl transition-all"
                                        >
                                            <Pencil className="w-3 h-3" />
                                            Edit
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleDelete(addr.id)}
                                            disabled={deletingId === addr.id}
                                            className="flex items-center gap-1.5 px-3 py-1.5 text-[9px] font-black uppercase tracking-widest text-rose-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all disabled:opacity-50"
                                        >
                                            {deletingId === addr.id ? (
                                                <div className="w-3 h-3 border border-rose-400 border-t-transparent rounded-full animate-spin" />
                                            ) : (
                                                <Trash2 className="w-3 h-3" />
                                            )}
                                            Hapus
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Add New Button */}
            {!showForm && (
                <button
                    type="button"
                    onClick={openAdd}
                    className="w-full py-4 border-2 border-dashed border-gray-200 rounded-3xl text-[10px] font-black uppercase tracking-widest text-gray-400 hover:border-black hover:text-black hover:bg-gray-50 transition-all flex items-center justify-center gap-3 group"
                >
                    <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
                    Tambahkan Alamat Baru
                </button>
            )}

            {/* Inline Address Form */}
            {showForm && (
                <div className="bg-white rounded-[2.5rem] border border-gray-100 p-8 sm:p-12 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.05)] space-y-8 animate-in slide-in-from-bottom-6 duration-500 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-ub-gold/5 blur-3xl rounded-full -mr-16 -mt-16" />

                    <div className="flex items-center justify-between relative z-10">
                        <div>
                            <h4 className="text-xl font-black uppercase italic tracking-tighter text-black">
                                {editingId ? 'Edit Register' : 'New Registry'}
                            </h4>
                            <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-1">Konfigurasi alamat pengiriman</p>
                        </div>
                        <button
                            type="button"
                            onClick={() => { setShowForm(false); setEditingId(null); }}
                            className="w-10 h-10 flex items-center justify-center bg-gray-50 hover:bg-gray-100 rounded-2xl transition-all"
                        >
                            <X className="w-5 h-5 text-gray-400" />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
                        {/* Label */}
                        <div className="space-y-4">
                            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 px-1">
                                Kategori
                            </label>
                            <div className="flex flex-wrap gap-3">
                                {['Rumah', 'Kantor', 'Kos'].map((lbl) => {
                                    const Icon = LABEL_ICONS[lbl] ?? MapPin;
                                    return (
                                        <button
                                            key={lbl}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, label: lbl })}
                                            className={`flex items-center gap-3 px-6 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${formData.label === lbl
                                                ? 'bg-black text-white shadow-xl shadow-black/20'
                                                : 'bg-white text-gray-400 border border-gray-100 hover:border-ub-gold/20 hover:text-gray-600'
                                                }`}
                                        >
                                            <Icon className="w-4 h-4" />
                                            {lbl}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 px-1">
                                    Nama Penerima
                                </label>
                                <div className="relative group">
                                    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-black transition-colors">
                                        <User className="w-4 h-4" />
                                    </div>
                                    <input
                                        required
                                        type="text"
                                        placeholder="Ahmad Syaifulloh"
                                        value={formData.recipientName}
                                        onChange={(e) => setFormData({ ...formData, recipientName: e.target.value })}
                                        className="w-full pl-12 pr-6 py-4 bg-gray-50 hover:bg-gray-100 focus:bg-white border-transparent focus:border-ub-gold focus:ring-4 focus:ring-ub-gold/5 rounded-2xl text-sm font-bold text-black placeholder:text-gray-300 transition-all outline-none"
                                    />
                                </div>
                            </div>
                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 px-1">
                                    Nomor Telepon
                                </label>
                                <div className="relative group">
                                    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-black transition-colors">
                                        <Phone className="w-4 h-4" />
                                    </div>
                                    <input
                                        required
                                        type="tel"
                                        placeholder="0812XXXXXXXX"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        className="w-full pl-12 pr-6 py-4 bg-gray-50 hover:bg-gray-100 focus:bg-white border-transparent focus:border-ub-gold focus:ring-4 focus:ring-ub-gold/5 rounded-2xl text-sm font-bold text-black placeholder:text-gray-300 transition-all outline-none"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 px-1">
                                Alamat (Detail)
                            </label>
                            <textarea
                                required
                                rows={3}
                                placeholder="Jalan, Blok, Nomor..."
                                value={formData.address}
                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                className="w-full px-6 py-4 bg-gray-50 hover:bg-gray-100 focus:bg-white border-transparent focus:border-ub-gold focus:ring-4 focus:ring-ub-gold/5 rounded-2xl text-sm font-bold text-black placeholder:text-gray-300 transition-all outline-none resize-none"
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 px-1">City</label>
                                <input
                                    required
                                    type="text"
                                    placeholder="Kota"
                                    value={formData.city}
                                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                    className="w-full px-6 py-4 bg-gray-50 hover:bg-gray-100 focus:bg-white border-transparent focus:border-ub-gold focus:ring-4 focus:ring-ub-gold/5 rounded-2xl text-sm font-bold text-black placeholder:text-gray-300 transition-all outline-none"
                                />
                            </div>
                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 px-1">Provinsi</label>
                                <input
                                    required
                                    type="text"
                                    placeholder="Provinsi"
                                    value={formData.province}
                                    onChange={(e) => setFormData({ ...formData, province: e.target.value })}
                                    className="w-full px-6 py-4 bg-gray-50 hover:bg-gray-100 focus:bg-white border-transparent focus:border-ub-gold focus:ring-4 focus:ring-ub-gold/5 rounded-2xl text-sm font-bold text-black placeholder:text-gray-300 transition-all outline-none"
                                />
                            </div>
                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 px-1">Kode Pos</label>
                                <input
                                    required
                                    type="text"
                                    placeholder="XXXXX"
                                    value={formData.postalCode}
                                    onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                                    className="w-full px-6 py-4 bg-gray-50 hover:bg-gray-100 focus:bg-white border-transparent focus:border-ub-gold focus:ring-4 focus:ring-ub-gold/5 rounded-2xl text-sm font-bold text-black placeholder:text-gray-300 transition-all outline-none"
                                />
                            </div>
                        </div>

                        {/* Set as Default Toggle */}
                        <div className="flex items-center justify-between p-6 bg-gray-50 rounded-[2rem] border border-gray-100 group transition-all">
                            <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${formData.isDefault ? 'bg-black text-ub-gold shadow-lg' : 'bg-white text-gray-300'}`}>
                                    <Star className={`w-5 h-5 ${formData.isDefault ? 'fill-current' : ''}`} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-black">Primary Destination</p>
                                    <p className="text-[9px] text-gray-400 font-medium mt-0.5">Use as current default for all transactions</p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, isDefault: !formData.isDefault })}
                                className={`w-14 h-7 rounded-full relative transition-all duration-500 flex-shrink-0 p-1 ${formData.isDefault ? 'bg-ub-gold shadow-[0_0_20px_rgba(196,173,119,0.3)]' : 'bg-gray-200'
                                    }`}
                            >
                                <div className={`w-5 h-5 bg-white rounded-full shadow-sm transition-all duration-500 transform ${formData.isDefault ? 'translate-x-7' : 'translate-x-0'
                                    }`} />
                            </button>
                        </div>

                        <div className="flex gap-4 pt-4">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="flex-1 py-5 bg-black text-white text-[11px] font-black uppercase tracking-[0.3em] rounded-3xl hover:bg-ub-navy shadow-2xl shadow-black/20 hover:scale-[1.02] transition-all disabled:opacity-50 flex items-center justify-center gap-4 active:scale-95"
                            >
                                {isLoading ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <>
                                        {editingId ? 'Ubah Alamat' : 'Daftarkan Alamat'}
                                        <CheckCircle2 className="w-5 h-5" />
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}
