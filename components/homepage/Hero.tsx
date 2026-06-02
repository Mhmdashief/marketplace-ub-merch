import Link from 'next/link';
import { FaLongArrowAltRight } from "react-icons/fa";

export default function Hero() {
    return (
        <section className="relative bg-black overflow-hidden">

            {/* Decorative Grid Pattern */}
            <div className="absolute inset-0 opacity-[0.03] sm:opacity-5">
                <div
                    className="absolute inset-0"
                    style={{
                        backgroundImage: `
                            linear-gradient(to right, white 1px, transparent 1px),
                            linear-gradient(to bottom, white 1px, transparent 1px)
                        `,
                        backgroundSize: '32px 32px'
                    }}
                />
            </div>

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black opacity-95 sm:opacity-90"></div>

            <div className="relative max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-40">

                <div className="text-center space-y-6 sm:space-y-8">

                    {/* ===== HEADLINE ===== */}
                    <h1 className="text-3xl sm:text-5xl lg:text-7xl font-bold text-white leading-[1.15] sm:leading-tight tracking-tight">
                        Official Merchandise
                        <span className="block mt-2 sm:mt-3 bg-gradient-to-r from-white via-gray-300 to-white bg-clip-text text-transparent">
                            Universitas Brawijaya
                        </span>
                    </h1>

                    {/* ===== SUB HEADLINE ===== */}
                    <p className="max-w-md sm:max-w-2xl lg:max-w-3xl mx-auto text-base sm:text-lg lg:text-xl text-gray-300 leading-relaxed px-2 sm:px-0">
                        Koleksi merchandise official kualitas terbaik untuk mahasiswa dan alumni.
                        <span className="block mt-2">
                            Tunjukkan kebanggaanmu sebagai bagian dari keluarga besar UB!
                        </span>
                    </p>

                    <div className="flex justify-center pt-4 sm:pt-6">
                        <Link
                            href="/merchandise"
                            className="group inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-white hover:bg-gray-100 text-black text-sm sm:text-base font-semibold rounded-full transition-all transform active:scale-95 sm:hover:scale-105 shadow-lg hover:shadow-white/20"
                        >
                            <span>Belanja Sekarang</span>
                            <FaLongArrowAltRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                </div>
            </div>

            {/* Bottom Fade */}
            <div className="absolute bottom-0 left-0 right-0 h-20 sm:h-28 lg:h-32 bg-gradient-to-t from-white to-transparent"></div>
        </section>
    );
}