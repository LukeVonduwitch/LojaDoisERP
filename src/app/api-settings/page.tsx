
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from "lucide-react";

export default function ApiSettingsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold font-headline">Configuração da API</h1>
      
      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Conexão de Dados</AlertTitle>
        <AlertDescription>
          Este ERP está conectado diretamente a uma planilha do Google Sheets através da API do SheetDB. Todas as operações de dados (clientes, estoque, etc.) são lidas e escritas nessa planilha. Para alterar a fonte de dados, você deve atualizar a URL da API diretamente no código-fonte.
        </AlertDescription>
      </Alert>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Conexão da API (SheetDB)</CardTitle>
          <CardDescription>Visualize a URL da API que está sendo usada para conectar-se à sua planilha de dados.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="apiUrl">URL da API do SheetDB</Label>
            <Input 
              id="apiUrl" 
              readOnly 
              value="https://sheetdb.io/api/v1/z1jkiua66i9yk" 
              className="mt-1 bg-muted"
            />
             <p className="text-sm text-muted-foreground mt-2">
              Esta URL é apenas para visualização. A alteração é feita no código-fonte para garantir a segurança e estabilidade da aplicação.
            </p>
          </div>
          <Button disabled>Salvar Alterações</Button>
        </CardContent>
      </Card>
    </div>
  );
}
