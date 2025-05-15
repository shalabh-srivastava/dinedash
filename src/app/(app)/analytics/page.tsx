
"use client"; 

import { SalesTrendsChart } from '@/components/charts/sales-trends-chart';
import { PeakHoursChart } from '@/components/charts/peak-hours-chart';
import { PopularItemsChart } from '@/components/charts/popular-items-chart';
import { mockSalesData, mockPeakHoursData, mockPopularItemsData } from '@/lib/mock-data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Users, ShoppingBag } from 'lucide-react'; // Removed DollarSign, will use Rupee icon if needed or text
import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const RupeeIcon = () => ( // Simple inline SVG for Rupee or use a suitable icon library if available
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
    <path d="M19.25 4H8.3418C7.69511 4 7.07743 4.25878 6.63497 4.71067L3.03403 8.39052C2.55237 8.88251 2.55237 9.66269 3.03403 10.1547L6.63497 13.8345C7.07743 14.2864 7.69511 14.5452 8.3418 14.5452H12V16H8.3418C7.44405 16 6.58496 16.3441 5.96632 16.9759L3.84318 19.1391C3.36151 19.6311 3.36151 20.4113 3.84318 20.9033C4.32484 21.3952 5.08845 21.3952 5.57011 20.9033L7.69324 18.7401C8.31189 18.1083 9.17098 17.7642 10.0687 17.7642H12V20H14V17.7642H19.25C19.6642 17.7642 20 17.4284 20 17.0142V16H14V14.5452H19.25C19.6642 14.5452 20 14.2094 20 13.7952V4.75C20 4.33579 19.6642 4 19.25 4ZM14 12.5452H8.3418L5.44827 9.57275L8.3418 6.59999H14V12.5452Z" />
  </svg>
);


const kpiData = [
  { title: "Total Revenue", value: "₹1,25,670", icon: RupeeIcon, change: "+12.5%", changeType: "positive" as const },
  { title: "Total Orders", value: "8,450", icon: ShoppingBag, change: "+8.2%", changeType: "positive" as const },
  { title: "Average Order Value", value: "₹148.70", icon: TrendingUp, change: "+2.1%", changeType: "positive" as const },
  { title: "New Customers", value: "320", icon: Users, change: "-1.5%", changeType: "negative" as const },
];


export default function AnalyticsPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user?.role !== 'manager') {
      router.push('/orders'); // Redirect non-managers
    }
  }, [user, isLoading, router]);

  if (isLoading || user?.role !== 'manager') {
    return <div className="flex items-center justify-center min-h-screen">Access Denied. Redirecting...</div>;
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold tracking-tight">Sales Analytics Dashboard</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {kpiData.map((kpi) => (
          <Card key={kpi.title} className="shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
              <kpi.icon className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{kpi.value}</div>
              <p className={`text-xs ${kpi.changeType === 'positive' ? 'text-green-600' : 'text-red-600'}`}>
                {kpi.change} from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <SalesTrendsChart data={mockSalesData} />
        <PeakHoursChart data={mockPeakHoursData} />
      </div>
      <div>
        <PopularItemsChart data={mockPopularItemsData} />
      </div>
    </div>
  );
}
