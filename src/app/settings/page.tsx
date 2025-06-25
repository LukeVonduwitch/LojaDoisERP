
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { VestuarioLogo } from "@/components/icons/logo";
import { Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const SETTINGS_KEY = 'vestuario-erp-app-settings';

export default function SettingsPage() {
  const [appName, setAppName] = useState("Vestuário ERP");
  const [theme, setTheme] = useState("system");
  const [currency, setCurrency] = useState("BRL");
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [isDataInitialized, setIsDataInitialized] = useState(false);
  const { toast } = useToast();

  // Load settings from localStorage on initial client render
  useEffect(() => {
    try {
      const savedSettings = localStorage.getItem(SETTINGS_KEY);
      if (savedSettings) {
        const { appName, theme, currency, logoPreview } = JSON.parse(savedSettings);
        if (appName) setAppName(appName);
        if (theme) setTheme(theme);
        if (currency) setCurrency(currency);
        if (logoPreview) setLogoPreview(logoPreview);
      }
    } catch (error) {
      console.error("Failed to load app settings from localStorage:", error);
    }
    setIsDataInitialized(true);
  }, []);

  const handleSaveChanges = () => {
    if (isDataInitialized) {
      try {
        const settings = { appName, theme, currency, logoPreview };
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
        toast({
          title: "Sucesso!",
          description: "As suas configurações foram salvas.",
        });
      } catch (error) {
        console.error("Failed to save app settings to localStorage:", error);
        toast({
          title: "Erro!",
          description: "Não foi possível salvar as configurações.",
          variant: "destructive",
        });
      }
    }
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold font-headline">Configurações</h1>
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Configurações do Aplicativo</CardTitle>
          <CardDescription>Gerencie suas preferências e configurações do aplicativo aqui.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-foreground">Identidade Visual</h3>
            <div className="space-y-2">
              <Label htmlFor="appName">Nome do Aplicativo</Label>
              <Input 
                id="appName" 
                value={appName} 
                onChange={(e) => setAppName(e.target.value)} 
                className="max-w-sm"
              />
            </div>
            <div className="space-y-2">
                <Label htmlFor="logo">Logo do Aplicativo</Label>
                <div className="flex items-center gap-4">
                    <div className="w-40 h-16 p-2 border rounded-md flex items-center justify-center bg-muted/30">
                        {logoPreview ? (
                            <img src={logoPreview} alt="Preview do Logo" className="max-h-full max-w-full object-contain" />
                        ) : (
                            <VestuarioLogo className="h-10 w-auto" />
                        )}
                    </div>
                    <Button asChild variant="outline">
                        <label htmlFor="logo-upload" className="cursor-pointer">
                            <Upload className="mr-2 h-4 w-4" />
                            Carregar Logo
                            <input id="logo-upload" type="file" className="sr-only" accept="image/*" onChange={handleLogoChange} />
                        </label>
                    </Button>
                </div>
                <p className="text-xs text-muted-foreground">Recomendado: SVG, PNG ou JPG. Máximo 2MB.</p>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium text-foreground">Preferências</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label htmlFor="theme">Preferência de Tema</Label>
                    <Select value={theme} onValueChange={setTheme}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Selecione um tema" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="light">Claro</SelectItem>
                            <SelectItem value="dark">Escuro</SelectItem>
                            <SelectItem value="system">Padrão do Sistema</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="currency">Moeda Padrão</Label>
                    <Select value={currency} onValueChange={setCurrency}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Selecione uma moeda" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="BRL">Real Brasileiro (BRL)</SelectItem>
                            <SelectItem value="USD">Dólar Americano (USD)</SelectItem>
                            <SelectItem value="EUR">Euro (EUR)</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="border-t pt-6">
            <Button onClick={handleSaveChanges}>Salvar Alterações</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
