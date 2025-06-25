
"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal, Loader2 } from "lucide-react";

export default function ApiSettingsPage() {
  const [apiUrl, setApiUrl] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [apiStatus, setApiStatus] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleTestConnection = async () => {
    setIsLoading(true);
    setApiStatus(null);
    
    // Simula um atraso de rede
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Lógica de simulação simples
    if (apiUrl && username && password) {
      setApiStatus(200); // Sucesso
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
      
      <Alert variant="destructive">
        <Terminal className="h-4 w-4" />
        <AlertTitle>Aviso de Desenvolvedor</AlertTitle>
        <AlertDescription>
          Esta interface é uma **simulação visual** e **não realiza conexões reais** com APIs externas por motivos de segurança. A conexão de dados ativa para este aplicativo continua sendo via SheetDB, conforme configurado no código-fonte.
        </AlertDescription>
      </Alert>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Conexão de API Externa (Simulação)</CardTitle>
          <CardDescription>Insira as credenciais para simular uma conexão com a API.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="apiUrl">URL da API</Label>
              <Input 
                id="apiUrl" 
                placeholder="https://api.exemplo.com/v1"
                value={apiUrl}
                onChange={(e) => setApiUrl(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div>
              <Label htmlFor="username">Usuário (ou Chave da API)</Label>
              <Input 
                id="username" 
                placeholder="seu_usuario"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div>
              <Label htmlFor="password">Senha (ou Token)</Label>
              <Input 
                id="password" 
                type="password"
                placeholder="••••••••••••"
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
                "Testar Conexão"
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
    </div>
  );
}
