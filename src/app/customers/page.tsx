
"use client";
import { useState, useMemo, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { UserPlus, Edit, Trash2, Search, ArrowUpDown, ChevronLeft, ChevronRight, CalendarDays } from "lucide-react";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface CustomerAddress {
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string; // UF
  zipCode: string;
}

interface Customer {
  id: string;
  name: string;
  email: string;
  phoneNumbers: string[];
  cpf: string;
  birthDate: string; // YYYY-MM-DD
  sex: string;
  maritalStatus: string;
  clothingSize: string; // P, M, G, GG, G1, G2 ou 38, 40, 42
  shoeSize: string; // 35, 36, 42
  address: CustomerAddress;
  avatar?: string;
  lastPurchaseDate: string;
  totalSpent: number;
  preferences: string[];
  joinDate: string;
}

export const initialCustomers: Customer[] = [
  { id: "1", name: "Alice Wonderland", email: "alice@example.com", phoneNumbers: ["555-0101"], cpf: "111.222.333-44", birthDate: "1990-05-15", sex: "Feminino", maritalStatus: "Solteiro(a)", clothingSize: "M", shoeSize: "37", address: { street: "Rua dos Sonhos", number: "123", neighborhood: "Centro", city: "Imaginação", state: "SP", zipCode: "01001-000" }, avatar: "https://placehold.co/40x40.png", lastPurchaseDate: "2023-06-15", totalSpent: 1250.75, preferences: ["Vestidos", "Vintage"], joinDate: "2022-01-10" },
  { id: "2", name: "Bob The Builder", email: "bob@example.com", phoneNumbers: ["555-0102"], cpf: "222.333.444-55", birthDate: "1985-10-20", sex: "Masculino", maritalStatus: "Casado(a)", clothingSize: "G", shoeSize: "42", address: { street: "Avenida das Ferramentas", number: "456", neighborhood: "Industrial", city: "Construção", state: "MG", zipCode: "30110-000" }, avatar: "https://placehold.co/40x40.png", lastPurchaseDate: "2023-05-20", totalSpent: 875.50, preferences: ["Roupas de Trabalho", "Jeans"], joinDate: "2022-03-05" },
];

const ITEMS_PER_PAGE = 10;

const sexOptions = ["Feminino", "Masculino", "Outro", "Prefiro não informar"];
const maritalStatusOptions = ["Solteiro(a)", "Casado(a)", "União Estável", "Divorciado(a)", "Viúvo(a)", "Prefiro não informar"];
const brazilianStates = ["AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO"];


export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const initialFormState: Partial<Customer> = {
    name: '', email: '', preferences: [], phoneNumbers: [], cpf: '', birthDate: '', sex: '', maritalStatus: '', clothingSize: '', shoeSize: '',
    address: { street: '', number: '', complement: '', neighborhood: '', city: '', state: '', zipCode: '' }
  };
  const [currentCustomer, setCurrentCustomer] = useState<Partial<Customer>>(initialFormState);

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

  const handleAddressInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCurrentCustomer(prev => ({
      ...prev,
      address: {
        ...(prev.address || {}),
        [name]: value,
      } as CustomerAddress,
    }));
  };
  
  const handleSelectChange = (fieldName: keyof Partial<Customer>, value: string) => {
    setCurrentCustomer(prev => ({ ...prev, [fieldName]: value }));
  };

  const handleAddressSelectChange = (fieldName: keyof CustomerAddress, value: string) => {
    setCurrentCustomer(prev => ({
      ...prev,
      address: {
        ...(prev.address || {}),
        [fieldName]: value,
      } as CustomerAddress,
    }));
  };

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentCustomer(prev => ({ ...prev, phoneNumbers: e.target.value.split(',').map(p => p.trim()).filter(Boolean) }));
  };

  const handlePreferencesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentCustomer(prev => ({ ...prev, preferences: e.target.value.split(',').map(p => p.trim()).filter(Boolean) }));
  };

  const handleSubmit = () => {
    if (editingCustomer) {
      const updatedCustomerData = {
        ...editingCustomer,
        ...currentCustomer,
        address: {
          ...(editingCustomer.address || {}),
          ...(currentCustomer.address || {}),
        },
      } as Customer;
      setCustomers(prev => prev.map(c => c.id === editingCustomer.id ? updatedCustomerData : c));
    } else {
      const newCustomerData: Customer = {
        id: String(Date.now()),
        name: currentCustomer.name || "",
        email: currentCustomer.email || "",
        phoneNumbers: currentCustomer.phoneNumbers || [],
        cpf: currentCustomer.cpf || "",
        birthDate: currentCustomer.birthDate || "",
        sex: currentCustomer.sex || "",
        maritalStatus: currentCustomer.maritalStatus || "",
        clothingSize: currentCustomer.clothingSize || "",
        shoeSize: currentCustomer.shoeSize || "",
        address: {
          street: currentCustomer.address?.street || "",
          number: currentCustomer.address?.number || "",
          complement: currentCustomer.address?.complement || "",
          neighborhood: currentCustomer.address?.neighborhood || "",
          city: currentCustomer.address?.city || "",
          state: currentCustomer.address?.state || "",
          zipCode: currentCustomer.address?.zipCode || "",
        },
        preferences: currentCustomer.preferences || [],
        joinDate: new Date().toISOString().split('T')[0],
        lastPurchaseDate: '', 
        totalSpent: 0,
        avatar: currentCustomer.avatar || `https://placehold.co/40x40.png?text=${(currentCustomer.name || 'N A').split(' ').map(n=>n[0]).join('').toUpperCase()}`
      };
      setCustomers(prev => [newCustomerData, ...prev]);
    }
    setIsFormOpen(false);
    setEditingCustomer(null);
    setCurrentCustomer(initialFormState);
  };

  const handleEdit = (customer: Customer) => {
    setEditingCustomer(customer);
    setCurrentCustomer({ ...customer });
    setIsFormOpen(true);
  };
  
  const handleAddNew = () => {
    setEditingCustomer(null);
    setCurrentCustomer(initialFormState);
    setIsFormOpen(true);
  };

  const handleDelete = (customerId: string) => {
    if (window.confirm("Tem certeza que deseja excluir este cliente?")) {
      setCustomers(prev => prev.filter(c => c.id !== customerId));
    }
  };

  useEffect(() => {
    setCurrentPage(1); 
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
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingCustomer ? "Editar Cliente" : "Adicionar Novo Cliente"}</DialogTitle>
              <DialogDescription>
                {editingCustomer ? "Atualize os detalhes do cliente." : "Preencha os detalhes para o novo cliente."}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto pr-4">
              {/* Dados Pessoais */}
              <h3 className="text-lg font-semibold col-span-full">Dados Pessoais</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><Label htmlFor="name">Nome Completo</Label><Input id="name" name="name" value={currentCustomer.name || ''} onChange={handleInputChange} /></div>
                <div><Label htmlFor="email">E-mail</Label><Input id="email" name="email" type="email" value={currentCustomer.email || ''} onChange={handleInputChange} /></div>
                <div><Label htmlFor="phoneNumbers">Telefone(s) (separados por vírgula)</Label><Input id="phoneNumbers" name="phoneNumbers" value={currentCustomer.phoneNumbers?.join(', ') || ''} onChange={handlePhoneNumberChange} /></div>
                <div><Label htmlFor="cpf">CPF</Label><Input id="cpf" name="cpf" value={currentCustomer.cpf || ''} onChange={handleInputChange} /></div>
                <div className="relative">
                  <Label htmlFor="birthDate">Data de Nascimento</Label>
                  <Input 
                    id="birthDate" 
                    name="birthDate" 
                    type="date" 
                    value={currentCustomer.birthDate || ''} 
                    onChange={handleInputChange} 
                    className="pr-10"
                  />
                  <CalendarDays className="absolute right-3 top-1/2 -translate-y-1/2 mt-3 h-5 w-5 text-muted-foreground pointer-events-none" />
                </div>
                <div>
                  <Label htmlFor="sex">Sexo</Label>
                  <Select value={currentCustomer.sex || ''} onValueChange={(value) => handleSelectChange('sex', value)}>
                    <SelectTrigger id="sex"><SelectValue placeholder="Selecione o sexo" /></SelectTrigger>
                    <SelectContent>{sexOptions.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="maritalStatus">Estado Civil</Label>
                  <Select value={currentCustomer.maritalStatus || ''} onValueChange={(value) => handleSelectChange('maritalStatus', value)}>
                    <SelectTrigger id="maritalStatus"><SelectValue placeholder="Selecione o estado civil" /></SelectTrigger>
                    <SelectContent>{maritalStatusOptions.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
              </div>

              {/* Preferências de Tamanho */}
              <h3 className="text-lg font-semibold col-span-full mt-4">Preferências de Tamanho</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><Label htmlFor="clothingSize">Tamanho de Roupa (ex: G, 42)</Label><Input id="clothingSize" name="clothingSize" value={currentCustomer.clothingSize || ''} onChange={handleInputChange} /></div>
                <div><Label htmlFor="shoeSize">Tamanho de Calçado (ex: 38)</Label><Input id="shoeSize" name="shoeSize" value={currentCustomer.shoeSize || ''} onChange={handleInputChange} /></div>
              </div>

              {/* Endereço */}
              <h3 className="text-lg font-semibold col-span-full mt-4">Endereço</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><Label htmlFor="address.zipCode">CEP</Label><Input id="address.zipCode" name="zipCode" value={currentCustomer.address?.zipCode || ''} onChange={handleAddressInputChange} /></div>
                <div><Label htmlFor="address.street">Logradouro (Rua/Avenida)</Label><Input id="address.street" name="street" value={currentCustomer.address?.street || ''} onChange={handleAddressInputChange} /></div>
                <div><Label htmlFor="address.number">Número</Label><Input id="address.number" name="number" value={currentCustomer.address?.number || ''} onChange={handleAddressInputChange} /></div>
                <div><Label htmlFor="address.complement">Complemento</Label><Input id="address.complement" name="complement" value={currentCustomer.address?.complement || ''} onChange={handleAddressInputChange} /></div>
                <div><Label htmlFor="address.neighborhood">Bairro</Label><Input id="address.neighborhood" name="neighborhood" value={currentCustomer.address?.neighborhood || ''} onChange={handleAddressInputChange} /></div>
                <div><Label htmlFor="address.city">Cidade</Label><Input id="address.city" name="city" value={currentCustomer.address?.city || ''} onChange={handleAddressInputChange} /></div>
                <div>
                  <Label htmlFor="address.state">Estado (UF)</Label>
                  <Select value={currentCustomer.address?.state || ''} onValueChange={(value) => handleAddressSelectChange('state', value)}>
                    <SelectTrigger id="address.state"><SelectValue placeholder="Selecione o estado" /></SelectTrigger>
                    <SelectContent>{brazilianStates.map(st => <SelectItem key={st} value={st}>{st}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
              </div>
              
              {/* Outras Preferências */}
              <h3 className="text-lg font-semibold col-span-full mt-4">Outras Preferências</h3>
               <div>
                <Label htmlFor="preferences">Preferências de Estilo (separadas por vírgula)</Label>
                <Input id="preferences" placeholder="ex: Vestidos, Vintage" value={currentCustomer.preferences?.join(', ') || ''} onChange={handlePreferencesChange} />
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
                  <TableHead>CPF</TableHead>
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
                      {customer.phoneNumbers && customer.phoneNumbers.length > 0 && <div className="text-xs text-muted-foreground">{customer.phoneNumbers.join(', ')}</div>}
                    </TableCell>
                    <TableCell>{customer.cpf}</TableCell>
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
