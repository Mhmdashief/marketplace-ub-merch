import Link from "next/link";
import { ShieldAlert, ArrowLeft } from "lucide-react";

export default function ForbiddenPage() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#000d1a] text-white relative overflow-hidden px-6">
            {/* Decorative background elements */}
            <div className="absolute inset-0 opacity-10 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-ub-gold/20 blur-[120px] rounded-full" />
            </div>

            <div className="relative z-10 text-center max-w-md mx-auto">
                <div className="w-24 h-24 bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl flex items-center justify-center mx-auto mb-8 relative group transition-transform duration-700 hover:rotate-12">
                    <ShieldAlert className="w-10 h-10 text-rose-500 group-hover:scale-110 transition-transform" />
                    <div className="absolute -inset-1 bg-rose-500/20 blur rounded-3xl -z-10 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>

                <h1 className="text-[80px] font-black tracking-tighter leading-none text-white mb-2 select-none">
                    403
                </h1>
                
                <h2 className="text-xl font-bold uppercase tracking-widest text-gray-300 mb-4">
                    Akses Ditolak
                </h2>
                
                <p className="text-gray-500 text-sm font-medium leading-relaxed mb-10">
                    Maaf, Anda tidak memiliki hak akses administrator yang memadai untuk melihat halaman yang Anda tuju.
                </p>

                <div className="flex flex-col gap-4">
                    <Link 
                        href="/admin/login" 
                        className="w-full inline-flex items-center justify-center gap-3 px-8 py-4 bg-ub-gold hover:bg-ub-gold/90 text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] transition-all duration-300 shadow-xl shadow-ub-gold/10 active:scale-95"
                    >
                        Kembali ke Login
                    </Link>
                    
                    <Link 
                        href="/" 
                        className="w-full inline-flex items-center justify-center gap-2 text-[10px] font-bold text-gray-500 hover:text-white transition-colors uppercase tracking-widest mt-2"
                    >
                        <ArrowLeft className="w-3 h-3" />
                        Ke Beranda Publik
                    </Link>
                </div>
            </div>
        </div>
    );
}
