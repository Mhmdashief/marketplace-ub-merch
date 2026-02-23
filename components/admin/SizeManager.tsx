'use client';

import { useState, useEffect } from 'react';
import { Plus, X, Ruler, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export interface SizeEntry {
    value: string;
    regularPrice: number;
    discountPrice: number | null;
}

export interface SizeConfig {
    enabled: boolean;
    type: 'clothing' | 'inch' | 'custom';
    sizes: SizeEntry[];
}

const CLOTHING_PRESETS = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'];
const INCH_PRESETS = ['6"', '7"', '8"', '9"', '10"', '11"', '12"', '13"', '14"', '15"', '16"', '17"', '18"'];

interface SizeManagerProps {
    initialSizes?: string | null;
    baseRegularPrice?: number;
    baseDiscountPrice?: number | null;
    onChange?: (json: string | null) => void;
}

function parseSizesConfig(raw: string | null | undefined): SizeConfig {
    if (!raw) return { enabled: false, type: 'clothing', sizes: [] };
    try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed.values)) {
            return {
                enabled: parsed.enabled ?? false,
                type: parsed.type ?? 'clothing',
                sizes: (parsed.values as string[]).map((v: string) => ({
                    value: v, regularPrice: 0, discountPrice: null,
                })),
            };
        }
        if (parsed.sizes?.[0]?.priceDiff !== undefined) {
            return {
                enabled: parsed.enabled ?? false,
                type: parsed.type ?? 'clothing',
                sizes: parsed.sizes.map((s: { value: string; priceDiff: number }) => ({
                    value: s.value,
                    regularPrice: 0,
                    discountPrice: null,
                })),
            };
        }
        return parsed as SizeConfig;
    } catch {
        return { enabled: false, type: 'clothing', sizes: [] };
    }
}

function fmt(n: number) {
    return n.toLocaleString('id-ID');
}

