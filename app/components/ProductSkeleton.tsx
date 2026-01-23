export default function ProductSkeleton() {
    return (
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden animate-pulse">
            {/* Image Skeleton */}
            <div className="aspect-square bg-gray-200 animate-shimmer"></div>

            {/* Content Skeleton */}
            <div className="p-4 space-y-3">
                {/* Category Badge */}
                <div className="h-5 w-20 bg-gray-200 rounded-full"></div>

                {/* Product Name */}
                <div className="h-6 bg-gray-200 rounded w-3/4"></div>

                {/* Price */}
                <div className="h-7 bg-gray-200 rounded w-1/2"></div>

                {/* Button */}
                <div className="h-10 bg-gray-200 rounded-full"></div>
            </div>
        </div>
    );
}
