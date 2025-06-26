
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { VestuarioLogo } from "@/components/icons/logo";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate authentication
    setTimeout(() => {
      if (username && password) {
        try {
          localStorage.setItem('vestuario-auth', 'true');
          router.push('/');
        } catch (error) {
          console.error("Failed to access localStorage:", error);
          toast({
            title: "Erro de Navegador",
            description: "Não foi possível salvar a sessão. Verifique as configurações do seu navegador.",
            variant: "destructive",
          });
        }
      } else {
        toast({
          title: "Erro de Login",
          description: "Por favor, preencha o usuário e a senha.",
          variant: "destructive",
        });
      }
      setIsLoading(false);
    }, 500);
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-sm shadow-2xl">
        <CardHeader className="text-center space-y-4">
            <VestuarioLogo className="h-12 w-auto mx-auto" />
          <CardDescription>Acesse o painel com suas credenciais.</CardDescription>
        </CardHeader>
        <form onSubmit={handleLogin}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Usuário</Label>
              <Input
                id="username"
                type="text"
                placeholder="seu.usuario"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                placeholder="********"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLoading ? "Entrando..." : "Entrar"}
            </Button>
          </CardFooter>
        </form>
      </Card>
      <footer className="absolute bottom-6 w-full px-4">
        <div className="text-center text-sm text-muted-foreground space-y-1">
            <p>&copy; {new Date().getFullYear()} Vestuário ERP. Todos os direitos reservados.</p>
            <p>Uma solução de gestão criada por <span className="font-semibold text-foreground/80">Eros</span>.</p>
        </div>
      </footer>
    </div>
  );
}
