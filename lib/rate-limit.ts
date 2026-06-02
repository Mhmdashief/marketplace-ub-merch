type RateLimitInfo = {
    count: number;
    reset: number;
};

const storage = new Map<string, RateLimitInfo>();
export async function rateLimit(
    identifier: string,
    limit: number,
    windowMs: number
) {
    const now = Date.now();

    if (storage.size > 5000) {
        for (const [key, value] of storage.entries()) {
            if (now > value.reset) {
                storage.delete(key);
            }
        }
    }

    const current = storage.get(identifier);

    if (!current || now > current.reset) {
        storage.set(identifier, {
            count: 1,
            reset: now + windowMs,
        });

        return {
            success: true,
            limit,
            remaining: limit - 1,
            reset: now + windowMs,
        };
    }

    if (current.count >= limit) {
        return {
            success: false,
            limit,
            remaining: 0,
            reset: current.reset,
        };
    }

    current.count += 1;
    return {
        success: true,
        limit,
        remaining: limit - current.count,
        reset: current.reset,
    };
}
