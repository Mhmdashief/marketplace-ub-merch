'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Loader2, ArrowRight, Check, ChevronDown } from 'lucide-react';

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
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | { target: { name: string; value: string } }) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleSubjectSelect = (value: string) => {
        setFormData(prev => ({ ...prev, subject: value }));
        setIsDropdownOpen(false);
    };

    const subjectOptions = [
        { value: 'custom-order', label: 'Custom Merchandise Order' },
        { value: 'product-inquiry', label: 'Product Question' },
        { value: 'partnership', label: 'Business Partnership' },
        { value: 'other', label: 'Other Inquiry' }
    ];

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
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
        >
            {/* Artistic Background Shape */}
            <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-ub-gold rounded-full blur-[80px] opacity-40 pointer-events-none" />

            <div className="bg-white rounded-[2rem] overflow-hidden shadow-[0_40px_100px_-20px_rgba(0,0,0,0.1)] border border-gray-100">

                {/* Header Section */}
                <div className="bg-[#0b1221] p-10 md:p-12 relative overflow-hidden text-center group">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-ub-gold via-yellow-400 to-ub-gold" />
                    <div className="absolute -right-10 -bottom-20 w-64 h-64 bg-ub-gold rounded-full blur-[100px] opacity-10 group-hover:opacity-20 transition-opacity duration-1000" />

                    <h3 className="text-3xl md:text-4xl font-black text-white mb-2 relative z-10">
                        Let's Talk Business
                    </h3>
                    <p className="text-gray-400 text-sm md:text-base max-w-sm mx-auto relative z-10">
                        Isi form di bawah untuk konsultasi gratis mengenai kebutuhan merchandise Anda.
                    </p>
                </div>

                {/* Form Body */}
                <form onSubmit={handleSubmit} className="p-10 md:p-12 space-y-8">

                    {/* Input Group: Identity */}
                    <div className="space-y-6">
                        <div className="group relative">
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className="peer w-full px-0 py-4 border-b-2 border-gray-200 bg-transparent text-ub-navy font-bold text-lg placeholder-transparent focus:border-ub-navy focus:outline-none transition-colors"
                                placeholder="Name"
                            />
                            <label htmlFor="name" className="absolute left-0 -top-3.5 text-gray-400 text-xs font-bold uppercase tracking-widest transition-all peer-placeholder-shown:text-base peer-placeholder-shown:font-medium peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-4 peer-focus:-top-3.5 peer-focus:text-ub-gold peer-focus:text-xs peer-focus:font-bold">
                                Your Name
                            </label>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="group relative">
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className="peer w-full px-0 py-4 border-b-2 border-gray-200 bg-transparent text-ub-navy font-bold text-lg placeholder-transparent focus:border-ub-navy focus:outline-none transition-colors"
                                    placeholder="Email"
                                />
                                <label htmlFor="email" className="absolute left-0 -top-3.5 text-gray-400 text-xs font-bold uppercase tracking-widest transition-all peer-placeholder-shown:text-base peer-placeholder-shown:font-medium peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-4 peer-focus:-top-3.5 peer-focus:text-ub-gold peer-focus:text-xs peer-focus:font-bold">
                                    Email Address
                                </label>
                            </div>
                            <div className="group relative">
                                <input
                                    type="tel"
                                    id="phone"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    required
                                    className="peer w-full px-0 py-4 border-b-2 border-gray-200 bg-transparent text-ub-navy font-bold text-lg placeholder-transparent focus:border-ub-navy focus:outline-none transition-colors"
                                    placeholder="Phone"
                                />
                                <label htmlFor="phone" className="absolute left-0 -top-3.5 text-gray-400 text-xs font-bold uppercase tracking-widest transition-all peer-placeholder-shown:text-base peer-placeholder-shown:font-medium peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-4 peer-focus:-top-3.5 peer-focus:text-ub-gold peer-focus:text-xs peer-focus:font-bold">
                                    Phone Number
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Input Group: Project Details */}
                    <div className="space-y-6 pt-4">
                        <div className="group relative">
                            {/* Backdrop for click outside */}
                            {isDropdownOpen && (
                                <div className="fixed inset-0 z-40" onClick={() => setIsDropdownOpen(false)} />
                            )}

                            {/* Custom Dropdown Trigger */}
                            <div
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                className={`w-full px-0 py-4 border-b-2 cursor-pointer flex items-center justify-between transition-colors ${isDropdownOpen || formData.subject ? 'border-ub-navy' : 'border-gray-200'}`}
                            >
                                <span className={`font-bold text-lg select-none ${formData.subject ? 'text-ub-navy' : 'text-transparent'}`}>
                                    {formData.subject ? subjectOptions.find(opt => opt.value === formData.subject)?.label : 'Select'}
                                </span>
                                <ChevronDown className={`w-5 h-5 text-ub-navy transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                            </div>

                            {/* Floating Label */}
                            <label className={`absolute left-0 transition-all pointer-events-none text-gray-400 font-bold uppercase tracking-widest ${formData.subject || isDropdownOpen ? '-top-3.5 text-xs text-ub-gold' : 'top-4 text-base font-medium'}`}>
                                What are you interested in?
                            </label>

                            {/* Dropdown Menu */}
                            <AnimatePresence>
                                {isDropdownOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        transition={{ duration: 0.2 }}
                                        className="absolute z-50 top-full left-0 w-full mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden py-2"
                                    >
                                        {subjectOptions.map((option) => (
                                            <div
                                                key={option.value}
                                                onClick={() => handleSubjectSelect(option.value)}
                                                className="px-6 py-3 cursor-pointer hover:bg-gray-50 flex items-center justify-between group/opt transition-colors"
                                            >
                                                <span className={`font-bold text-sm ${formData.subject === option.value ? 'text-ub-navy' : 'text-gray-500 group-hover/opt:text-ub-navy'}`}>
                                                    {option.label}
                                                </span>
                                                {formData.subject === option.value && <Check className="w-4 h-4 text-ub-gold" />}
                                            </div>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        <div className="group relative">
                            <textarea
                                id="message"
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                required
                                rows={4}
                                className="peer w-full px-0 py-4 border-b-2 border-gray-200 bg-transparent text-ub-navy font-bold text-lg placeholder-transparent focus:border-ub-navy focus:outline-none transition-colors resize-none"
                                placeholder="Message"
                            />
                            <label htmlFor="message" className="absolute left-0 -top-3.5 text-gray-400 text-xs font-bold uppercase tracking-widest transition-all peer-placeholder-shown:text-base peer-placeholder-shown:font-medium peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-4 peer-focus:-top-3.5 peer-focus:text-ub-gold peer-focus:text-xs peer-focus:font-bold">
                                Tell us about your project
                            </label>
                        </div>
                    </div>

                    {/* Submit Button Area */}
                    <div className="pt-6">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full group relative overflow-hidden bg-[#0b1221] text-white py-6 rounded-xl font-bold tracking-widest uppercase transition-all hover:shadow-2xl hover:shadow-ub-navy/30 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shimmer" />
                            <span className="relative flex items-center justify-center gap-3">
                                {isSubmitting ? 'Sending...' : 'Send Message'}
                                {!isSubmitting && <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-2" />}
                            </span>
                        </button>
                    </div>

                    {/* Status Feedback */}
                    {submitStatus === 'success' && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="bg-green-50 border border-green-100 p-4 rounded-lg flex items-center gap-3 text-green-800"
                        >
                            <Check className="w-5 h-5 flex-shrink-0" />
                            <p className="text-sm font-bold">Message sent! We&apos;ll be in touch soon.</p>
                        </motion.div>
                    )}
                </form>
            </div>
        </motion.div>
    );
}
