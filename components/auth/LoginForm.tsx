'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Mail, Lock, Eye, EyeOff, LogIn, Loader2, ShieldAlert, ArrowRight, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { checkAdminEmail } from '@/app/actions/user';

export default function LoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const isBlocked = searchParams.get('blocked') === 'true';
    const reason = searchParams.get('reason');
    const getInitialError = () => {
        if (isBlocked) return 'Akun Anda diblokir atau tidak aktif.';
        if (reason === 'another_tab') return 'Sesi Anda telah diakhiri karena login baru di tab lain.';
        if (reason === 'browser_closed') return 'Sesi Anda telah berakhir. Silakan masuk kembali.';
        return '';
    };

    const [formData, setFormData] = useState({ email: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState(getInitialError());
    const [isLoading, setIsLoading] = useState(false);
    const [step, setStep] = useState(1); // 1: Email, 2: Password

    const handleNextStep = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            setError('Format email tidak valid.');
            return;
        }

        setIsLoading(true);
        try {
            const check = await checkAdminEmail(formData.email);
            if (!check.success) {
                setError(check.error || 'Email tidak terdaftar atau tidak memiliki akses.');
                setIsLoading(false);
                return;
            }
            setStep(2);
        } catch (err) {
            console.error('[checkAdminEmail] Error:', err);
            setError('Terjadi kesalahan. Silakan coba lagi.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleBack = () => {
        setStep(1);
        setError('');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const result = await signIn('credentials', {
                email: formData.email,
                password: formData.password,
                redirect: false,
            });

            if (result?.error) {
                setError('Password salah. Silakan coba lagi.');
                setIsLoading(false);
                return;
            }
            const tabId = Date.now().toString() + "-" + Math.random().toString(36).substring(2, 9);
            sessionStorage.setItem('my_tab_session_id', tabId);
            localStorage.setItem('admin_active_tab_session_id', tabId);
            sessionStorage.setItem('admin_active_session', 'true');
            router.push('/admin');
            router.refresh();
        } catch (err) {
            console.error('[LoginForm] Error:', err);
            setError('Terjadi kesalahan. Silakan coba lagi.');
            setIsLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-[#000d1a] to-slate-900 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-6">
                {/* Card */}
                <div className="bg-white/5 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/10">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="flex justify-center mb-6">
                            <div className="bg-white rounded-2xl p-4">
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
                                Admin Panel
                            </span>
                        </div>
                        <h1 className="text-2xl font-bold text-white">
                            Masuk ke Dashboard
                        </h1>
                        <p className="text-white/50 text-sm mt-1">
                            Akses terbatas hanya untuk administrator
                        </p>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="mb-6 bg-red-500/10 border border-red-500/30 p-4 rounded-xl">
                            <p className="text-sm text-red-400 text-center">{error}</p>
                        </div>
                    )}

                    {/* Form */}
                    <form className="overflow-hidden" onSubmit={step === 1 ? handleNextStep : handleSubmit}>
                        <AnimatePresence mode="wait" initial={false}>
                            {step === 1 ? (
                                <motion.div
                                    key="step1"
                                    initial={{ x: -50, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    exit={{ x: 50, opacity: 0 }}
                                    transition={{ duration: 0.2, ease: 'easeInOut' }}
                                    className="space-y-5 animate-in fade-in zoom-in-95 duration-200"
                                >
                                    {/* Email Input */}
                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium text-white/70 mb-2">
                                            Alamat Email
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <Mail className="h-5 w-5 text-white/30" />
                                            </div>
                                            <input
                                                id="email"
                                                name="email"
                                                type="email"
                                                autoComplete="email"
                                                required
                                                value={formData.email}
                                                onChange={handleChange}
                                                className="block w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500/50 transition-all duration-200"
                                                placeholder="admin@ubmerch.ac.id"
                                            />
                                        </div>
                                    </div>

                                    {/* Next Button */}
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-full flex justify-center items-center py-3 px-4 border border-transparent text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transition-all duration-200 shadow-lg hover:shadow-yellow-500/25 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                                    >
                                        {isLoading ? (
                                            <>
                                                <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5" />
                                                Memeriksa...
                                            </>
                                        ) : (
                                            <>
                                                Lanjutkan
                                                <ArrowRight className="ml-2 h-4 w-4" />
                                            </>
                                        )}
                                    </button>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="step2"
                                    initial={{ x: 50, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    exit={{ x: -50, opacity: 0 }}
                                    transition={{ duration: 0.2, ease: 'easeInOut' }}
                                    className="space-y-5"
                                >
                                    {/* Back Button & Email Info */}
                                    <div className="flex items-center justify-between bg-white/5 rounded-xl p-3 border border-white/5">
                                        <div className="flex flex-col min-w-0">
                                            <span className="text-[10px] uppercase tracking-wider text-white/40">Email Terverifikasi</span>
                                            <span className="text-sm font-medium text-white/80 truncate">{formData.email}</span>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={handleBack}
                                            className="flex items-center gap-1 text-xs text-yellow-400 hover:text-yellow-300 font-medium transition-colors cursor-pointer py-1 px-2 hover:bg-white/5 rounded-lg shrink-0"
                                        >
                                            <ArrowLeft className="h-3 w-3" />
                                            Ubah
                                        </button>
                                    </div>

                                    {/* Password Input */}
                                    <div>
                                        <label htmlFor="password" className="block text-sm font-medium text-white/70 mb-2">
                                            Password
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <Lock className="h-5 w-5 text-white/30" />
                                            </div>
                                            <input
                                                id="password"
                                                name="password"
                                                type={showPassword ? 'text' : 'password'}
                                                autoComplete="current-password"
                                                required
                                                autoFocus
                                                value={formData.password}
                                                onChange={handleChange}
                                                className="block w-full pl-12 pr-12 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500/50 transition-all duration-200 [&::-ms-reveal]:hidden"
                                                placeholder="••••••••"
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

                                    {/* Forgot Password */}
                                    <div className="flex justify-end">
                                        <Link
                                            href="/auth/forgot-password"
                                            className="text-sm text-yellow-400/80 hover:text-yellow-400 transition-colors"
                                        >
                                            Lupa password?
                                        </Link>
                                    </div>

                                    {/* Submit Button */}
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-full flex justify-center items-center py-3 px-4 border border-transparent text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transition-all duration-200 shadow-lg hover:shadow-yellow-500/25 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                                    >
                                        {isLoading ? (
                                            <>
                                                <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5" />
                                                Memverifikasi...
                                            </>
                                        ) : (
                                            <>
                                                <LogIn className="-ml-1 mr-3 h-5 w-5" />
                                                Masuk ke Admin Panel
                                            </>
                                        )}
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </form>
                </div>

                {/* Back to Home */}
                <div className="text-center">
                    <Link
                        href="/"
                        className="text-sm text-white/40 hover:text-white/70 transition-colors"
                    >
                        ← Kembali ke halaman utama
                    </Link>
                </div>
            </div>
        </div>
    );
}
