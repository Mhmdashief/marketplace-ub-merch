import Link from 'next/link';
import { FaLongArrowAltRight, FaStar } from "react-icons/fa";

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

                    <div className="pt-16 flex justify-center">
                        <div className="relative group cursor-default">
                            {/* Glow Effect */}
                            <div className="absolute -inset-6 bg-gradient-to-r from-yellow-500/0 via-yellow-500/10 to-yellow-500/0 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                            <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl px-8 py-6 flex flex-col items-center transform transition-all duration-300 hover:scale-105 hover:bg-white/10 hover:border-white/20">
                                <div className="flex items-center gap-3 mb-2">
                                    <span className="text-5xl sm:text-6xl font-bold text-white tracking-tight">
                                        5.0
                                    </span>
                                    <FaStar className="w-8 h-8 text-yellow-400 drop-shadow-[0_0_15px_rgba(250,204,21,0.6)] animate-pulse" />
                                </div>
                                <div className="flex flex-col items-center gap-1">
                                    <div className="flex gap-1 mb-1">
                                        {[...Array(5)].map((_, i) => (
                                            <FaStar key={i} className={`w-3 h-3 ${i < 5 ? 'text-yellow-400' : 'text-gray-600'}`} />
                                        ))}
                                    </div>
                                    <span className="text-sm font-medium text-gray-300 uppercase tracking-[0.2em] group-hover:text-white transition-colors">
                                        Average Rating
                                    </span>
                                </div>
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
