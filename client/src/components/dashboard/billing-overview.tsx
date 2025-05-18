import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { type Payment } from "@/lib/types";
import { format, differenceInDays } from "date-fns";
import { useAuth } from "@/context/auth-context";
import { cn } from "@/lib/utils";
import { DollarSign, Calendar, ArrowRight } from "lucide-react";

interface BillingOverviewProps {
  className?: string;
}

export function BillingOverview({ className }: BillingOverviewProps) {
  const { user } = useAuth();

  const { data: payments, isLoading, error } = useQuery<Payment[]>({
    queryKey: ["/api/payments", { upcoming: true, days: 7 }],
    enabled: !!user?.id,
  });

  return (
    <Card className={className}>
      <CardHeader className="p-6 border-b border-neutral-200">
        <CardTitle className="text-lg font-heading font-semibold text-neutral-900 flex items-center">
          <DollarSign className="mr-2 h-5 w-5 text-emerald-500" />
          Upcoming Payments
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-6">
        {isLoading ? (
          <div className="py-2 text-center">
            <p>Loading payments...</p>
          </div>
        ) : error ? (
          <div className="py-2 text-center">
            <p className="text-danger-500">Failed to load payments</p>
          </div>
        ) : payments?.length === 0 ? (
          <div className="py-2 text-center">
            <p>No upcoming payments found.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {payments?.map((payment) => {
              const daysUntilDue = differenceInDays(new Date(payment.dueDate), new Date());
              
              return (
                <div 
                  key={payment.id} 
                  className="flex items-center justify-between py-2 border-b border-neutral-200"
                >
                  <div>
                    <p className="font-medium text-sm">
                      {payment.description || `Property ${payment.propertyId}`}
                    </p>
                    <span className="text-xs text-neutral-500">
                      {payment.type.charAt(0).toUpperCase() + payment.type.slice(1)} due in {daysUntilDue} days
                    </span>
                  </div>
                  <span className="text-sm font-medium">
                    ${payment.amount.toLocaleString()}
                  </span>
                </div>
              );
            })}
            
            <div className="pt-2">
              <Link href="/billing">
                <Button className="w-full">
                  View All Payments
                </Button>
              </Link>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
