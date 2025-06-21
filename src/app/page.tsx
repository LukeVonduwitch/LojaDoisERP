
"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";
import { useState, useEffect } from 'react';

const API_URL = 'https://sheetdb.io/api/v1/z1jkiua66i9yk/count';

export default function DashboardPage() {
  const [totalCustomers, setTotalCustomers] = useState<number | null>(null);

  useEffect(() => {
    const fetchCustomerCount = async () => {
      try {
        const response = await fetch(API_URL);
        if (!response.ok) {
          throw new Error('Failed to fetch customer count');
        }
        const data = await response.json();
        setTotalCustomers(data.rows);
      } catch (error) {
        console.error(error);
        setTotalCustomers(0); // Fallback on error
      }
    };

    fetchCustomerCount();
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

    