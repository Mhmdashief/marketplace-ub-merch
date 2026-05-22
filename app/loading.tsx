export default function RootLoading() {
    return (
        <div className="min-h-screen bg-white flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-ub-navy border-t-ub-gold rounded-full animate-spin" />
                <p className="text-ub-navy text-sm font-semibold tracking-widest uppercase">Memuat...</p>
            </div>
        </div>
    );
}
