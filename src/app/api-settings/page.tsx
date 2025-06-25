
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal, Loader2, CheckCircle, KeyRound } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const AUTH_API_URL = 'https://integracaodshomologacao.useserver.com.br/api/v1/autenticar';
const API_SETTINGS_KEY = 'vestuario-erp-api-settings';

export default function ApiSettingsPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [apiStatus, setApiStatus] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [tokenExpiration, setTokenExpiration] = useState<Date | null>(null);
  const [isDataInitialized, setIsDataInitialized] = useState(false);

  // Load settings from localStorage on initial client render
  useEffect(() => {
    try {
      const savedSettings = localStorage.getItem(API_SETTINGS_KEY);
      if (savedSettings) {
        const { username, password, token, tokenExpiration } = JSON.parse(savedSettings);
        if (username) setUsername(username);
        if (password) setPassword(password);
        
        if (token && tokenExpiration) {
          const expirationDate = new Date(tokenExpiration);
          if (expirationDate > new Date()) {
            setToken(token);
            setTokenExpiration(expirationDate);
          }
        }
      }
    } catch (error) {
      console.error("Failed to load API settings from localStorage:", error);
    }
    setIsDataInitialized(true);
  }, []);

  // Save settings to localStorage whenever they change
  useEffect(() => {
    if (isDataInitialized) {
      try {
        const settings = { username, password, token, tokenExpiration };
        localStorage.setItem(API_SETTINGS_KEY, JSON.stringify(settings));
      } catch (error) {
        console.error("Failed to save API settings to localStorage:", error);
      }
    }
  }, [username, password, token, tokenExpiration, isDataInitialized]);


  const handleTestConnection = async () => {
    setIsLoading(true);
    setApiStatus(null);
    setToken(null);
    setTokenExpiration(null);

    if (!username || !password) {
      setApiStatus(400);
      setIsLoading(false);
      return;
    }
    
    try {
      const response = await fetch(AUTH_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cnpj: username,
          hash: password,
        }),
      });

      setApiStatus(response.status);

      if (response.ok) {
        const data = await response.json();
        if (data.token && typeof data.token === 'string') {
          setToken(data.token);
          const expiration = new Date();
          expiration.setHours(expiration.getHours() + 24);
          setTokenExpiration(expiration);
        } else {
          setToken(null);
        }
      } else {
        setToken(null);
        setTokenExpiration(null);
      }
    } catch (error) {
      console.error("API Connection Error:", error);
      setApiStatus(503); 
      setToken(null);
      setTokenExpiration(null);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusVariant = (status: number | null) => {
    if (status === null) return "secondary";
    if (status >= 200 && status < 300) return "default";
    return "destructive";
  };

  const getStatusText = (status: number | null) => {
    if (status === null) return "Aguardando teste...";
    if (status >= 200 && status < 300) return "Conexão bem-sucedida";
    if (status === 400) return "Erro: Preencha todos os campos";
    if (status === 401 || status === 403) return "Erro: CNPJ ou Hash inválido";
    if (status === 404) return "Erro: URL da API não encontrada";
    if (status === 503) return "Erro: Falha na conexão. Verifique o console.";
    return `Erro: ${status}`;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold font-headline">Configurações da API e Desenvolvimento</h1>
      
      <Tabs defaultValue="authentication" className="space-y-4">
        <TabsList>
          <TabsTrigger value="authentication">Autenticação</TabsTrigger>
          <TabsTrigger value="developer">Desenvolvedor</TabsTrigger>
        </TabsList>
        
        <TabsContent value="authentication" className="space-y-6">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Conexão de API Externa</CardTitle>
              <CardDescription>Insira as credenciais para obter um token de acesso.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
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
                   Expira em: <span className="font-medium text-foreground">{new Date(tokenExpiration).toLocaleString('pt-BR')}</span> (24 horas)
                 </p>
               </CardContent>
             </Card>
          )}

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Regras de Consumo</CardTitle>
              <CardDescription>Diretrizes para o uso da API.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-muted-foreground">
              <p>Durante o horário comercial, siga rigorosamente as regras de acesso à plataforma. Isso é fundamental para manter a operação da loja funcionando sem problemas.</p>
              <div className="space-y-3 pl-4 border-l-2 border-primary/50 mt-4">
                <div className="space-y-1">
                  <h4 className="font-semibold text-foreground">Carga Inicial de Dados</h4>
                  <p>A execução da carga inicial de dados deve ser programada para ocorrer após as 23:00hrs e antes das 06:00hrs, visando minimizar impactos no Frente de Loja dos Clientes da Data System.</p>
                </div>

                <div className="space-y-1">
                  <h4 className="font-semibold text-foreground">Consulta de Dados Durante o Período Restrito (6:00 às 23:00)</h4>
                  <p>Durante o período, todas as consultas de Vendas, Estoque e outras rotas de Movimentação estarão sujeitas a um limite de até 5 dias de histórico. Essa limitação visa otimizar o desempenho e garantir o correto funcionamento do sistema.</p>
                </div>

                <div className="space-y-1">
                  <h4 className="font-semibold text-foreground">Robustez de Comunicação e Infraestrutura</h4>
                  <p>A plataforma deve ser desenvolvida com mecanismos de tratamento de falhas de comunicação e infraestrutura. Caso ocorra qualquer problema de comunicação ou falha na infraestrutura, a aplicação deverá ser capaz de efetuar novas requisições e buscar os dados necessários após a retomada da comunicação. As cargas de dados devem ser efetuadas de forma incremental, evitando gargalos e transporte de informação desnecessária.</p>
                </div>
                
                <div className="space-y-1">
                  <h4 className="font-semibold text-foreground">Consequências por Não Respeitar as Premissas</h4>
                  <p>É imprescindível que todos os parceiros respeitem as premissas estabelecidas. Em caso de descumprimento, a Data System poderá adotar medidas como a suspensão temporária da Hash do parceiro ou até mesmo a suspensão por tempo indeterminado, a critério da gravidade da infração.</p>
                </div>

                <div className="space-y-1">
                  <h4 className="font-semibold text-foreground">Duração do Token</h4>
                  <p>O token da nossa plataforma tem duração de 24horas.</p>
                </div>

                <div className="space-y-1">
                  <h4 className="font-semibold text-foreground">Janela de Manutenção</h4>
                  <p>As manutenções em ambiente de banco de dados podem ocorrer na janela de 01h-03h sem a necessidade de aviso prévio.</p>
                </div>
              </div>
              <p className="pt-4 text-xs italic">Essas premissas garantem uma integração segura, estável e eficiente entre a plataforma e os parceiros, respeitando os horários de menor impacto nas operações dos clientes e implementando mecanismos de contingência para situações adversas.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="developer" className="space-y-6">
          <Card className="shadow-lg">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Terminal /> Endpoints da API
                </CardTitle>
                <CardDescription>
                    Pontos de acesso (URLs) utilizados pela aplicação para se conectar a serviços externos.
                </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm list-disc pl-5 text-muted-foreground">
                  <li>
                    <span className="font-semibold text-foreground">Autenticação (POST):</span>
                    <code className="ml-2 bg-muted p-1 rounded-md text-xs">{AUTH_API_URL}</code>
                  </li>
                  <li>
                    <span className="font-semibold text-foreground">Dados de Clientes (SheetDB):</span>
                    <code className="ml-2 bg-muted p-1 rounded-md text-xs">https://sheetdb.io/api/v1/z1jkiua66i9yk</code>
                  </li>
                   <li>
                    <span className="font-semibold text-foreground">Contagem de Clientes (SheetDB):</span>
                    <code className="ml-2 bg-muted p-1 rounded-md text-xs">https://sheetdb.io/api/v1/z1jkiua66i9yk/count?sheet=Tabela1</code>
                  </li>
              </ul>
            </CardContent>
          </Card>
           <Card className="shadow-lg">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <KeyRound /> Armazenamento Local
                </CardTitle>
                <CardDescription>
                    Chaves usadas no `localStorage` do navegador para persistir dados entre as sessões.
                </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm list-disc pl-5 text-muted-foreground">
                  <li>
                    <span className="font-semibold text-foreground">Configurações da API:</span>
                    <code className="ml-2 bg-muted p-1 rounded-md text-xs">{API_SETTINGS_KEY}</code>
                  </li>
                  <li>
                    <span className="font-semibold text-foreground">Dados de Produtos:</span>
                    <code className="ml-2 bg-muted p-1 rounded-md text-xs">vestuario-erp-products</code>
                  </li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
