// app/admin/reports/page.tsx
import { FileText } from "lucide-react";

export default function ReportsPage() {
    return (
        <div className="space-y-10 py-2">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b border-white/5 pb-10">
                <div className="flex items-center gap-6">
                    <div className="p-5 bg-ub-gold rounded-[24px] shadow-xl shadow-ub-gold/20">
                        <FileText className="h-8 w-8 text-white" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-8 h-[2px] bg-ub-gold"></div>
                            <span className="text-[10px] font-black text-ub-gold uppercase tracking-[0.3em]">
                                Intelligence
                            </span>
                        </div>
                        <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic">
                            Reports <span className="text-white/10">/</span> Analytics
                        </h1>
                    </div>
                </div>
            </div>

            {/* Content Placeholder */}
            <div className="bg-[#001a33] rounded-[40px] shadow-2xl border border-white/5 p-20">
                <div className="text-center">
                    <div className="relative inline-block mb-8">
                        <div className="absolute inset-0 bg-ub-gold/20 blur-3xl rounded-full"></div>
                        <FileText className="h-24 w-24 text-ub-gold mx-auto relative z-10 animate-bounce" />
                    </div>
                    <h3 className="text-3xl font-black text-white tracking-tighter italic uppercase mb-4">
                        Data <span className="text-ub-gold">Processing</span>
                    </h3>
                    <p className="text-gray-500 max-w-md mx-auto font-bold uppercase text-[10px] tracking-widest leading-relaxed">
                        This section will provide detailed sales reports, analytics, and insights
                        about your store performance. High-performance computing in progress.
                    </p>
                </div>
            </div>
        </div>
    );
}
