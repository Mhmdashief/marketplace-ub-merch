
"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
    Mail,
    Lock,
    Eye,
    EyeOff,
    Loader2,
    ShieldAlert,
    ArrowRight,
    ArrowLeft,
    KeyRound,
    CheckCircle2,
    RefreshCw
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ForgotPasswordPage() {
    const router = useRouter();
    const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password, 4: Success
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState<string[]>(new Array(6).fill(""));
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [countdown, setCountdown] = useState(0);
    const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (countdown > 0) {
            timer = setTimeout(() => setCountdown(countdown - 1), 1000);
        }
        return () => clearTimeout(timer);
    }, [countdown]);

    // Handle Request OTP (Step 1)
    const handleRequestOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError("Format email tidak valid.");
            return;
        }

        setLoading(true);

        try {
            const response = await fetch("/api/auth/forgot-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (data.success) {
                setStep(2);
                setCountdown(120); // 2 minutes countdown
            } else {
                setError(data.error || "Gagal mengirim OTP.");
            }
        } catch (err) {
            setError("Terjadi kesalahan, silakan coba lagi.");
        } finally {
            setLoading(false);
        }
    };

    // Handle Verify OTP (Step 2)
    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        const otpCode = otp.join("");
        if (otpCode.length < 6) {
            setError("Kode OTP harus 6 digit lengkap.");
            return;
        }

        setLoading(true);

        try {
            const response = await fetch("/api/auth/verify-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token: otpCode }),
            });

            const data = await response.json();

            if (data.success) {
                setStep(3);
            } else {
                setError(data.error || "Kode OTP salah atau sudah kedaluwarsa.");
            }
        } catch (err) {
            setError("Gagal memverifikasi OTP, silakan coba lagi.");
        } finally {
            setLoading(false);
        }
    };

    // Handle Reset Password (Step 3)
    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (password.length < 6) {
            setError("Password minimal 6 karakter.");
            return;
        }

        if (password !== confirmPassword) {
            setError("Konfirmasi password tidak cocok.");
            return;
        }

        setLoading(true);

        try {
            const response = await fetch("/api/auth/reset-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token: otp.join(""), password }),
            });

            const data = await response.json();

            if (data.success) {
                setStep(4);
                setTimeout(() => {
                    router.push("/admin/login");
                }, 4000);
            } else {
                setError(data.error || "Gagal mereset password.");
            }
        } catch (err) {
            setError("Terjadi kesalahan, silakan coba lagi.");
        } finally {
            setLoading(false);
        }
    };

    // Resend OTP
    const handleResendOtp = async () => {
        if (countdown > 0) return;
        setError("");
        setLoading(true);

        try {
            const response = await fetch("/api/auth/forgot-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (data.success) {
                setCountdown(120);
                setOtp(new Array(6).fill(""));
                if (otpRefs.current[0]) otpRefs.current[0].focus();
            } else {
                setError(data.error || "Gagal mengirim ulang OTP.");
            }
        } catch (err) {
            setError("Gagal mengirim ulang OTP, silakan coba lagi.");
        } finally {
            setLoading(false);
        }
    };

    const handleOtpChange = (value: string, index: number) => {
        if (isNaN(Number(value))) return;

        const newOtp = [...otp];
        // Hanya ambil digit terakhir jika copy-paste
        newOtp[index] = value.substring(value.length - 1);
        setOtp(newOtp);

        // Pindah fokus ke kotak berikutnya
        if (value !== "" && index < 5) {
            otpRefs.current[index + 1]?.focus();
        }
    };

    const handleOtpKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
        if (e.key === "Backspace" && otp[index] === "" && index > 0) {
            otpRefs.current[index - 1]?.focus();
        }
    };

    const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        const pasteData = e.clipboardData.getData("text").trim();

        if (pasteData.length === 6 && !isNaN(Number(pasteData))) {
            const pasteOtp = pasteData.split("");
            setOtp(pasteOtp);
            otpRefs.current[5]?.focus();
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-[#000d1a] to-slate-900 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-6">
                {/* Card */}
                <div className="bg-white/5 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/10 overflow-hidden relative">

                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="flex justify-center mb-6">
                            <div className="bg-white rounded-2xl p-4 shadow-lg">
                                <Image
                                    src="/images/reusable/Logo Ub Merch.png"
                                    alt="UB Merch Logo"
                                    width={120}
                                    height={120}
                                    className="w-28 h-auto"
                                    priority
                                />
                            </div>
                        </div>
                        <div className="flex items-center justify-center gap-2 mb-2">
                            <ShieldAlert className="h-5 w-5 text-yellow-400" />
                            <span className="text-xs font-semibold text-yellow-400 uppercase tracking-widest">
                                Admin Security
                            </span>
                        </div>
                        <h1 className="text-2xl font-bold text-white">
                            Reset Password OTP
                        </h1>
                        <p className="text-white/50 text-sm mt-1">
                            Sistem penyetelan sandi berbasis OTP yang lebih aman
                        </p>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="mb-6 bg-red-500/10 border border-red-500/30 p-4 rounded-xl animate-in fade-in duration-200">
                            <p className="text-sm text-red-400 text-center font-medium">{error}</p>
                        </div>
                    )}

                    <AnimatePresence mode="wait" initial={false}>
                        {step === 1 && (
                            <motion.div
                                key="step1"
                                initial={{ x: -100, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                exit={{ x: 100, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                <form onSubmit={handleRequestOtp} className="space-y-5">
                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium text-white/70 mb-2">
                                            Alamat Email Admin
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <Mail className="h-5 w-5 text-white/30" />
                                            </div>
                                            <input
                                                id="email"
                                                type="email"
                                                required
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                className="block w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500/50 transition-all duration-200"
                                                placeholder="admin@ubmerch.ac.id"
                                                disabled={loading}
                                            />
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full flex justify-center items-center py-3 px-4 border border-transparent text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transition-all duration-200 shadow-lg hover:shadow-yellow-500/25 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                                    >
                                        {loading ? (
                                            <>
                                                <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5" />
                                                Mengirim OTP...
                                            </>
                                        ) : (
                                            <>
                                                Kirim Kode OTP
                                                <ArrowRight className="ml-2 h-4 w-4" />
                                            </>
                                        )}
                                    </button>
                                </form>
                            </motion.div>
                        )}

                        {step === 2 && (
                            <motion.div
                                key="step2"
                                initial={{ x: 100, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                exit={{ x: -100, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                <form onSubmit={handleVerifyOtp} className="space-y-6">
                                    <div className="text-center">
                                        <p className="text-sm text-white/70">
                                            Kode OTP 6-digit dikirim ke email:
                                        </p>
                                        <p className="text-sm font-semibold text-yellow-400 mt-1 truncate">
                                            {email}
                                        </p>
                                    </div>

                                    {/* OTP Boxes */}
                                    <div className="flex justify-between gap-2">
                                        {otp.map((data, index) => (
                                            <input
                                                key={index}
                                                type="text"
                                                maxLength={1}
                                                ref={(el) => { otpRefs.current[index] = el; }}
                                                value={data}
                                                onChange={(e) => handleOtpChange(e.target.value, index)}
                                                onKeyDown={(e) => handleOtpKeyDown(e, index)}
                                                onPaste={handleOtpPaste}
                                                className="w-12 h-12 text-center text-xl font-bold bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500/50 transition-all"
                                                disabled={loading}
                                            />
                                        ))}
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full flex justify-center items-center py-3 px-4 border border-transparent text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transition-all duration-200 shadow-lg hover:shadow-yellow-500/25 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                                    >
                                        {loading ? (
                                            <>
                                                <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5" />
                                                Memverifikasi...
                                            </>
                                        ) : (
                                            <>
                                                Verifikasi OTP
                                                <ArrowRight className="ml-2 h-4 w-4" />
                                            </>
                                        )}
                                    </button>

                                    {/* Resend OTP */}
                                    <div className="text-center mt-4">
                                        {countdown > 0 ? (
                                            <p className="text-xs text-white/40">
                                                Kirim ulang OTP tersedia dalam <span className="font-semibold text-yellow-400/80">{countdown} detik</span>
                                            </p>
                                        ) : (
                                            <button
                                                type="button"
                                                onClick={handleResendOtp}
                                                disabled={loading}
                                                className="inline-flex items-center gap-1.5 text-xs text-yellow-400 hover:text-yellow-300 font-semibold cursor-pointer transition-colors"
                                            >
                                                <RefreshCw className="h-3.5 w-3.5" />
                                                Kirim Ulang Kode OTP
                                            </button>
                                        )}
                                    </div>
                                </form>
                            </motion.div>
                        )}

                        {step === 3 && (
                            <motion.div
                                key="step3"
                                initial={{ x: 100, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                exit={{ x: -100, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                <form onSubmit={handleResetPassword} className="space-y-5">
                                    <div className="flex items-center gap-2 p-3 bg-white/5 border border-white/5 rounded-xl text-xs text-white/50 mb-2">
                                        <KeyRound className="h-4 w-4 text-green-400 shrink-0" />
                                        <span>Identitas terverifikasi. Masukkan password baru Anda.</span>
                                    </div>

                                    {/* Password */}
                                    <div>
                                        <label htmlFor="password" className="block text-sm font-medium text-white/70 mb-2">
                                            Password Baru
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <Lock className="h-5 w-5 text-white/30" />
                                            </div>
                                            <input
                                                id="password"
                                                type={showPassword ? "text" : "password"}
                                                required
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                className="block w-full pl-12 pr-12 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500/50 transition-all duration-200 [&::-ms-reveal]:hidden"
                                                placeholder="Minimal 6 karakter"
                                                disabled={loading}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute inset-y-0 right-0 pr-4 flex items-center text-white/30 hover:text-white/60 transition-colors"
                                            >
                                                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Confirm Password */}
                                    <div>
                                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-white/70 mb-2">
                                            Konfirmasi Password Baru
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <Lock className="h-5 w-5 text-white/30" />
                                            </div>
                                            <input
                                                id="confirmPassword"
                                                type={showConfirmPassword ? "text" : "password"}
                                                required
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                className="block w-full pl-12 pr-12 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500/50 transition-all duration-200 [&::-ms-reveal]:hidden"
                                                placeholder="Ulangi password baru"
                                                disabled={loading}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                className="absolute inset-y-0 right-0 pr-4 flex items-center text-white/30 hover:text-white/60 transition-colors"
                                            >
                                                {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                            </button>
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full flex justify-center items-center py-3 px-4 border border-transparent text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transition-all duration-200 shadow-lg hover:shadow-yellow-500/25 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                                    >
                                        {loading ? (
                                            <>
                                                <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5" />
                                                Memproses...
                                            </>
                                        ) : (
                                            <>
                                                Setel Ulang Password
                                                <ArrowRight className="ml-2 h-4 w-4" />
                                            </>
                                        )}
                                    </button>
                                </form>
                            </motion.div>
                        )}

                        {step === 4 && (
                            <motion.div
                                key="step4"
                                initial={{ scale: 0.95, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ type: "spring", duration: 0.3 }}
                                className="text-center py-4 space-y-4"
                            >
                                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-500/10 border border-green-500/30">
                                    <CheckCircle2 className="h-10 w-10 text-green-400" />
                                </div>
                                <h2 className="text-2xl font-bold text-white">
                                    Password Diubah!
                                </h2>
                                <p className="text-white/60 text-sm">
                                    Sandi akun administrator Anda telah berhasil disetel ulang. Menghubungkan kembali ke panel masuk...
                                </p>
                                <div className="pt-2">
                                    <div className="w-8 h-8 border-2 border-slate-700 border-t-yellow-500 rounded-full animate-spin mx-auto"></div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Back to Login link (Only visible in early steps) */}
                {step < 4 && (
                    <div className="text-center">
                        <Link
                            href="/admin/login"
                            className="inline-flex items-center gap-1.5 text-sm text-white/40 hover:text-white/70 transition-colors"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Kembali ke Halaman Login
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
