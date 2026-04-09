'use client';

import { useState } from 'react';
import { ExternalLink, Plus, Trash2, Check, AlertCircle } from 'lucide-react';

export type MarketplacePlatform =
    | 'TOKOPEDIA'
    | 'SHOPEE'

export type LinkEntry = {
    platform: MarketplacePlatform;
    url: string;
    isActive: boolean;
};

const PLATFORM_CONFIG: Record<
    MarketplacePlatform,
    { label: string; color: string; bgColor: string; placeholder: string; emoji: string }
> = {
    TOKOPEDIA: {
        label: 'Tokopedia',
        color: 'text-green-400',
        bgColor: 'bg-green-500/10 border-green-500/20',
        placeholder: 'https://www.tokopedia.com/...',
        emoji: '🟢',
    },
    SHOPEE: {
        label: 'Shopee',
        color: 'text-orange-400',
        bgColor: 'bg-orange-500/10 border-orange-500/20',
        placeholder: 'https://shopee.co.id/...',
        emoji: '🟠',
    },
};

const ALL_PLATFORMS = Object.keys(PLATFORM_CONFIG) as MarketplacePlatform[];

interface MarketplaceLinksManagerProps {
    initialLinks?: LinkEntry[];
    onChange?: (links: LinkEntry[]) => void;
}

export default function MarketplaceLinksManager({
    initialLinks = [],
    onChange,
}: MarketplaceLinksManagerProps) {
    const [links, setLinks] = useState<LinkEntry[]>(initialLinks);
    const [urlErrors, setUrlErrors] = useState<Record<string, string>>({});

    const availablePlatforms = ALL_PLATFORMS.filter(
        (p) => !links.some((l) => l.platform === p)
    );

    const addPlatform = (platform: MarketplacePlatform) => {
        const newLinks = [...links, { platform, url: '', isActive: true }];
        setLinks(newLinks);
        onChange?.(newLinks);
    };

    const removeLink = (platform: MarketplacePlatform) => {
        const newLinks = links.filter((l) => l.platform !== platform);
        setLinks(newLinks);
        onChange?.(newLinks);
        setUrlErrors((prev) => {
            const next = { ...prev };
            delete next[platform];
            return next;
        });
    };

    const updateUrl = (platform: MarketplacePlatform, url: string) => {
        const newLinks = links.map((l) =>
            l.platform === platform ? { ...l, url } : l
        );
        setLinks(newLinks);
        onChange?.(newLinks);

        // Validate URL format
        if (url && !isValidUrl(url)) {
            setUrlErrors((prev) => ({ ...prev, [platform]: 'URL tidak valid' }));
        } else {
            setUrlErrors((prev) => {
                const next = { ...prev };
                delete next[platform];
                return next;
            });
        }
    };

    const toggleActive = (platform: MarketplacePlatform) => {
        const newLinks = links.map((l) =>
            l.platform === platform ? { ...l, isActive: !l.isActive } : l
        );
        setLinks(newLinks);
        onChange?.(newLinks);
    };

    const isValidUrl = (url: string) => {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    };

    return (
        <div className="bg-[#001a33] rounded-[40px] shadow-2xl border border-white/5 p-8 space-y-6">
            <div>
                <h2 className="text-sm font-black text-ub-gold uppercase tracking-[0.2em] mb-1 flex items-center gap-2">
                    <ExternalLink className="h-4 w-4" />
                    Marketplace Links
                </h2>
                <p className="text-[9px] text-gray-600 font-bold uppercase tracking-widest">
                    Tambahkan link produk ke marketplace eksternal
                </p>
            </div>

            {/* Existing links */}
            <div className="space-y-3">
                {links.length === 0 && (
                    <div className="text-center py-6 border border-dashed border-white/10 rounded-2xl">
                        <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">
                            Belum ada link marketplace ditambahkan
                        </p>
                    </div>
                )}
                {links.map((link) => {
                    const config = PLATFORM_CONFIG[link.platform];
                    const hasError = !!urlErrors[link.platform];
                    return (
                        <div
                            key={link.platform}
                            className={`rounded-2xl border p-4 space-y-3 transition-all ${link.isActive
                                ? config.bgColor
                                : 'bg-white/5 border-white/5 opacity-60'
                                }`}
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <span className="text-base">{config.emoji}</span>
                                    <span className={`text-[10px] font-black uppercase tracking-widest ${config.color}`}>
                                        {config.label}
                                    </span>
                                    {!link.isActive && (
                                        <span className="text-[8px] font-black bg-white/10 text-gray-500 px-2 py-0.5 rounded-full uppercase tracking-widest">
                                            Non-aktif
                                        </span>
                                    )}
                                </div>
                                <div className="flex items-center gap-2">
                                    {/* Toggle active */}
                                    <button
                                        type="button"
                                        onClick={() => toggleActive(link.platform)}
                                        className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all duration-200 ${link.isActive
                                            ? 'bg-ub-gold border-ub-gold'
                                            : 'bg-white/5 border-white/10'
                                            }`}
                                        title={link.isActive ? 'Nonaktifkan' : 'Aktifkan'}
                                    >
                                        {link.isActive && <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />}
                                    </button>
                                    {/* Remove */}
                                    <button
                                        type="button"
                                        onClick={() => removeLink(link.platform)}
                                        className="p-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-lg transition-all"
                                        title="Hapus"
                                    >
                                        <Trash2 className="h-3 w-3" />
                                    </button>
                                </div>
                            </div>

                            <div className="relative">
                                <input
                                    type="url"
                                    value={link.url}
                                    onChange={(e) => updateUrl(link.platform, e.target.value)}
                                    placeholder={config.placeholder}
                                    className={`w-full px-4 py-3 bg-black/20 text-white border rounded-xl text-[10px] font-bold tracking-wide focus:ring-2 focus:ring-ub-gold transition-all outline-none ${hasError
                                        ? 'border-rose-500/50 focus:ring-rose-500'
                                        : 'border-white/10'
                                        }`}
                                />
                                {hasError && (
                                    <div className="flex items-center gap-1 mt-1">
                                        <AlertCircle className="h-3 w-3 text-rose-400" />
                                        <span className="text-[9px] font-bold text-rose-400">
                                            {urlErrors[link.platform]}
                                        </span>
                                    </div>
                                )}
                                {link.url && !hasError && (
                                    <a
                                        href={link.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-ub-gold transition-colors"
                                    >
                                        <ExternalLink className="h-3 w-3" />
                                    </a>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Add platform buttons */}
            {availablePlatforms.length > 0 && (
                <div>
                    <p className="text-[9px] font-black text-gray-600 uppercase tracking-widest mb-3">
                        Tambah Platform
                    </p>
                    <div className="flex flex-wrap gap-2">
                        {availablePlatforms.map((platform) => {
                            const config = PLATFORM_CONFIG[platform];
                            return (
                                <button
                                    key={platform}
                                    type="button"
                                    onClick={() => addPlatform(platform)}
                                    className="flex items-center gap-1.5 px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 rounded-xl text-[9px] font-black uppercase tracking-widest text-gray-400 hover:text-white transition-all"
                                >
                                    <Plus className="h-3 w-3" />
                                    <span>{config.emoji}</span>
                                    {config.label}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}

            {links.length > 0 && (
                <p className="text-[8px] font-bold text-gray-600 uppercase tracking-widest">
                    {links.filter((l) => l.isActive && l.url).length} dari {links.length} link aktif
                </p>
            )}
        </div>
    );
}
