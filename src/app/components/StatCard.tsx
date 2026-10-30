import type { LucideIcon } from "lucide-react";

const COLORS = {
  orange: "bg-orange-100 text-orange-700",
  green: "bg-green-100 text-green-700",
  blue: "bg-blue-100 text-blue-700",
  purple: "bg-purple-100 text-purple-700",
  yellow: "bg-yellow-100 text-yellow-700",
};

interface StatCardProps {
  label: string;
  value: number | string;
  icon: LucideIcon;
  color: keyof typeof COLORS;
}

/** Tarjeta de estadística: el número una sola vez, acompañado de un ícono. */
export function StatCard({ label, value, icon: Icon, color }: StatCardProps) {
  return (
    <div className="bg-white rounded-lg p-5 shadow-md border border-gray-100">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm text-gray-700">{label}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`w-11 h-11 rounded-lg flex items-center justify-center shrink-0 ${COLORS[color]}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
}
