"use client";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DatePickerWithRange } from "@/components/ui/date-picker-range"; // Assuming this component exists
import { DollarSign, ShoppingCart, Users, BarChart, LineChart, PieChartIcon, Filter, CalendarDays } from "lucide-react";
import { Bar, BarChart as RechartsBarChart, Line, LineChart as RechartsLineChart, Pie, PieChart as RechartsPieChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, Cell } from "recharts";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import type { ChartConfig } from "@/components/ui/chart";

// Placeholder for DatePickerWithRange if not available
const DatePickerWithRangeFallback = () => (
  <Button variant="outline" className="w-full md:w-auto justify-start text-left font-normal">
    <CalendarDays className="mr-2 h-4 w-4" />
    <span>Pick a date range</span>
  </Button>
);


const salesOverTimeData = [
  { date: "2023-01-01", sales: 2400 }, { date: "2023-02-01", sales: 1398 },
  { date: "2023-03-01", sales: 9800 }, { date: "2023-04-01", sales: 3908 },
  { date: "2023-05-01", sales: 4800 }, { date: "2023-06-01", sales: 3800 },
  { date: "2023-07-01", sales: 4300 },
];

const salesByCategoryData = [
  { name: "Tops", sales: 4000, fill: "hsl(var(--chart-1))" },
  { name: "Bottoms", sales: 3000, fill: "hsl(var(--chart-2))" },
  { name: "Dresses", sales: 2000, fill: "hsl(var(--chart-3))" },
  { name: "Accessories", sales: 2780, fill: "hsl(var(--chart-4))" },
  { name: "Footwear", sales: 1890, fill: "hsl(var(--chart-5))" },
];

const chartConfigBase = {
  sales: { label: "Sales", color: "hsl(var(--primary))" },
  category: { label: "Category" },
} satisfies ChartConfig;

const PIE_COLORS = salesByCategoryData.map(entry => entry.fill);


export default function SalesReportingPage() {
  const [dateRange, setDateRange] = useState<object | undefined>(undefined); // Placeholder for date range state

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-3xl font-bold font-headline text-foreground">Sales Reporting</h1>
        <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
          <DatePickerWithRangeFallback /> {/* Replace with actual DatePickerWithRange */}
          <Button className="w-full md:w-auto"><Filter className="mr-2 h-4 w-4" /> Apply Filters</Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Sales</CardTitle>
            <DollarSign className="h-5 w-5 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">$125,670.50</div>
            <p className="text-xs text-muted-foreground pt-1">+15.2% from selected period</p>
          </CardContent>
        </Card>
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Average Order Value</CardTitle>
            <ShoppingCart className="h-5 w-5 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">$85.30</div>
            <p className="text-xs text-muted-foreground pt-1">+3.5% from selected period</p>
          </CardContent>
        </Card>
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">New Customers</CardTitle>
            <Users className="h-5 w-5 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">215</div>
            <p className="text-xs text-muted-foreground pt-1">In selected period</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="font-headline text-xl flex items-center gap-2"><LineChart className="text-accent" /> Sales Over Time</CardTitle>
            <CardDescription>Monthly sales trend for the selected period.</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfigBase} className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsLineChart data={salesOverTimeData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                  <XAxis dataKey="date" tickFormatter={(val) => new Date(val).toLocaleDateString('en-US', {month: 'short', year: '2-digit'})} stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis tickFormatter={(val) => `$${val/1000}k`} stroke="hsl(var(--muted-foreground))" fontSize={12}/>
                  <Tooltip content={<ChartTooltipContent />} cursor={{ stroke: 'hsl(var(--accent))', strokeWidth: 1, strokeDasharray: "3 3" }} />
                  <Legend />
                  <Line type="monotone" dataKey="sales" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 4, fill: "hsl(var(--primary))" }} activeDot={{ r: 6, stroke: "hsl(var(--background))", fill: "hsl(var(--primary))" }}/>
                </RechartsLineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="font-headline text-xl flex items-center gap-2"><BarChart className="text-accent"/> Sales by Product Category</CardTitle>
            <CardDescription>Breakdown of sales across different product categories.</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfigBase} className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsBarChart data={salesByCategoryData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <XAxis type="number" tickFormatter={(val) => `$${val/1000}k`} stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis dataKey="name" type="category" stroke="hsl(var(--muted-foreground))" fontSize={12} width={80} />
                  <Tooltip content={<ChartTooltipContent />} cursor={{ fill: 'hsl(var(--accent) / 0.1)' }} />
                  <Legend />
                  <Bar dataKey="sales" radius={[0, 4, 4, 0]} />
                </RechartsBarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
      
      <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
        <CardHeader>
          <CardTitle className="font-headline text-xl flex items-center gap-2"><PieChartIcon className="text-accent"/> Sales Distribution (Example)</CardTitle>
          <CardDescription>Visual representation of sales contribution by category.</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          <ChartContainer config={chartConfigBase} className="h-[300px] w-full max-w-md">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPieChart>
                <Pie data={salesByCategoryData} dataKey="sales" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                  {salesByCategoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<ChartTooltipContent />} />
                <Legend />
              </RechartsPieChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

    </div>
  );
}