export default function SizeManager({
    initialSizes,
    baseRegularPrice = 0,
    baseDiscountPrice = null,
    onChange,
}: SizeManagerProps) {
    const [config, setConfig] = useState<SizeConfig>(() => parseSizesConfig(initialSizes));
    const [customInput, setCustomInput] = useState('');
    const [expandedSize, setExpandedSize] = useState<string | null>(null);

    useEffect(() => {
        if (!config.enabled || config.sizes.length === 0) {
            onChange?.(null);
        } else {
            onChange?.(JSON.stringify(config));
        }
    }, [config]);

    const hasSize = (v: string) => config.sizes.some(s => s.value === v);

    const togglePreset = (v: string) => {
        if (hasSize(v)) {
            setConfig(prev => ({ ...prev, sizes: prev.sizes.filter(s => s.value !== v) }));
            if (expandedSize === v) setExpandedSize(null);
        } else {
            setConfig(prev => ({
                ...prev,
                sizes: [...prev.sizes, { value: v, regularPrice: 0, discountPrice: null }],
            }));
        }
    };

    const selectAll = (presets: string[]) => {
        setConfig(prev => ({
            ...prev,
            sizes: presets.map(v => {
                const ex = prev.sizes.find(s => s.value === v);
                return ex ?? { value: v, regularPrice: 0, discountPrice: null };
            }),
        }));
    };

    const clearAll = () => {
        setConfig(prev => ({ ...prev, sizes: [] }));
        setExpandedSize(null);
    };

    const addCustom = () => {
        const val = customInput.trim().toUpperCase();
        if (!val || hasSize(val)) return;
        setConfig(prev => ({
            ...prev,
            sizes: [...prev.sizes, { value: val, regularPrice: 0, discountPrice: null }],
        }));
        setCustomInput('');
    };

    const removeSize = (v: string) => {
        setConfig(prev => ({ ...prev, sizes: prev.sizes.filter(s => s.value !== v) }));
        if (expandedSize === v) setExpandedSize(null);
    };

    const patchSize = (v: string, patch: Partial<SizeEntry>) => {
        setConfig(prev => ({
            ...prev,
            sizes: prev.sizes.map(s => s.value === v ? { ...s, ...patch } : s),
        }));
    };

    const activePresets = config.type === 'clothing' ? CLOTHING_PRESETS
        : config.type === 'inch' ? INCH_PRESETS : [];

    const effectivePrice = (s: SizeEntry) => ({
        regular: s.regularPrice > 0 ? s.regularPrice : baseRegularPrice,
        discount: s.discountPrice != null ? s.discountPrice
            : (s.regularPrice === 0 && baseDiscountPrice != null) ? baseDiscountPrice : null,
    });

    return (
        <div className="bg-[#001a33] rounded-[40px] shadow-2xl border border-white/5 p-8 space-y-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-ub-gold/5 blur-3xl rounded-full -mr-20 -mt-20 pointer-events-none" />

            {/* Header + Toggle */}
            <div className="flex items-center justify-between relative z-10">
                <div>
                    <h2 className="text-sm font-black text-gray-500 uppercase tracking-[0.2em]">Size Options</h2>
                    <p className="text-[9px] text-gray-700 font-bold uppercase tracking-widest mt-1">
                        Ukuran + harga &amp; diskon per size
                    </p>
                </div>
                <button
                    type="button"
                    onClick={() => setConfig(prev => ({ ...prev, enabled: !prev.enabled }))}
                    className={`relative w-14 h-7 rounded-full transition-colors duration-300 flex-shrink-0 ${config.enabled ? 'bg-ub-gold' : 'bg-white/10'}`}
                >
                    <span className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow-lg transition-all duration-300 ${config.enabled ? 'left-8' : 'left-1'}`} />
                </button>
            </div>

            <AnimatePresence>
                {config.enabled && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-6 overflow-hidden relative z-10"
                    >
                        {/* Type selector */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-white uppercase tracking-widest ml-1">
                                Tipe Ukuran
                            </label>
                            <div className="grid grid-cols-3 gap-3">
                                {[
                                    { value: 'clothing', label: 'Pakaian', sub: 'S, M, L...' },
                                    { value: 'inch', label: 'Inch', sub: '6", 7"...' },
                                    { value: 'custom', label: 'Custom', sub: 'Bebas input' },
                                ].map(opt => (
                                    <button
                                        key={opt.value}
                                        type="button"
                                        onClick={() => setConfig(prev => ({
                                            ...prev,
                                            type: opt.value as SizeConfig['type'],
                                            sizes: [],
                                        }))}
                                        className={`p-4 rounded-2xl border-2 flex flex-col gap-1 transition-all ${config.type === opt.value
                                            ? 'border-ub-gold bg-ub-gold/10 text-white'
                                            : 'border-white/5 bg-black/20 text-gray-400 hover:border-white/20'
                                            }`}
                                    >
                                        <span className="text-[10px] font-black uppercase tracking-widest">{opt.label}</span>
                                        <span className="text-[8px] font-bold text-gray-600 uppercase">{opt.sub}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Preset grid */}
                        {config.type !== 'custom' && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <label className="text-[10px] font-black text-white uppercase tracking-widest ml-1">
                                        Pilih Ukuran
                                    </label>
                                    <div className="flex gap-3">
                                        <button type="button" onClick={() => selectAll(activePresets)}
                                            className="text-[8px] font-black text-ub-gold uppercase tracking-widest hover:underline">
                                            All
                                        </button>
                                        <span className="text-gray-700">·</span>
                                        <button type="button" onClick={clearAll}
                                            className="text-[8px] font-black text-gray-500 uppercase tracking-widest hover:text-gray-300">
                                            Clear
                                        </button>
                                    </div>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {activePresets.map(size => (
                                        <button
                                            key={size}
                                            type="button"
                                            onClick={() => togglePreset(size)}
                                            className={`px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest border-2 transition-all ${hasSize(size)
                                                ? 'bg-ub-gold border-ub-gold text-white shadow-lg shadow-ub-gold/20'
                                                : 'bg-black/20 border-white/5 text-gray-400 hover:border-white/20 hover:text-white'
                                                }`}
                                        >
                                            {size}
                                        </button>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {/* Custom / extra inch input */}
                        {(config.type === 'custom' || config.type === 'inch') && (
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={customInput}
                                    onChange={e => setCustomInput(e.target.value)}
                                    onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addCustom())}
                                    placeholder={config.type === 'inch' ? 'UKURAN LAIN (ex: 20")' : 'FREE SIZE, 27x40, ONE SIZE...'}
                                    className="flex-1 px-5 py-3 bg-black/20 text-white border border-white/5 rounded-xl text-[9px] font-black uppercase tracking-widest focus:ring-2 focus:ring-ub-gold outline-none transition-all"
                                />
                                <button type="button" onClick={addCustom}
                                    className="p-3 bg-ub-gold hover:bg-ub-gold/80 text-white rounded-xl transition-all">
                                    <Plus className="w-4 h-4" />
                                </button>
                            </div>
                        )}

                        {/* Sizes with pricing */}
                        {config.sizes.length > 0 && (
                            <div className="space-y-2 pt-2 border-t border-white/5">
                                <div className="flex items-center gap-2 mb-3">
                                    <Ruler className="w-3 h-3 text-ub-gold" />
                                    <span className="text-[9px] font-black text-ub-gold uppercase tracking-widest">
                                        {config.sizes.length} Ukuran — Klik untuk atur harga &amp; diskon
                                    </span>
                                </div>

                                {config.sizes.map(s => {
                                    const eff = effectivePrice(s);
                                    const isCustomPrice = s.regularPrice > 0;
                                    const hasDiscount = s.discountPrice != null;
                                    const isOpen = expandedSize === s.value;

                                    return (
                                        <div key={s.value} className="rounded-2xl border border-white/5 bg-black/20 overflow-hidden">
                                            {/* Row header */}
                                            <button
                                                type="button"
                                                onClick={() => setExpandedSize(isOpen ? null : s.value)}
                                                className="w-full flex items-center justify-between px-4 py-3 hover:bg-white/5 transition-colors"
                                            >
                                                <div className="flex items-center gap-3 min-w-0">
                                                    <span className="px-3 py-1.5 bg-ub-gold/10 border border-ub-gold/20 rounded-lg text-[11px] font-black text-ub-gold uppercase tracking-widest flex-shrink-0">
                                                        {s.value}
                                                    </span>
                                                    <div className="min-w-0">
                                                        <p className="text-[10px] font-black text-white truncate">
                                                            Rp {fmt(eff.regular)}
                                                            {eff.discount != null && (
                                                                <span className="text-emerald-400 ml-2">→ Rp {fmt(eff.discount)}</span>
                                                            )}
                                                        </p>
                                                        <p className="text-[8px] font-bold text-gray-600 uppercase tracking-widest">
                                                            {isCustomPrice ? 'Harga khusus' : 'Ikut harga produk'}
                                                            {hasDiscount ? ' · Ada diskon' : ''}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2 flex-shrink-0">
                                                    {isOpen
                                                        ? <ChevronUp className="w-4 h-4 text-ub-gold" />
                                                        : <ChevronDown className="w-4 h-4 text-gray-500" />
                                                    }
                                                    <span
                                                        role="button"
                                                        onClick={e => { e.stopPropagation(); removeSize(s.value); }}
                                                        className="p-1.5 rounded-lg bg-white/5 hover:bg-rose-500/20 text-gray-600 hover:text-rose-400 transition-all cursor-pointer"
                                                    >
                                                        <X className="w-3 h-3" />
                                                    </span>
                                                </div>
                                            </button>

                                            {/* Expanded pricing panel */}
                                            <AnimatePresence>
                                                {isOpen && (
                                                    <motion.div
                                                        initial={{ height: 0, opacity: 0 }}
                                                        animate={{ height: 'auto', opacity: 1 }}
                                                        exit={{ height: 0, opacity: 0 }}
                                                        transition={{ duration: 0.22 }}
                                                        className="overflow-hidden border-t border-white/5"
                                                    >
                                                        <div className="px-4 py-5 space-y-5">

                                                            {/* Regular Price */}
                                                            <div className="space-y-2">
                                                                <div className="flex items-center justify-between">
                                                                    <label className="text-[10px] font-black text-white uppercase tracking-widest">
                                                                        Harga Normal
                                                                    </label>
                                                                    {isCustomPrice && (
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => patchSize(s.value, { regularPrice: 0, discountPrice: null })}
                                                                            className="text-[8px] font-black text-gray-500 uppercase tracking-widest hover:text-rose-400 transition-colors"
                                                                        >
                                                                            Reset ke harga produk
                                                                        </button>
                                                                    )}
                                                                </div>
                                                                <div className="relative">
                                                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-gray-500">Rp</span>
                                                                    <input
                                                                        type="number"
                                                                        min={0}
                                                                        value={s.regularPrice || ''}
                                                                        onChange={e => patchSize(s.value, {
                                                                            regularPrice: Number(e.target.value) || 0,
                                                                        })}
                                                                        placeholder={baseRegularPrice > 0
                                                                            ? `${fmt(baseRegularPrice)} (default)`
                                                                            : 'Masukkan harga (0 = ikut produk)'
                                                                        }
                                                                        className="w-full pl-10 pr-4 py-3 bg-black/30 text-white border border-white/5 rounded-xl text-[10px] font-black focus:ring-2 focus:ring-ub-gold outline-none transition-all placeholder:text-gray-700"
                                                                    />
                                                                </div>
                                                                {!isCustomPrice && (
                                                                    <p className="text-[8px] text-gray-600 font-bold uppercase tracking-widest">
                                                                        Kosongkan = menggunakan harga produk (Rp {fmt(baseRegularPrice)})
                                                                    </p>
                                                                )}
                                                            </div>

                                                            {/* Discount Price */}
                                                            <div className="space-y-2">
                                                                <div className="flex items-center justify-between">
                                                                    <label className="text-[10px] font-black text-white uppercase tracking-widest">
                                                                        Harga Diskon
                                                                    </label>
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => patchSize(s.value, {
                                                                            discountPrice: hasDiscount ? null : 0,
                                                                        })}
                                                                        className={`text-[8px] font-black uppercase tracking-widest transition-colors ${hasDiscount
                                                                            ? 'text-rose-400 hover:text-rose-300'
                                                                            : 'text-ub-gold hover:text-ub-gold/80'
                                                                            }`}
                                                                    >
                                                                        {hasDiscount ? 'Hapus Diskon' : '+ Tambah Diskon'}
                                                                    </button>
                                                                </div>

                                                                <AnimatePresence>
                                                                    {hasDiscount && (
                                                                        <motion.div
                                                                            initial={{ height: 0, opacity: 0 }}
                                                                            animate={{ height: 'auto', opacity: 1 }}
                                                                            exit={{ height: 0, opacity: 0 }}
                                                                            className="overflow-hidden"
                                                                        >
                                                                            <div className="space-y-3">
                                                                                <div className="relative">
                                                                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-emerald-500">Rp</span>
                                                                                    <input
                                                                                        type="number"
                                                                                        min={0}
                                                                                        value={s.discountPrice ?? ''}
                                                                                        onChange={e => patchSize(s.value, {
                                                                                            discountPrice: e.target.value === '' ? null : Number(e.target.value),
                                                                                        })}
                                                                                        placeholder="Masukkan harga setelah diskon"
                                                                                        className="w-full pl-10 pr-4 py-3 bg-emerald-500/5 text-emerald-400 border border-emerald-500/20 rounded-xl text-[10px] font-black focus:ring-2 focus:ring-emerald-500 outline-none transition-all placeholder:text-emerald-900"
                                                                                    />
                                                                                </div>
                                                                                {/* Discount quick-presets */}
                                                                                {eff.regular > 0 && (
                                                                                    <div className="flex flex-wrap gap-2">
                                                                                        <span className="text-[8px] font-black text-gray-600 uppercase tracking-widest self-center">Preset:</span>
                                                                                        {[5, 10, 15, 20, 25, 30].map(pct => {
                                                                                            const discVal = Math.round(eff.regular * (1 - pct / 100));
                                                                                            return (
                                                                                                <button
                                                                                                    key={pct}
                                                                                                    type="button"
                                                                                                    onClick={() => patchSize(s.value, { discountPrice: discVal })}
                                                                                                    className={`px-3 py-1.5 rounded-lg text-[8px] font-black uppercase tracking-widest border transition-all ${s.discountPrice === discVal
                                                                                                        ? 'bg-emerald-500 border-emerald-500 text-white'
                                                                                                        : 'bg-black/20 border-white/5 text-gray-500 hover:border-emerald-500/30 hover:text-emerald-400'
                                                                                                        }`}
                                                                                                >
                                                                                                    -{pct}%
                                                                                                    <span className="block text-[7px] opacity-70">
                                                                                                        Rp {(discVal / 1000).toFixed(0)}k
                                                                                                    </span>
                                                                                                </button>
                                                                                            );
                                                                                        })}
                                                                                    </div>
                                                                                )}
                                                                                {s.discountPrice != null && s.discountPrice > 0 && eff.regular > 0 && (
                                                                                    <p className="text-[8px] font-black text-emerald-400 uppercase tracking-widest">
                                                                                        Hemat {Math.round((1 - s.discountPrice / eff.regular) * 100)}% ·
                                                                                        Rp {fmt(eff.regular - s.discountPrice)} lebih murah
                                                                                    </p>
                                                                                )}
                                                                            </div>
                                                                        </motion.div>
                                                                    )}
                                                                </AnimatePresence>

                                                                {!hasDiscount && (
                                                                    <p className="text-[8px] text-gray-700 font-bold uppercase tracking-widest">
                                                                        Tidak ada diskon untuk ukuran ini
                                                                    </p>
                                                                )}
                                                            </div>

                                                            {/* Summary */}
                                                            {(isCustomPrice || hasDiscount) && (
                                                                <div className="pt-3 border-t border-white/5 flex items-center gap-3">
                                                                    <div className="flex-1 px-4 py-3 bg-white/5 rounded-xl">
                                                                        <p className="text-[8px] font-black text-gray-500 uppercase tracking-widest">Harga Tampil</p>
                                                                        <p className="text-[13px] font-black text-white mt-0.5">
                                                                            Rp {fmt(eff.discount ?? eff.regular)}
                                                                            {eff.discount != null && (
                                                                                <span className="text-gray-600 line-through ml-2 text-[10px]">
                                                                                    Rp {fmt(eff.regular)}
                                                                                </span>
                                                                            )}
                                                                        </p>
                                                                    </div>
                                                                    {eff.discount != null && eff.regular > 0 && (
                                                                        <div className="px-4 py-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-center">
                                                                            <p className="text-[8px] font-black text-gray-500 uppercase tracking-widest">Diskon</p>
                                                                            <p className="text-[13px] font-black text-emerald-400 mt-0.5">
                                                                                {Math.round((1 - eff.discount / eff.regular) * 100)}%
                                                                            </p>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    );
                                })}
                            </div>
                        )}

                        {config.sizes.length === 0 && (
                            <p className="text-[9px] text-gray-700 font-bold uppercase tracking-widest text-center py-2">
                                ⚠ Belum ada ukuran dipilih
                            </p>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            {!config.enabled && (
                <p className="text-[9px] text-gray-700 font-bold uppercase tracking-widest relative z-10">
                    Aktifkan untuk menambahkan opsi ukuran, harga, dan diskon per size
                </p>
            )}
        </div>
    );
}
