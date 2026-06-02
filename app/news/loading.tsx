export default function NewsLoading() {
    return (
        <div className="min-h-screen bg-white">
            {/* Hero skeleton */}
            <div className="relative pt-32 pb-20 bg-ub-navy">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="w-64 h-8 bg-white/10 rounded mx-auto mb-6 animate-pulse" />
                    <div className="w-96 max-w-full h-4 bg-white/10 rounded mx-auto animate-pulse" />
                </div>
            </div>

            {/* Articles skeleton */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-16">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="flex flex-col gap-4">
                            <div className="aspect-[4/3] w-full bg-gray-100 rounded-2xl animate-shimmer" />
                            <div className="h-3 w-1/3 bg-gray-100 rounded animate-pulse" />
                            <div className="h-6 w-full bg-gray-100 rounded animate-pulse" />
                            <div className="h-6 w-4/5 bg-gray-100 rounded animate-pulse" />
                            <div className="h-4 w-2/3 bg-gray-100 rounded animate-pulse" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
