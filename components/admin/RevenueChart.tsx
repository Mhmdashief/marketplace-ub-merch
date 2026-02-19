'use client';

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { useState } from 'react';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

const weeklyData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
        {
            label: 'Revenue',
            data: [120000, 190000, 150000, 250000, 220000, 300000, 280000],
            borderColor: '#3b82f6', // Bright blue
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            fill: true,
            tension: 0.4,
            borderWidth: 3,
            pointBackgroundColor: '#001a33',
            pointBorderColor: '#3b82f6',
            pointBorderWidth: 2,
            pointHoverRadius: 6,
        },
    ],
};

const monthlyData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
        {
            label: 'Revenue',
            data: [4500000, 5200000, 4800000, 6100000, 5900000, 6800000, 7200000, 6900000, 7500000, 8100000, 8900000, 9500000],
            borderColor: '#D4AF37', // UB Gold
            backgroundColor: 'rgba(212, 175, 55, 0.1)',
            fill: true,
            tension: 0.4,
            borderWidth: 3,
            pointBackgroundColor: '#001a33',
            pointBorderColor: '#D4AF37',
            pointBorderWidth: 2,
            pointHoverRadius: 6,
        },
    ],
};

export default function RevenueChart() {
    const [period, setPeriod] = useState<'weekly' | 'monthly'>('weekly');

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                mode: 'index' as const,
                intersect: false,
                padding: 16,
                backgroundColor: '#000d1a',
                titleColor: '#ffffff',
                titleFont: { size: 14, weight: 'bold' as any },
                bodyColor: '#9CA3AF',
                bodyFont: { size: 13 },
                borderColor: 'rgba(255, 255, 255, 0.1)',
                borderWidth: 1,
                cornerRadius: 12,
                displayColors: false,
                callbacks: {
                    label: function (context: any) {
                        return 'Earnings: ' + new Intl.NumberFormat('id-ID', {
                            style: 'currency',
                            currency: 'IDR',
                            minimumFractionDigits: 0
                        }).format(context.parsed.y);
                    }
                }
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    display: true,
                    color: 'rgba(255, 255, 255, 0.05)',
                },
                border: {
                    display: false,
                },
                ticks: {
                    callback: function (value: any) {
                        return 'Rp ' + (value / 1000000).toFixed(1) + 'M';
                    },
                    color: '#4B5563',
                    font: { size: 11, weight: 'bold' as any },
                    padding: 10,
                }
            },
            x: {
                grid: {
                    display: false,
                },
                border: {
                    display: false,
                },
                ticks: {
                    color: '#4B5563',
                    font: { size: 11, weight: 'bold' as any },
                    padding: 10,
                }
            },
        },
    };

    return (
        <div className="bg-[#001a33] rounded-[32px] shadow-2xl border border-white/5 p-8 transition-all duration-500 hover:shadow-black/20">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
                <div>
                    <h2 className="text-sm font-black text-gray-500 uppercase tracking-[0.2em] mb-1">Financial Performance</h2>
                    <h3 className="text-2xl font-black text-white tracking-tight">Revenue Analytics</h3>
                </div>
                <div className="flex bg-black/20 p-1.5 rounded-2xl border border-white/5">
                    <button
                        onClick={() => setPeriod('weekly')}
                        className={`px-6 py-2.5 text-xs font-black uppercase tracking-widest rounded-xl transition-all duration-300 ${period === 'weekly'
                            ? 'bg-ub-gold text-white shadow-lg'
                            : 'text-gray-500 hover:text-white hover:bg-white/5'
                            }`}
                    >
                        Weekly
                    </button>
                    <button
                        onClick={() => setPeriod('monthly')}
                        className={`px-6 py-2.5 text-xs font-black uppercase tracking-widest rounded-xl transition-all duration-300 ${period === 'monthly'
                            ? 'bg-ub-gold text-white shadow-lg'
                            : 'text-gray-500 hover:text-white hover:bg-white/5'
                            }`}
                    >
                        Monthly
                    </button>
                </div>
            </div>
            <div className="h-[350px] w-full">
                <Line data={period === 'weekly' ? weeklyData : monthlyData} options={options} />
            </div>
        </div>
    );
}
