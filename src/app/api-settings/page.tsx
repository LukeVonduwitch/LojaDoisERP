
"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal, Loader2, CheckCircle } from "lucide-react";

export default function ApiSettingsPage() {
  const [apiUrl, setApiUrl] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [apiStatus, setApiStatus] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [tokenExpiration, setTokenExpiration] = useState<Date | null>(null);

  const handleTestConnection = async () => {
    setIsLoading(true);
    setApiStatus(null);
    setToken(null);
    setTokenExpiration(null);
    
    // Simula um atraso de rede
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Lógica de simulação de POST para obter token
    if (apiUrl && username && password) {
      setApiStatus(200); // Sucesso
      // Gera um token falso e data de expiração
      const fakeToken = `token-${btoa(Math.random().toString()).substring(10, 40)}`;
      setToken(fakeToken);
      const expiration = new Date();
      expiration.setHours(expiration.getHours() + 24);
      setTokenExpiration(expiration);

    } else {
      setApiStatus(400); // Requisição inválida (campos faltando)
    }

    setIsLoading(false);
  };

  const getStatusVariant = (status: number | null) => {
    if (status === null) return "secondary";
    if (status >= 200 && status < 300) return "default";
    return "destructive";
  };

  const getStatusText = (status: number | null) => {
    if (status === null) return "Aguardando teste...";
    if (status === 200) return "Conexão bem-sucedida";
    if (status === 400) return "Erro: Preencha todos os campos";
    return `Erro Inesperado: ${status}`;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold font-headline">Configuração da API</h1>
      
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Conexão de API Externa</CardTitle>
          <CardDescription>Insira as credenciais para obter um token de acesso.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="apiUrl">URL da API</Label>
              <Input 
                id="apiUrl" 
                placeholder="https://api.exemplo.com/v1/auth"
                value={apiUrl}
                onChange={(e) => setApiUrl(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div>
              <Label htmlFor="username">CNPJ</Label>
              <Input 
                id="username" 
                placeholder="00.000.000/0000-00"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div>
              <Label htmlFor="password">Hash</Label>
              <Input 
                id="password" 
                type="password"
                placeholder="Seu hash de autenticação"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Button onClick={handleTestConnection} disabled={isLoading} className="w-full sm:w-auto">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Testando...
                </>
              ) : (
                "Testar Conexão e Gerar Token"
              )}
            </Button>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-muted-foreground">Status:</span>
              <Badge variant={getStatusVariant(apiStatus)} className="text-sm">
                {apiStatus && <span className="mr-2 font-bold">{apiStatus}</span>}
                {getStatusText(apiStatus)}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {token && tokenExpiration && (
        <Card className="shadow-lg border-accent/50">
           <CardHeader>
             <CardTitle className="flex items-center gap-2 text-accent">
                <CheckCircle className="h-6 w-6" />
                Token Gerado com Sucesso
            </CardTitle>
             <CardDescription>Este token seria usado para autenticar as próximas requisições.</CardDescription>
           </CardHeader>
           <CardContent className="space-y-4">
             <div>
               <Label htmlFor="apiToken">Token de Acesso</Label>
               <Input 
                 id="apiToken"
                 readOnly
                 value={token}
                 className="font-mono bg-muted/50"
               />
             </div>
             <p className="text-sm text-muted-foreground">
               Expira em: <span className="font-medium text-foreground">{tokenExpiration.toLocaleString('pt-BR')}</span> (24 horas)
             </p>
           </CardContent>
         </Card>
      )}

    </div>
  );
}
