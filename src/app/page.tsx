
"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";
import { useState, useEffect } from 'react';


export default function DashboardPage() {
  const [totalCustomers, setTotalCustomers] = useState<number | null>(null);

  useEffect(() => {
    // Simulate fetching dynamic data or using a static value
    // In a real application, you would fetch this from your customer data
    setTotalCustomers(1230); 
  }, []);


  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold font-headline text-foreground">Painel</h1>
      
      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Clientes</CardTitle>
            <Users className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">
              {totalCustomers !== null ? `+${totalCustomers.toLocaleString('pt-BR')}` : 'Carregando...'}
            </div>
            <p className="text-xs text-muted-foreground pt-1">Total de clientes cadastrados</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

    