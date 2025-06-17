
"use client";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DatePickerWithRange } from "@/components/ui/date-picker-range"; 
import { DollarSign, ShoppingCart, Users, BarChart, LineChart, PieChartIcon, Filter, CalendarDays } from "lucide-react";
import { Bar, BarChart as RechartsBarChart, Line, LineChart as RechartsLineChart, Pie, PieChart as RechartsPieChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, Cell } from "recharts";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import type { ChartConfig } from "@/components/ui/chart";


const salesByCategoryDataStatic = [
  { name: "Blusas", sales: 4000, fill: "hsl(var(--chart-1))" },
  { name: "Partes de Baixo", sales: 3000, fill: "hsl(var(--chart-2))" },
  { name: "Vestidos", sales: 2000, fill: "hsl(var(--chart-3))" },
  { name: "Acessórios", sales: 2780, fill: "hsl(var(--chart-4))" },
  { name: "Calçados", sales: 1890, fill: "hsl(var(--chart-5))" },
];

const chartConfigBase = {
  sales: { label: "Vendas", color: "hsl(var(--primary))" },
  category: { label: "Categoria" },
} satisfies ChartConfig;

const PIE_COLORS = salesByCategoryDataStatic.map(entry => entry.fill);


export default function SalesReportingPage() {
  const [dateRange, setDateRange] = useState<object | undefined>(undefined); 
  const [salesOverTimeData, setSalesOverTimeData] = useState<Array<{ date: string; sales: number }>>([]);
  const [totalSales, setTotalSales] = useState<number | null>(null);
  const [avgOrderValue, setAvgOrderValue] = useState<number | null>(null);


  useEffect(() => {
    // Simulate fetching dynamic data
    setSalesOverTimeData([
      { date: "2023-01-01", sales: 2400 }, { date: "2023-02-01", sales: 1398 },
      { date: "2023-03-01", sales: 9800 }, { date: "2023-04-01", sales: 3908 },
      { date: "2023-05-01", sales: 4800 }, { date: "2023-06-01", sales: 3800 },
      { date: "2023-07-01", sales: 4300 },
    ]);
    setTotalSales(125670.50);
    setAvgOrderValue(85.30);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-3xl font-bold font-headline text-foreground">Relatórios de Vendas</h1>
        <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
          <DatePickerWithRange onDateChange={setDateRange} />
          <Button className="w-full md:w-auto"><Filter className="mr-2 h-4 w-4" /> Aplicar Filtros</Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Vendas Totais</CardTitle>
            <DollarSign className="h-5 w-5 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">
                {totalSales !== null ? totalSales.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : 'Carregando...'}
            </div>
            <p className="text-xs text-muted-foreground pt-1">+15.2% do período selecionado</p>
          </CardContent>
        </Card>
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Valor Médio do Pedido</CardTitle>
            <ShoppingCart className="h-5 w-5 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">
                {avgOrderValue !== null ? avgOrderValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : 'Carregando...'}
            </div>
            <p className="text-xs text-muted-foreground pt-1">+3.5% do período selecionado</p>
          </CardContent>
        </Card>
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Novos Clientes</CardTitle>
            <Users className="h-5 w-5 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">215</div>
            <p className="text-xs text-muted-foreground pt-1">No período selecionado</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="font-headline text-xl flex items-center gap-2"><LineChart className="text-accent" /> Vendas ao Longo do Tempo</CardTitle>
            <CardDescription>Tendência de vendas mensais para o período selecionado.</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfigBase} className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsLineChart data={salesOverTimeData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                  <XAxis dataKey="date" tickFormatter={(val) => new Date(val).toLocaleDateString('pt-BR', {month: 'short', year: '2-digit'})} stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis tickFormatter={(val) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', notation: 'compact', compactDisplay: 'short' }).format(val)} stroke="hsl(var(--muted-foreground))" fontSize={12}/>
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
            <CardTitle className="font-headline text-xl flex items-center gap-2"><BarChart className="text-accent"/> Vendas por Categoria de Produto</CardTitle>
            <CardDescription>Detalhamento das vendas em diferentes categorias de produtos.</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfigBase} className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsBarChart data={salesByCategoryDataStatic} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <XAxis type="number" tickFormatter={(val) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', notation: 'compact', compactDisplay: 'short' }).format(val)} stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis dataKey="name" type="category" stroke="hsl(var(--muted-foreground))" fontSize={12} width={80} />
                  <Tooltip content={<ChartTooltipContent />} cursor={{ fill: 'hsl(var(--accent) / 0.1)' }} />
                  <Legend />
                  <Bar dataKey="sales" radius={[0, 4, 4, 0]} >
                     {salesByCategoryDataStatic.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                  </Bar>
                </RechartsBarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
      
      <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
        <CardHeader>
          <CardTitle className="font-headline text-xl flex items-center gap-2"><PieChartIcon className="text-accent"/> Distribuição de Vendas (Exemplo)</CardTitle>
          <CardDescription>Representação visual da contribuição de vendas por categoria.</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          <ChartContainer config={chartConfigBase} className="h-[300px] w-full max-w-md">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPieChart>
                <Pie data={salesByCategoryDataStatic} dataKey="sales" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                  {salesByCategoryDataStatic.map((entry, index) => (
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

    