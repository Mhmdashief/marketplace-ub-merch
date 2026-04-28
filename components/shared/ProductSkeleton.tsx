export default function ProductSkeleton() {
    return (
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden animate-pulse">
            <div className="aspect-square bg-gray-200 animate-shimmer"></div>

            <div className="p-4 space-y-3">
                <div className="h-5 w-20 bg-gray-200 rounded-full"></div>

                <div className="h-6 bg-gray-200 rounded w-3/4"></div>

                <div className="h-7 bg-gray-200 rounded w-1/2"></div>

                <div className="h-10 bg-gray-200 rounded-full"></div>
            </div>
        </div>
    );
}

