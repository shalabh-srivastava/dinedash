import { SalesTrendsChart } from '@/components/charts/sales-trends-chart';
import { PeakHoursChart } from '@/components/charts/peak-hours-chart';
import { PopularItemsChart } from '@/components/charts/popular-items-chart';
import { mockSalesData, mockPeakHoursData, mockPopularItemsData } from '@/lib/mock-data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, Users, ShoppingBag, TrendingUp } from 'lucide-react';

const kpiData = [
  { title: "Total Revenue", value: "$125,670", icon: DollarSign, change: "+12.5%", changeType: "positive" as const },
  { title: "Total Orders", value: "8,450", icon: ShoppingBag, change: "+8.2%", changeType: "positive" as const },
  { title: "Average Order Value", value: "$14.87", icon: TrendingUp, change: "+2.1%", changeType: "positive" as const },
  { title: "New Customers", value: "320", icon: Users, change: "-1.5%", changeType: "negative" as const },
];


export default function AnalyticsPage() {
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
