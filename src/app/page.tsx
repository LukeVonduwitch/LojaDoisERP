"use client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { DollarSign, Package, Users, TrendingUp, AlertTriangle, BarChartBig, ShoppingBasket, Shirt } from "lucide-react";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from "recharts";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import type { ChartConfig } from "@/components/ui/chart";

const salesData = [
  { month: "Jan", sales: Math.floor(Math.random() * 5000) + 1000 },
  { month: "Feb", sales: Math.floor(Math.random() * 5000) + 1000 },
  { month: "Mar", sales: Math.floor(Math.random() * 5000) + 1000 },
  { month: "Apr", sales: Math.floor(Math.random() * 5000) + 1000 },
  { month: "May", sales: Math.floor(Math.random() * 5000) + 1000 },
  { month: "Jun", sales: Math.floor(Math.random() * 5000) + 1000 },
];

const chartConfig = {
  sales: {
    label: "Sales",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig;


const topProducts = [
  { name: "Vintage Denim Jacket", sales: 150, icon: Shirt },
  { name: "Silk Scarf", sales: 120, icon: Shirt },
  { name: "Leather Boots", sales: 90, icon: Shirt },
];

const lowStockItems = [
 { name: "Cotton T-Shirt (M)", stock: 5, icon: AlertTriangle, color: "text-destructive" },
 { name: "Wool Sweater (L)", stock: 3, icon: AlertTriangle, color: "text-destructive" },
 { name: "Linen Pants (S)", stock: 2, icon: AlertTriangle, color: "text-destructive" },
];


export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold font-headline text-foreground">Dashboard</h1>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
            <DollarSign className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">$45,231.89</div>
            <p className="text-xs text-muted-foreground pt-1">+20.1% from last month</p>
          </CardContent>
        </Card>
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Stock Units</CardTitle>
            <Package className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">12,840</div>
            <p className="text-xs text-muted-foreground pt-1">+500 units this week</p>
          </CardContent>
        </Card>
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Customers</CardTitle>
            <Users className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">+1,230</div>
            <p className="text-xs text-muted-foreground pt-1">+85 new customers this month</p>
          </CardContent>
        </Card>
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Sales Growth</CardTitle>
            <TrendingUp className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">+12.5%</div>
            <p className="text-xs text-muted-foreground pt-1">Compared to last quarter</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="font-headline text-xl flex items-center gap-2"><BarChartBig className="text-accent" /> Monthly Sales Overview</CardTitle>
            <CardDescription>Track your sales performance over the past six months.</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={salesData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value / 1000}k`} />
                  <Tooltip content={<ChartTooltipContent />} cursor={{ fill: 'hsl(var(--accent) / 0.1)' }} />
                  <Legend />
                  <Bar dataKey="sales" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="font-headline text-xl flex items-center gap-2"><ShoppingBasket className="text-accent" /> Top Selling Products</CardTitle>
               <CardDescription>Products with the highest sales volume this month.</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {topProducts.map((product) => (
                  <li key={product.name} className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <product.icon className="h-6 w-6 text-primary" />
                      <span className="font-medium text-foreground">{product.name}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">{product.sales} units sold</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="font-headline text-xl flex items-center gap-2"><AlertTriangle className="text-destructive" /> Low Stock Alerts</CardTitle>
              <CardDescription>Items that need immediate reordering.</CardDescription>
            </CardHeader>
            <CardContent>
               <ul className="space-y-3">
                {lowStockItems.map((item) => (
                  <li key={item.name} className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50 transition-colors">
                     <div className="flex items-center gap-3">
                      <item.icon className={`h-6 w-6 ${item.color}`} />
                      <span className="font-medium text-foreground">{item.name}</span>
                    </div>
                    <span className={`text-sm font-semibold ${item.color}`}>{item.stock} units left</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
