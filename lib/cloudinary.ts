import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
    api_key: process.env.CLOUDINARY_API_KEY!,
    api_secret: process.env.CLOUDINARY_API_SECRET!,
    secure: true,
});

export default cloudinary;

/**
 * Upload file (Buffer) ke Cloudinary
 * @param buffer   - ArrayBuffer dari file yang diupload
 * @param folder   - folder tujuan di Cloudinary (e.g. 'ub-merch/products')
 * @param publicId - (opsional) public_id kustom
 * @returns URL gambar yang sudah di-upload
 */
export async function uploadToCloudinary(
    buffer: ArrayBuffer,
    folder: string,
    publicId?: string
): Promise<string> {
    return new Promise((resolve, reject) => {
        const uploadOptions: Record<string, unknown> = {
            folder,
            resource_type: 'image' as const,
            transformation: [
                { quality: 'auto:good' },
                { fetch_format: 'auto' },
            ],
        };

        if (publicId) {
            uploadOptions.public_id = publicId;
            uploadOptions.overwrite = true;
        }

        cloudinary.uploader
            .upload_stream(uploadOptions, (error, result) => {
                if (error || !result) {
                    reject(error ?? new Error('Upload ke Cloudinary gagal'));
                    return;
                }
                resolve(result.secure_url);
            })
            .end(Buffer.from(buffer));
    });
}

/**
 * Hapus gambar dari Cloudinary berdasarkan URL-nya
 * @param url - URL lengkap Cloudinary
 */
export async function deleteFromCloudinary(url: string): Promise<void> {
    try {
        // Ekstrak public_id dari URL Cloudinary
        // Format: https://res.cloudinary.com/<cloud>/image/upload/v<ver>/<folder>/<filename>
        const regex = /\/upload\/(?:v\d+\/)?(.+)\.[a-z]+$/i;
        const match = url.match(regex);
        if (!match) return;

        const publicId = match[1];
        await cloudinary.uploader.destroy(publicId);
    } catch (err) {
        console.error('[deleteFromCloudinary] Gagal menghapus gambar:', err);
    }
}
