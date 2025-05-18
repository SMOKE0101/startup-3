import { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  change?: {
    value: string | number;
    isPositive: boolean;
  };
  iconBgClass?: string;
  iconTextClass?: string;
  className?: string;
}

export function StatCard({
  title,
  value,
  icon,
  change,
  iconBgClass = "bg-primary-100",
  iconTextClass = "text-primary-700",
  className,
}: StatCardProps) {
  return (
    <Card className={className}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-neutral-500 text-sm font-medium">{title}</h3>
          <span className={cn(`p-2 rounded-lg`, iconBgClass, iconTextClass)}>
            {icon}
          </span>
        </div>
        <p className="text-2xl font-semibold text-neutral-900 mb-2">{value}</p>
        {change && (
          <p className="text-sm text-neutral-500">
            <span className={change.isPositive ? "text-emerald-500 font-medium" : "text-rose-500 font-medium"}>
              {change.isPositive ? "↑" : "↓"} {change.value}
            </span>
            {" from last month"}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
