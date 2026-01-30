'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Loader2 } from 'lucide-react';

export default function ContactForm() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate form submission (replace with actual API call)
        setTimeout(() => {
            setIsSubmitting(false);
            setSubmitStatus('success');
            setFormData({
                name: '',
                email: '',
                phone: '',
                subject: '',
                message: ''
            });

            // Reset status after 5 seconds
            setTimeout(() => {
                setSubmitStatus('idle');
            }, 5000);
        }, 2000);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 border border-gray-100"
        >
            <h3 className="text-3xl font-bold text-ub-navy mb-6">
                Kirim Pesan
            </h3>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name Field */}
                <div>
                    <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                        Nama Lengkap *
                    </label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-ub-navy focus:ring-2 focus:ring-ub-navy/20 outline-none transition-all"
                        placeholder="Masukkan nama lengkap Anda"
                    />
                </div>

                {/* Email Field */}
                <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                        Email *
                    </label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-ub-navy focus:ring-2 focus:ring-ub-navy/20 outline-none transition-all"
                        placeholder="nama@email.com"
                    />
                </div>

                {/* Phone Field */}
                <div>
                    <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                        Nomor Telepon *
                    </label>
                    <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-ub-navy focus:ring-2 focus:ring-ub-navy/20 outline-none transition-all"
                        placeholder="08xxxxxxxxxx"
                    />
                </div>

                {/* Subject Field */}
                <div>
                    <label htmlFor="subject" className="block text-sm font-semibold text-gray-700 mb-2">
                        Subjek *
                    </label>
                    <select
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-ub-navy focus:ring-2 focus:ring-ub-navy/20 outline-none transition-all"
                    >
                        <option value="">Pilih subjek</option>
                        <option value="custom-order">Custom Order</option>
                        <option value="product-inquiry">Pertanyaan Produk</option>
                        <option value="partnership">Kerjasama</option>
                        <option value="complaint">Keluhan</option>
                        <option value="other">Lainnya</option>
                    </select>
                </div>

                {/* Message Field */}
                <div>
                    <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2">
                        Pesan *
                    </label>
                    <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows={6}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-ub-navy focus:ring-2 focus:ring-ub-navy/20 outline-none transition-all resize-none"
                        placeholder="Tulis pesan Anda di sini..."
                    />
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-ub-navy to-ub-dark-navy text-white font-bold py-4 px-8 rounded-xl hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    {isSubmitting ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Mengirim...
                        </>
                    ) : (
                        <>
                            <Send className="w-5 h-5" />
                            Kirim Pesan
                        </>
                    )}
                </button>

                {/* Success Message */}
                {submitStatus === 'success' && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-xl"
                    >
                        ✅ Pesan Anda berhasil dikirim! Kami akan segera menghubungi Anda.
                    </motion.div>
                )}

                {/* Error Message */}
                {submitStatus === 'error' && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-xl"
                    >
                        ❌ Terjadi kesalahan. Silakan coba lagi atau hubungi kami via WhatsApp.
                    </motion.div>
                )}
            </form>
        </motion.div>
    );
}
