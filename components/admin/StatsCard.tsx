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

const colorClasses = {
    blue: {
        bg: "from-blue-500 to-blue-600",
        light: "bg-blue-50",
        text: "text-blue-600",
        border: "border-blue-200",
    },
    green: {
        bg: "from-green-500 to-green-600",
        light: "bg-green-50",
        text: "text-green-600",
        border: "border-green-200",
    },
    purple: {
        bg: "from-purple-500 to-purple-600",
        light: "bg-purple-50",
        text: "text-purple-600",
        border: "border-purple-200",
    },
    orange: {
        bg: "from-orange-500 to-orange-600",
        light: "bg-orange-50",
        text: "text-orange-600",
        border: "border-orange-200",
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
    const colors = colorClasses[color];

    return (
        <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-100">
            <div className="p-6">
                <div className="flex items-center justify-between">
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${colors.bg}`}>
                        <Icon className="h-6 w-6 text-white" />
                    </div>
                    <div
                        className={`flex items-center text-sm font-medium ${changeType === "increase" ? "text-green-600" : "text-red-600"
                            }`}
                    >
                        {changeType === "increase" ? (
                            <ArrowUpRight className="h-4 w-4 mr-1" />
                        ) : (
                            <ArrowDownRight className="h-4 w-4 mr-1" />
                        )}
                        {change}
                    </div>
                </div>
                <div className="mt-4">
                    <h3 className="text-sm font-medium text-gray-500">{name}</h3>
                    <p className="mt-2 text-3xl font-bold text-gray-900">{value}</p>
                </div>
            </div>
            <div className={`h-1 bg-gradient-to-r ${colors.bg}`}></div>
        </div>
    );
}
