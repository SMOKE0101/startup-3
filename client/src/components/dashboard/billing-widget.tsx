import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UpcomingPayment } from "@shared/schema";
import { format, addDays } from "date-fns";

interface BillingWidgetProps {
  upcomingPayments: UpcomingPayment[];
}

export function BillingWidget({ upcomingPayments }: BillingWidgetProps) {
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Get due date description
  const getDueDateText = (daysUntilDue: number) => {
    if (daysUntilDue === 0) {
      return "Due today";
    } else if (daysUntilDue === 1) {
      return "Due tomorrow";
    } else {
      return `Due in ${daysUntilDue} days`;
    }
  };

  return (
    <Card className="bg-white overflow-hidden">
      <CardHeader className="p-6 border-b border-neutral-200">
        <CardTitle className="text-lg font-heading font-semibold text-neutral-900">Upcoming Payments</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          {upcomingPayments.map((payment) => (
            <div key={payment.id} className="flex items-center justify-between py-2 border-b border-neutral-200">
              <div>
                <p className="font-medium text-sm">{payment.propertyName}</p>
                <span className="text-xs text-neutral-500">
                  {getDueDateText(payment.daysUntilDue)}
                </span>
              </div>
              <span className="text-sm font-medium">{formatCurrency(payment.amount)}</span>
            </div>
          ))}
          
          <div className="pt-2">
            <Button className="w-full">
              View All Payments
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
