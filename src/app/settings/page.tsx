
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold font-headline">Configurações</h1>
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Configurações do Aplicativo</CardTitle>
          <CardDescription>Gerencie suas preferências e configurações do aplicativo aqui.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">A página de configurações está em construção. Mais opções estarão disponíveis em breve.</p>
          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <span className="font-medium">Preferência de Tema</span>
              <span className="text-muted-foreground">Sistema</span>
            </div>
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <span className="font-medium">Notificações</span>
              <span className="text-muted-foreground">Ativado</span>
            </div>
             <div className="flex items-center justify-between p-4 border rounded-lg">
              <span className="font-medium">Moeda Padrão</span>
              <span className="text-muted-foreground">BRL</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

    