
"use client";
import { useState, useMemo, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { UserPlus, Edit, Trash2, Search, ArrowUpDown, ChevronLeft, ChevronRight } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  lastPurchaseDate: string;
  totalSpent: number;
  preferences: string[];
  joinDate: string;
}

const initialCustomers: Customer[] = [
  { id: "1", name: "Alice Wonderland", email: "alice@example.com", phone: "555-0101", avatar: "https://placehold.co/40x40.png", lastPurchaseDate: "2023-06-15", totalSpent: 1250.75, preferences: ["Vestidos", "Vintage"], joinDate: "2022-01-10" },
  { id: "2", name: "Bob The Builder", email: "bob@example.com", phone: "555-0102", avatar: "https://placehold.co/40x40.png", lastPurchaseDate: "2023-05-20", totalSpent: 875.50, preferences: ["Roupas de Trabalho", "Jeans"], joinDate: "2022-03-05" },
  { id: "3", name: "Carol Danvers", email: "carol@example.com", phone: "555-0103", lastPurchaseDate: "2023-06-01", totalSpent: 2300.00, preferences: ["Couro", "Acessórios"], joinDate: "2021-11-20" },
  { id: "4", name: "David Copperfield", email: "david@example.com", lastPurchaseDate: "2023-04-10", totalSpent: 450.20, preferences: ["Casual", "Camisetas"], joinDate: "2023-02-15" },
  { id: "5", name: "Eve Harrington", email: "eve@example.com", phone: "555-0105", avatar: "https://placehold.co/40x40.png", lastPurchaseDate: "2023-06-25", totalSpent: 175.90, preferences: ["Formal", "Seda"], joinDate: "2022-08-01" },
];

const ITEMS_PER_PAGE = 10;

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const [currentCustomer, setCurrentCustomer] = useState<Partial<Customer>>({ name: '', email: '', preferences: [] });

  const filteredCustomers = useMemo(() => {
    return customers.filter(customer =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [customers, searchTerm]);

  const totalPages = Math.ceil(filteredCustomers.length / ITEMS_PER_PAGE);
  const paginatedCustomers = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredCustomers.slice(startIndex, endIndex);
  }, [filteredCustomers, currentPage]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCurrentCustomer(prev => ({ ...prev, [name]: value }));
  };

  const handlePreferencesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentCustomer(prev => ({ ...prev, preferences: e.target.value.split(',').map(p => p.trim()).filter(Boolean) }));
  };

  const handleSubmit = () => {
    if (editingCustomer) { 
      setCustomers(prev => prev.map(c => c.id === editingCustomer.id ? { ...c, ...currentCustomer } as Customer : c));
    } else { 
      const newCustomer: Customer = {
        id: String(Date.now()),
        joinDate: new Date().toISOString().split('T')[0],
        lastPurchaseDate: '', // Default for new customer
        totalSpent: 0, // Default for new customer
        ...currentCustomer,
      } as Customer;
      setCustomers(prev => [newCustomer, ...prev]);
    }
    setIsFormOpen(false);
    setEditingCustomer(null);
    setCurrentCustomer({ name: '', email: '', preferences: [] });
  };

  const handleEdit = (customer: Customer) => {
    setEditingCustomer(customer);
    setCurrentCustomer({ ...customer });
    setIsFormOpen(true);
  };
  
  const handleAddNew = () => {
    setEditingCustomer(null);
    setCurrentCustomer({ name: '', email: '', preferences: [] });
    setIsFormOpen(true);
  };

  const handleDelete = (customerId: string) => {
    // Consider adding a confirmation dialog here for better UX
    if (window.confirm("Tem certeza que deseja excluir este cliente?")) {
      setCustomers(prev => prev.filter(c => c.id !== customerId));
    }
  };

  useEffect(() => {
    setCurrentPage(1); // Reset to first page when search term changes
  }, [searchTerm]);


  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-3xl font-bold font-headline text-foreground">Gerenciamento de Clientes</h1>
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleAddNew} className="min-w-max">
              <UserPlus className="mr-2 h-4 w-4" /> Adicionar Novo Cliente
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{editingCustomer ? "Editar Cliente" : "Adicionar Novo Cliente"}</DialogTitle>
              <DialogDescription>
                {editingCustomer ? "Atualize os detalhes do cliente." : "Preencha os detalhes para o novo cliente."}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">Nome</Label>
                <Input id="name" name="name" value={currentCustomer.name || ''} onChange={handleInputChange} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">E-mail</Label>
                <Input id="email" name="email" type="email" value={currentCustomer.email || ''} onChange={handleInputChange} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="phone" className="text-right">Telefone</Label>
                <Input id="phone" name="phone" value={currentCustomer.phone || ''} onChange={handleInputChange} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="preferences" className="text-right">Preferências</Label>
                <Input id="preferences" placeholder="ex: Vestidos, Vintage" value={currentCustomer.preferences?.join(', ') || ''} onChange={handlePreferencesChange} className="col-span-3" />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild><Button variant="outline">Cancelar</Button></DialogClose>
              <Button onClick={handleSubmit}>Salvar Cliente</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Banco de Dados de Clientes</CardTitle>
          <CardDescription>Gerencie informações de clientes, histórico de compras e preferências.</CardDescription>
          <div className="mt-4">
            <Input
              placeholder="Buscar clientes por nome ou e-mail..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-md"
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Contato</TableHead>
                  <TableHead className="cursor-pointer hover:bg-muted/50"><ArrowUpDown className="inline-block mr-1 h-4 w-4" />Última Compra</TableHead>
                  <TableHead className="text-right cursor-pointer hover:bg-muted/50"><ArrowUpDown className="inline-block mr-1 h-4 w-4" />Total Gasto</TableHead>
                  <TableHead>Preferências</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedCustomers.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={customer.avatar || `https://placehold.co/40x40.png?text=${customer.name.split(' ').map(n=>n[0]).join('').toUpperCase()}`} alt={customer.name} data-ai-hint="person avatar" />
                          <AvatarFallback>{customer.name.split(' ').map(n => n[0]).join('').toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium text-foreground">{customer.name}</div>
                          <div className="text-xs text-muted-foreground">Entrou em: {new Date(customer.joinDate).toLocaleDateString('pt-BR')}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-foreground">{customer.email}</div>
                      {customer.phone && <div className="text-xs text-muted-foreground">{customer.phone}</div>}
                    </TableCell>
                    <TableCell>{customer.lastPurchaseDate ? new Date(customer.lastPurchaseDate).toLocaleDateString('pt-BR') : 'N/A'}</TableCell>
                    <TableCell className="text-right font-medium text-foreground">{customer.totalSpent.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {customer.preferences.map(pref => <Badge key={pref} variant="secondary">{pref}</Badge>)}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(customer)} title="Editar Cliente">
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Editar</span>
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(customer.id)} className="text-destructive hover:text-destructive/80" title="Excluir Cliente">
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Excluir</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {filteredCustomers.length === 0 && (
            <p className="text-center text-muted-foreground py-8">Nenhum cliente encontrado.</p>
          )}
          {filteredCustomers.length > 0 && (
            <div className="flex items-center justify-between pt-4">
              <p className="text-sm text-muted-foreground">
                Mostrando {paginatedCustomers.length} de {filteredCustomers.length} clientes. Página {currentPage} de {totalPages}.
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4 mr-1" /> Anterior
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                >
                  Próxima <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
