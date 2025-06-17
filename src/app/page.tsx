
"use client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { DollarSign, Package, Users, TrendingUp, AlertTriangle, BarChartBig, ShoppingBasket, Shirt } from "lucide-react";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from "recharts";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import type { ChartConfig } from "@/components/ui/chart";
import { useState, useEffect } from 'react';


const chartConfig = {
  sales: {
    label: "Vendas",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig;


const topProductsStatic = [
  { name: "Jaqueta Jeans Vintage", sales: 150, icon: Shirt },
  { name: "Lenço de Seda", sales: 120, icon: Shirt },
  { name: "Botas de Couro", sales: 90, icon: Shirt },
];

const lowStockItemsStatic = [
 { name: "Camiseta de Algodão (M)", stock: 5, icon: AlertTriangle, color: "text-destructive" },
 { name: "Suéter de Lã (G)", stock: 3, icon: AlertTriangle, color: "text-destructive" },
 { name: "Calça de Linho (P)", stock: 2, icon: AlertTriangle, color: "text-destructive" },
];


export default function DashboardPage() {
  const [salesData, setSalesData] = useState<Array<{ month: string; sales: number }>>([]);
  const [totalRevenue, setTotalRevenue] = useState<number | null>(null);

  useEffect(() => {
    // Simulate fetching dynamic data
    const generatedSalesData = [
      { month: "Jan", sales: Math.floor(Math.random() * 5000) + 1000 },
      { month: "Fev", sales: Math.floor(Math.random() * 5000) + 1000 },
      { month: "Mar", sales: Math.floor(Math.random() * 5000) + 1000 },
      { month: "Abr", sales: Math.floor(Math.random() * 5000) + 1000 },
      { month: "Mai", sales: Math.floor(Math.random() * 5000) + 1000 },
      { month: "Jun", sales: Math.floor(Math.random() * 5000) + 1000 },
    ];
    setSalesData(generatedSalesData);
    setTotalRevenue(45231.89); // Example static value, can be made dynamic
  }, []);


  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold font-headline text-foreground">Painel</h1>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Receita Total</CardTitle>
            <DollarSign className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">
                {totalRevenue !== null ? totalRevenue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : 'Carregando...'}
            </div>
            <p className="text-xs text-muted-foreground pt-1">+20.1% do último mês</p>
          </CardContent>
        </Card>
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Unidades de Estoque Ativas</CardTitle>
            <Package className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">12.840</div>
            <p className="text-xs text-muted-foreground pt-1">+500 unidades esta semana</p>
          </CardContent>
        </Card>
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Clientes</CardTitle>
            <Users className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">+1.230</div>
            <p className="text-xs text-muted-foreground pt-1">+85 novos clientes este mês</p>
          </CardContent>
        </Card>
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Crescimento de Vendas</CardTitle>
            <TrendingUp className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">+12,5%</div>
            <p className="text-xs text-muted-foreground pt-1">Em comparação com o último trimestre</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="font-headline text-xl flex items-center gap-2"><BarChartBig className="text-accent" /> Visão Geral das Vendas Mensais</CardTitle>
            <CardDescription>Acompanhe o desempenho de suas vendas nos últimos seis meses.</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={salesData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', notation: 'compact', compactDisplay: 'short' }).format(value)} />
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
              <CardTitle className="font-headline text-xl flex items-center gap-2"><ShoppingBasket className="text-accent" /> Produtos Mais Vendidos</CardTitle>
               <CardDescription>Produtos com maior volume de vendas este mês.</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {topProductsStatic.map((product) => (
                  <li key={product.name} className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <product.icon className="h-6 w-6 text-primary" />
                      <span className="font-medium text-foreground">{product.name}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">{product.sales} unidades vendidas</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="font-headline text-xl flex items-center gap-2"><AlertTriangle className="text-destructive" /> Alertas de Estoque Baixo</CardTitle>
              <CardDescription>Itens que precisam de reposição imediata.</CardDescription>
            </CardHeader>
            <CardContent>
               <ul className="space-y-3">
                {lowStockItemsStatic.map((item) => (
                  <li key={item.name} className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50 transition-colors">
                     <div className="flex items-center gap-3">
                      <item.icon className={`h-6 w-6 ${item.color}`} />
                      <span className="font-medium text-foreground">{item.name}</span>
                    </div>
                    <span className={`text-sm font-semibold ${item.color}`}>{item.stock} unidades restantes</span>
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

    