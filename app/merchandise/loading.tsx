export default function MerchandiseLoading() {
    return (
        <div className="min-h-screen bg-white">
            {/* Hero skeleton */}
            <div className="relative pt-32 pb-24 bg-[#050505]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="w-48 h-7 bg-white/10 rounded-full mx-auto mb-10 animate-pulse" />
                    <div className="w-[400px] h-[100px] bg-white/10 rounded-xl mx-auto mb-8 animate-pulse" />
                    <div className="w-[500px] max-w-full h-5 bg-white/10 rounded mx-auto animate-pulse" />
                </div>
            </div>

            {/* Product grid skeleton */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                {/* Filter bar skeleton */}
                <div className="flex flex-wrap gap-3 mb-10">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="h-10 w-28 bg-gray-100 rounded-full animate-pulse" />
                    ))}
                </div>

                {/* Cards grid skeleton */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                    {[...Array(12)].map((_, i) => (
                        <div key={i} className="flex flex-col gap-3">
                            <div className="aspect-square bg-gray-100 rounded-2xl animate-shimmer" />
                            <div className="h-4 w-3/4 bg-gray-100 rounded animate-pulse" />
                            <div className="h-4 w-1/2 bg-gray-100 rounded animate-pulse" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
