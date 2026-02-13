// components/admin/StatsCard.tsx
import { LucideIcon } from "lucide-react";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

interface StatsCardProps {
    name: string;
    value: string;
    icon: LucideIcon;
    change: string;
    changeType: "increase" | "decrease";
    color: "blue" | "green" | "purple" | "orange";
}

const colorConfig = {
    blue: {
        iconBg: "bg-ub-navy/10",
        iconText: "text-ub-navy",
        accent: "border-ub-navy/20",
    },
    green: {
        iconBg: "bg-emerald-50",
        iconText: "text-emerald-600",
        accent: "border-emerald-200",
    },
    purple: {
        iconBg: "bg-violet-50",
        iconText: "text-violet-600",
        accent: "border-violet-200",
    },
    orange: {
        iconBg: "bg-ub-gold/10",
        iconText: "text-ub-gold",
        accent: "border-ub-gold/20",
    },
};

export default function StatsCard({
    name,
    value,
    icon: Icon,
    change,
    changeType,
    color,
}: StatsCardProps) {
    const theme = colorConfig[color];

    return (
        <div className="group bg-white rounded-3xl shadow-sm hover:shadow-[0_20px_50px_rgba(0,0,0,0.05)] transition-all duration-500 overflow-hidden border border-gray-100 p-6 flex flex-col justify-between relative">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-gray-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-bl-[100px]"></div>

            <div className="flex items-start justify-between relative z-10">
                <div className={`p-4 rounded-2xl ${theme.iconBg} transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3`}>
                    <Icon className={`h-6 w-6 ${theme.iconText}`} />
                </div>
                <div
                    className={`flex items-center px-2 py-1 rounded-lg text-[10px] font-black tracking-wider uppercase ${changeType === "increase" ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
                        }`}
                >
                    {changeType === "increase" ? (
                        <ArrowUpRight className="h-3 w-3 mr-0.5" />
                    ) : (
                        <ArrowDownRight className="h-3 w-3 mr-0.5" />
                    )}
                    {change}
                </div>
            </div>

            <div className="mt-8 relative z-10">
                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">{name}</h3>
                <p className="mt-1 text-3xl font-black text-[#001a33] tracking-tight group-hover:translate-x-1 transition-transform duration-300">
                    {value}
                </p>
            </div>

            <div className={`absolute bottom-0 left-0 w-full h-1 bg-gray-50 group-hover:${theme.iconBg} transition-colors duration-500`}></div>
        </div>
    );
}
