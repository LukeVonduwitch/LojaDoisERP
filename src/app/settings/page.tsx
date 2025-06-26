
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { VestuarioLogo } from "@/components/icons/logo";
import { Upload, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useTheme } from "@/components/theme-provider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const SETTINGS_KEY = 'vestuario-erp-app-settings';

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [appName, setAppName] = useState("Vestuário ERP");
  const [userName, setUserName] = useState("Usuário Padrão");
  const [currency, setCurrency] = useState("BRL");
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [userAvatarPreview, setUserAvatarPreview] = useState<string | null>(null);
  const [isDataInitialized, setIsDataInitialized] = useState(false);
  const { toast } = useToast();

  const getInitials = (name: string) => {
    if (!name) return "UP";
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  }

  // Load settings from localStorage on initial client render
  useEffect(() => {
    try {
      const savedSettings = localStorage.getItem(SETTINGS_KEY);
      if (savedSettings) {
        const { appName, userName, theme: savedTheme, currency, logoPreview, userAvatarPreview } = JSON.parse(savedSettings);
        if (appName) setAppName(appName);
        if (userName) setUserName(userName);
        if (savedTheme) setTheme(savedTheme);
        if (currency) setCurrency(currency);
        if (logoPreview) setLogoPreview(logoPreview);
        if (userAvatarPreview) setUserAvatarPreview(userAvatarPreview);
      }
    } catch (error) {
      console.error("Failed to load app settings from localStorage:", error);
    }
    setIsDataInitialized(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSaveChanges = () => {
    if (isDataInitialized) {
      try {
        const settings = { appName, userName, theme, currency, logoPreview, userAvatarPreview };
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
        
        // Dispatch a storage event to notify other parts of the app (like the header)
        window.dispatchEvent(new Event('storage'));

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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, setter: React.Dispatch<React.SetStateAction<string | null>>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setter(reader.result as string);
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
                            <input id="logo-upload" type="file" className="sr-only" accept="image/*" onChange={(e) => handleImageChange(e, setLogoPreview)} />
                        </label>
                    </Button>
                </div>
                <p className="text-xs text-muted-foreground">Recomendado: SVG, PNG ou JPG. Máximo 2MB.</p>
            </div>
          </div>
          
           <div className="space-y-4">
            <h3 className="text-lg font-medium text-foreground">Perfil do Usuário</h3>
            <div className="space-y-2">
              <Label htmlFor="userName">Nome do Usuário</Label>
              <Input 
                id="userName" 
                value={userName} 
                onChange={(e) => setUserName(e.target.value)} 
                className="max-w-sm"
              />
            </div>
            <div className="space-y-2">
                <Label htmlFor="userAvatar">Avatar do Usuário</Label>
                <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16">
                        <AvatarImage src={userAvatarPreview || undefined} alt="Preview do Avatar" />
                        <AvatarFallback className="text-2xl">{getInitials(userName)}</AvatarFallback>
                    </Avatar>
                    <Button asChild variant="outline">
                        <label htmlFor="avatar-upload" className="cursor-pointer">
                            <User className="mr-2 h-4 w-4" />
                            Alterar Avatar
                            <input id="avatar-upload" type="file" className="sr-only" accept="image/*" onChange={(e) => handleImageChange(e, setUserAvatarPreview)} />
                        </label>
                    </Button>
                </div>
                 <p className="text-xs text-muted-foreground">Recomendado: PNG ou JPG quadrado. Máximo 2MB.</p>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium text-foreground">Preferências</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label htmlFor="theme">Preferência de Tema</Label>
                    <Select value={theme} onValueChange={(value) => setTheme(value as any)}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Selecione um tema" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="light">Claro</SelectItem>
                            <SelectItem value="dark">Escuro</SelectItem>
                            <SelectItem value="liquid-glass">Liquid Glass (Claro)</SelectItem>
                            <SelectItem value="liquid-glass-dark">Liquid Glass (Escuro)</SelectItem>
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
