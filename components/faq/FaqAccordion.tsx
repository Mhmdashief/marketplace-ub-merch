'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';

interface FaqItem {
    question: string;
    answer: React.ReactNode;
}

const faqData: FaqItem[] = [
    {
        question: "Bagaimana cara melakukan pemesanan?",
        answer: (
            <span>
                Cara pemesanan silahkan menuju ke laman <a href="merchandise" className="text-ub-gold font-bold hover:underline">merchandise</a>
            </span>
        )
    },
    {
        question: "Bagaimana cara melacak pesanan?",
        answer: (
            <span>
                Apabila anda sudah mendapatkan nomor resi, silahkan lacak pesanan anda di <a href="#" target="_blank" rel="noopener noreferrer" className="text-ub-gold font-bold hover:underline">cekresi.com</a> dan masukan nomor resi yang telah kami berikan.
            </span>
        )
    },
    {
        question: "Kemana saya harus membayar pesanan?",
        answer: "Kami menyediakan berbagai metode pembayaran yaitu transfer bank, transfer virtual account, dan transfer QR code."
    },
    {
        question: "Berapa lama batas waktu pembayaran pesanan?",
        answer: "Batas waktu pesanan anda 1x24 jam, jika melebihi batas waktu pembayaran maka pesanan anda akan otomatis batal."
    },
    {
        question: "Kapan pesanan dikirim?",
        answer: "Pesanan akan dikirim setelah kami menerima konfirmasi pembayaran yang dilakukan dalam waktu 1x24 jam. Pengiriman dapat dilakukan pada hari yang sama atau keesokan harinya."
    },
    {
        question: "Bagaimana kebijakan pengembalian atau penukaran barang?",
        answer: (
            <span>
                Silahkan <a href="#" className="text-ub-gold font-bold hover:underline">klik disini</a> untuk info yang lebih lengkap tentang kebijakan pengembalian atau penukaran barang.
            </span>
        )
    },
    {
        question: "Bagaimana cara melakukan pemesanan custom design?",
        answer: (
            <span>
                Cara pemesanan custom design silahkan <a href="contact" className="text-ub-gold font-bold hover:underline">klik disini</a>. Harap isi data diri dan data order dengan benar agar tidak terjadi kesalahan pesanan.
            </span>
        )
    },
    {
        question: "Bagaimana cara melakukan pemesanan creative service?",
        answer: (
            <span>
                Cara pemesanan creative service silahkan <a href="contact" className="text-ub-gold font-bold hover:underline">klik disini</a>. Harap isi data diri dan data order dengan benar agar tidak terjadi kesalahan pesanan.
            </span>
        )
    }
];

export default function FaqAccordion() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    const toggleAccordion = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="space-y-4">
                {faqData.map((item, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                        className={`border border-gray-100 rounded-3xl overflow-hidden transition-all duration-300 ${openIndex === index ? 'bg-white shadow-xl shadow-ub-navy/5 border-ub-gold/20' : 'bg-gray-50 hover:bg-white hover:shadow-md'
                            }`}
                    >
                        <button
                            onClick={() => toggleAccordion(index)}
                            className="w-full flex items-center justify-between p-6 md:p-8 text-left"
                        >
                            <span className={`text-lg md:text-xl font-bold pr-8 transition-colors ${openIndex === index ? 'text-ub-navy' : 'text-gray-700'
                                }`}>
                                {item.question}
                            </span>
                            <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${openIndex === index ? 'bg-ub-gold text-white rotate-180' : 'bg-gray-200 text-gray-500'
                                }`}>
                                {openIndex === index ? <Minus size={20} /> : <Plus size={20} />}
                            </div>
                        </button>

                        <AnimatePresence initial={false}>
                            {openIndex === index && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.3, ease: "easeInOut" }}
                                >
                                    <div className="p-6 md:p-8 pt-0 text-gray-500 leading-relaxed border-t border-dashed border-gray-100 mx-6 md:mx-8 mt-2">
                                        {item.answer}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
