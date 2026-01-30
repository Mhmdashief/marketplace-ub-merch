import Link from 'next/link';
import { FaLongArrowAltRight } from "react-icons/fa";

export default function Hero() {
    return (
        <section className="relative bg-black overflow-hidden">
            {/* Decorative Grid Pattern */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute inset-0" style={{
                    backgroundImage: `linear-gradient(to right, white 1px, transparent 1px),
                           linear-gradient(to bottom, white 1px, transparent 1px)`,
                    backgroundSize: '40px 40px'
                }}></div>
            </div>

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black opacity-90"></div>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 lg:py-40">
                <div className="text-center space-y-8 animate-fade-in">
                    {/* Main Headline */}
                    <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-tight tracking-tight">
                        Official Merchandise
                        <span className="block mt-3 bg-gradient-to-r from-white via-gray-200 to-white bg-clip-text text-transparent">
                            Universitas Brawijaya
                        </span>
                    </h1>

                    {/* Sub-headline */}
                    <p className="max-w-3xl mx-auto text-lg sm:text-xl text-gray-300 leading-relaxed">
                        Koleksi merchandise official kualitas terbaik untuk mahasiswa dan alumni.
                        <span className="block mt-2">
                            Tunjukkan kebanggaanmu sebagai bagian dari keluarga besar UB!
                        </span>
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
                        <Link
                            href="/merchandise"
                            className="group w-full sm:w-auto px-8 py-4 bg-white hover:bg-gray-100 text-black font-semibold rounded-full transition-all transform hover:scale-105 shadow-2xl hover:shadow-white/20 flex items-center justify-center gap-2"
                        >
                            <span>Belanja Sekarang</span>
                            <FaLongArrowAltRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-8 pt-16 max-w-4xl mx-auto">
                        <div className="text-center group">
                            <div className="text-4xl sm:text-5xl font-bold text-white mb-2 group-hover:scale-110 transition-transform">
                                500+
                            </div>
                            <div className="text-sm sm:text-base text-gray-400 uppercase tracking-wider">
                                Produk
                            </div>
                        </div>
                        <div className="text-center border-x border-white/10 group">
                            <div className="text-4xl sm:text-5xl font-bold text-white mb-2 group-hover:scale-110 transition-transform">
                                10K+
                            </div>
                            <div className="text-sm sm:text-base text-gray-400 uppercase tracking-wider">
                                Pelanggan
                            </div>
                        </div>
                        <div className="text-center group">
                            <div className="text-4xl sm:text-5xl font-bold text-white mb-2 group-hover:scale-110 transition-transform">
                                4.9
                            </div>
                            <div className="text-sm sm:text-base text-gray-400 uppercase tracking-wider">
                                Rating
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Fade */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent"></div>
        </section>
    );
}
