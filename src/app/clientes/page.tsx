
"use client";
import { useState, useMemo, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { UserPlus, Edit, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
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
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

// Data structures for a customer
interface CustomerAddress {
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
}

interface Customer {
  id: string;
  name: string;
  email: string;
  phoneNumbers: string[];
  cpf: string;
  birthDate: string; // Stored as YYYY-MM-DD
  sex: string;
  maritalStatus: string;
  clothingSize: string;
  shoeSize: string;
  address: CustomerAddress;
  avatar?: string;
  lastPurchaseDate: string; // Stored as YYYY-MM-DD
  totalSpent: number;
  preferences: string[];
  joinDate: string; // Stored as YYYY-MM-DD
}

// API and form constants
const API_BASE_URL = 'https://sheetdb.io/api/v1/z1jkiua66i9yk';
const SHEET_NAME = 'Tabela1';
const ITEMS_PER_PAGE = 10;
const sexOptions = ["Feminino", "Masculino", "Outro", "Prefiro não informar"];
const maritalStatusOptions = ["Solteiro(a)", "Casado(a)", "União Estável", "Divorciado(a)", "Viúvo(a)", "Prefiro não informar"];
const brazilianStates = ["AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO"];

// Robust date parsing function
const safeParseDate = (dateString: string | undefined): Date | null => {
    if (!dateString) return null;
    let d: Date | undefined;

    // Try parsing yyyy-MM-dd
    if (/^\d{4}-\d{2}-\d{2}/.test(dateString)) {
        d = new Date(dateString.substring(0, 10) + "T00:00:00Z");
        if (!isNaN(d.getTime())) return d;
    }
    
    // Then try parsing dd/MM/yyyy
    const parts = dateString.split('/');
    if (parts.length === 3) {
        const [day, month, year] = parts.map(p => parseInt(p, 10));
        if (!isNaN(year) && !isNaN(month) && !isNaN(day) && year > 1000) {
            d = new Date(Date.UTC(year, month - 1, day));
            if (!isNaN(d.getTime())) return d;
        }
    }

    // Fallback for other potential formats
    d = new Date(dateString);
    if (!isNaN(d.getTime())) return d;

    return null;
};

const parseAddress = (addressString: string | undefined): CustomerAddress => {
  const emptyAddress: CustomerAddress = { street: '', number: '', complement: '', neighborhood: '', city: '', state: '', zipCode: '' };
  if (!addressString) return emptyAddress;

  const parts = addressString.split(';').map(p => p.trim());
  return {
    street: parts[0] || '',
    number: parts[1] || '',
    complement: parts[2] || '',
    neighborhood: parts[3] || '',
    city: parts[4] || '',
    state: parts[5] || '',
    zipCode: parts[6] || '',
  };
};

export default function ClientesPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const { toast } = useToast();

  const initialFormState: Partial<Customer> = {
    name: '', email: '', preferences: [], phoneNumbers: [], cpf: '', birthDate: '', sex: '', maritalStatus: '', clothingSize: '', shoeSize: '',
    address: { street: '', number: '', complement: '', neighborhood: '', city: '', state: '', zipCode: '' }
  };
  const [currentCustomer, setCurrentCustomer] = useState<Partial<Customer>>(initialFormState);

  // Fetch customers from the API
  const fetchCustomers = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}?sheet=${SHEET_NAME}`);
      if (!response.ok) throw new Error('Falha ao buscar clientes.');
      const data = await response.json();
      
      if (!Array.isArray(data)) {
        throw new Error("A API não retornou uma lista de clientes.");
      }

      const parsedCustomers: Customer[] = data
        .map((item: any): Customer | null => {
            // This inner try-catch prevents one bad row from crashing the whole page
            try {
                let outrosData: any = {};
                if (item.OUTROS) {
                    try {
                        outrosData = JSON.parse(item.OUTROS);
                    } catch (e) {
                        console.error("Falha ao analisar o campo OUTROS (será ignorado para esta linha):", item.OUTROS, e);
                    }
                }
                
                const parsedBirthDate = safeParseDate(item.NASCIMENTO);
                const parsedJoinDate = safeParseDate(item.joinDate || outrosData.joinDate);
                const parsedLastPurchaseDate = safeParseDate(item.lastPurchaseDate || outrosData.lastPurchaseDate);

                return {
                    id: item.ID,
                    name: item.NOME || '',
                    email: item.EMAIL || '',
                    phoneNumbers: item.TELEFONES ? item.TELEFONES.split(',').map((p:string) => p.trim()) : [],
                    cpf: item.CPF || '',
                    birthDate: parsedBirthDate ? format(parsedBirthDate, 'yyyy-MM-dd') : '',
                    sex: item.SEXO || '',
                    maritalStatus: item['ESTADO CIVIL'] || '',
                    clothingSize: item['TAMANHO ROUPA'] || '',
                    shoeSize: item['TAMANHO CALCADO'] || '',
                    address: parseAddress(item['ENDEREÇO']),
                    avatar: outrosData.avatar || '',
                    lastPurchaseDate: parsedLastPurchaseDate ? format(parsedLastPurchaseDate, 'yyyy-MM-dd') : '',
                    totalSpent: parseFloat(outrosData.totalSpent) || 0,
                    preferences: outrosData.preferences || [],
                    joinDate: parsedJoinDate ? format(parsedJoinDate, 'yyyy-MM-dd') : '',
                };
            } catch (error) {
                console.error("Falha ao processar registro de cliente (registro ignorado):", item, error);
                toast({ title: "Aviso", description: "Um registro de cliente não pôde ser carregado.", variant: "default" });
                return null;
            }
        })
        .filter((c): c is Customer => c !== null); 

      setCustomers(parsedCustomers.reverse());
    } catch (error) {
      console.error(error);
      toast({ title: "Erro", description: "Não foi possível carregar os clientes. Verifique a conexão com a API.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  // Memoized calculations for performance
  const filteredCustomers = useMemo(() => {
    return customers.filter(customer =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [customers, searchTerm]);

  const totalPages = Math.ceil(filteredCustomers.length / ITEMS_PER_PAGE);
  const paginatedCustomers = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredCustomers.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredCustomers, currentPage]);
  
  // Form input handlers
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCurrentCustomer(prev => ({ ...prev, [name]: value }));
  };

  const handleAddressInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCurrentCustomer(prev => ({
      ...prev,
      address: { ...(prev.address || {}), [name]: value } as CustomerAddress,
    }));
  };
  
  const handleSelectChange = (fieldName: keyof Partial<Customer>, value: string) => {
    setCurrentCustomer(prev => ({ ...prev, [fieldName]: value }));
  };

  const handleAddressSelectChange = (fieldName: keyof CustomerAddress, value: string) => {
    setCurrentCustomer(prev => ({
      ...prev,
      address: { ...(prev.address || {}), [fieldName]: value } as CustomerAddress,
    }));
  };

  const handleListChange = (fieldName: 'phoneNumbers' | 'preferences', value: string) => {
     setCurrentCustomer(prev => ({ ...prev, [fieldName]: value.split(',').map(p => p.trim()).filter(Boolean) }));
  };
  
  // Prepare data for SheetDB API format
  const prepareDataForApi = (customer: Partial<Customer>) => {
    const addressParts = [
      customer.address?.street || '',
      customer.address?.number || '',
      customer.address?.complement || '',
      customer.address?.neighborhood || '',
      customer.address?.city || '',
      customer.address?.state || '',
      customer.address?.zipCode || ''
    ];
    const fullAddress = addressParts.join(';');

    const outrosData = JSON.stringify({
      preferences: customer.preferences || [],
      avatar: customer.avatar || '',
      lastPurchaseDate: customer.lastPurchaseDate || '',
      totalSpent: customer.totalSpent || 0,
      joinDate: customer.joinDate || new Date().toISOString().split('T')[0],
    });

    return {
      'ID': customer.id,
      'NOME': customer.name,
      'EMAIL': customer.email,
      'TELEFONES': customer.phoneNumbers?.join(', '),
      'CPF': customer.cpf,
      'NASCIMENTO': customer.birthDate || '', // Should be yyyy-MM-dd
      'SEXO': customer.sex,
      'ESTADO CIVIL': customer.maritalStatus,
      'TAMANHO ROUPA': customer.clothingSize,
      'TAMANHO CALCADO': customer.shoeSize,
      'ENDEREÇO': fullAddress,
      'OUTROS': outrosData,
    };
  };

  // Handle form submission (Create/Update)
  const handleSubmit = async () => {
    const url = editingCustomer 
        ? `${API_BASE_URL}/ID/${editingCustomer.id}?sheet=${SHEET_NAME}`
        : `${API_BASE_URL}?sheet=${SHEET_NAME}`;
        
    const method = editingCustomer ? 'PUT' : 'POST';

    let customerToSubmit: Partial<Customer>;
    if (editingCustomer) {
        customerToSubmit = { ...editingCustomer, ...currentCustomer };
    } else {
        customerToSubmit = {
            id: String(Date.now()),
            ...currentCustomer,
            joinDate: new Date().toISOString().split('T')[0],
            lastPurchaseDate: '', 
            totalSpent: 0,
            avatar: currentCustomer.avatar || `https://placehold.co/40x40.png?text=${(currentCustomer.name || 'NA').split(' ').map(n=>n[0]).join('').toUpperCase()}`
        };
    }
    
    const apiData = prepareDataForApi(customerToSubmit);
    const body = method === 'POST' ? JSON.stringify({ data: [apiData] }) : JSON.stringify(apiData);

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body,
      });

      if (!response.ok) {
          const errorData = await response.text();
          throw new Error(`Falha ao salvar cliente. Status: ${response.status}. Resposta: ${errorData}`);
      }
      
      toast({ title: "Sucesso!", description: `Cliente ${editingCustomer ? 'atualizado' : 'adicionado'} com sucesso.` });
      setIsFormOpen(false);
      setEditingCustomer(null);
      setCurrentCustomer(initialFormState);
      fetchCustomers(); // Refresh data
    } catch (error) {
      console.error(error);
      toast({ title: "Erro", description: `Não foi possível salvar o cliente. Verifique o console para mais detalhes.`, variant: "destructive" });
    }
  };

  // Handlers for UI actions
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

  const handleDelete = async (customerId: string) => {
    const customerToDelete = customers.find(c => c.id === customerId);
    if (!customerToDelete || !window.confirm(`Tem certeza que deseja excluir o cliente ${customerToDelete.name}?`)) {
        return;
    }
    
    try {
      const response = await fetch(`${API_BASE_URL}/ID/${customerToDelete.id}?sheet=${SHEET_NAME}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Falha ao excluir cliente.');
      toast({ title: "Sucesso!", description: "Cliente excluído com sucesso." });
      fetchCustomers(); // Refresh data
    } catch (error) {
      console.error(error);
      toast({ title: "Erro", description: "Não foi possível excluir o cliente.", variant: "destructive" });
    }
  };

  useEffect(() => {
    setCurrentPage(1); // Reset page on new search
  }, [searchTerm]);

  const SkeletonRow = () => (
    <TableRow>
      <TableCell className="w-[300px]">
        <div className="flex items-center gap-3"><Skeleton className="h-10 w-10 rounded-full" /><div className="space-y-2"><Skeleton className="h-4 w-[150px]" /><Skeleton className="h-3 w-[100px]" /></div></div>
      </TableCell>
      <TableCell className="w-[250px]"><div className="space-y-2"><Skeleton className="h-4 w-full" /><Skeleton className="h-3 w-3/4" /></div></TableCell>
      <TableCell><Skeleton className="h-4 w-[120px]" /></TableCell>
      <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
      <TableCell className="text-right"><Skeleton className="h-4 w-[100px] ml-auto" /></TableCell>
      <TableCell><Skeleton className="h-4 w-[150px]" /></TableCell>
      <TableCell className="text-right"><div className="flex gap-2 justify-end"><Skeleton className="h-8 w-8" /><Skeleton className="h-8 w-8" /></div></TableCell>
    </TableRow>
  );

  const displayDate = (dateString: string) => {
    const date = safeParseDate(dateString);
    return date ? format(date, "dd/MM/yyyy", { locale: ptBR }) : 'N/A';
  };
  
  // Component JSX
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
              <DialogDescription>{editingCustomer ? "Atualize os detalhes do cliente." : "Preencha os detalhes para o novo cliente."}</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto pr-4">
              <h3 className="text-lg font-semibold col-span-full">Dados Pessoais</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><Label htmlFor="name">Nome Completo</Label><Input id="name" name="name" value={currentCustomer.name || ''} onChange={handleInputChange} /></div>
                <div><Label htmlFor="email">E-mail</Label><Input id="email" name="email" type="email" value={currentCustomer.email || ''} onChange={handleInputChange} /></div>
                <div><Label htmlFor="phoneNumbers">Telefone(s) (separados por vírgula)</Label><Input id="phoneNumbers" value={currentCustomer.phoneNumbers?.join(', ') || ''} onChange={(e) => handleListChange('phoneNumbers', e.target.value)} /></div>
                <div><Label htmlFor="cpf">CPF</Label><Input id="cpf" name="cpf" value={currentCustomer.cpf || ''} onChange={handleInputChange} /></div>
                <div><Label htmlFor="birthDate">Data de Nascimento</Label><Input id="birthDate" name="birthDate" type="date" value={currentCustomer.birthDate || ''} onChange={handleInputChange} className="w-full"/></div>
                <div><Label htmlFor="sex">Sexo</Label><Select value={currentCustomer.sex || ''} onValueChange={(v) => handleSelectChange('sex', v)}><SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger><SelectContent>{sexOptions.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}</SelectContent></Select></div>
                <div><Label htmlFor="maritalStatus">Estado Civil</Label><Select value={currentCustomer.maritalStatus || ''} onValueChange={(v) => handleSelectChange('maritalStatus', v)}><SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger><SelectContent>{maritalStatusOptions.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}</SelectContent></Select></div>
              </div>

              <h3 className="text-lg font-semibold col-span-full mt-4">Preferências de Tamanho</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><Label htmlFor="clothingSize">Tamanho de Roupa (ex: G, 42)</Label><Input id="clothingSize" name="clothingSize" value={currentCustomer.clothingSize || ''} onChange={handleInputChange} /></div>
                <div><Label htmlFor="shoeSize">Tamanho de Calçado (ex: 38)</Label><Input id="shoeSize" name="shoeSize" value={currentCustomer.shoeSize || ''} onChange={handleInputChange} /></div>
              </div>

              <h3 className="text-lg font-semibold col-span-full mt-4">Endereço</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><Label htmlFor="address.zipCode">CEP</Label><Input name="zipCode" value={currentCustomer.address?.zipCode || ''} onChange={handleAddressInputChange} /></div>
                <div><Label htmlFor="address.street">Logradouro (Rua/Avenida)</Label><Input name="street" value={currentCustomer.address?.street || ''} onChange={handleAddressInputChange} /></div>
                <div><Label htmlFor="address.number">Número</Label><Input name="number" value={currentCustomer.address?.number || ''} onChange={handleAddressInputChange} /></div>
                <div><Label htmlFor="address.complement">Complemento</Label><Input name="complement" value={currentCustomer.address?.complement || ''} onChange={handleAddressInputChange} /></div>
                <div><Label htmlFor="address.neighborhood">Bairro</Label><Input name="neighborhood" value={currentCustomer.address?.neighborhood || ''} onChange={handleAddressInputChange} /></div>
                <div><Label htmlFor="address.city">Cidade</Label><Input name="city" value={currentCustomer.address?.city || ''} onChange={handleAddressInputChange} /></div>
                <div><Label htmlFor="address.state">Estado (UF)</Label><Select value={currentCustomer.address?.state || ''} onValueChange={(v) => handleAddressSelectChange('state', v)}><SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger><SelectContent>{brazilianStates.map(st => <SelectItem key={st} value={st}>{st}</SelectItem>)}</SelectContent></Select></div>
              </div>
              
              <h3 className="text-lg font-semibold col-span-full mt-4">Outras Preferências</h3>
              <div><Label htmlFor="preferences">Preferências de Estilo (separadas por vírgula)</Label><Input id="preferences" placeholder="ex: Vestidos, Vintage" value={currentCustomer.preferences?.join(', ') || ''} onChange={(e) => handleListChange('preferences', e.target.value)} /></div>
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
          <div className="mt-4"><Input placeholder="Buscar clientes por nome ou e-mail..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="max-w-md" /></div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Contato</TableHead>
                  <TableHead>CPF</TableHead>
                  <TableHead>Última Compra</TableHead>
                  <TableHead className="text-right">Total Gasto</TableHead>
                  <TableHead>Preferências</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
                ) : paginatedCustomers.length > 0 ? (
                  paginatedCustomers.map((customer) => (
                    <TableRow key={customer.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={customer.avatar || `https://placehold.co/40x40.png?text=${customer.name.split(' ').map(n=>n[0]).join('').toUpperCase()}`} alt={customer.name} data-ai-hint="person avatar" />
                            <AvatarFallback>{customer.name.split(' ').map(n => n[0]).join('').toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium text-foreground">{customer.name}</div>
                            <div className="text-xs text-muted-foreground">Entrou em: {displayDate(customer.joinDate)}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell><div className="text-sm text-foreground">{customer.email}</div>{customer.phoneNumbers.length > 0 && <div className="text-xs text-muted-foreground">{customer.phoneNumbers.join(', ')}</div>}</TableCell>
                      <TableCell>{customer.cpf}</TableCell>
                      <TableCell>{displayDate(customer.lastPurchaseDate)}</TableCell>
                      <TableCell className="text-right font-medium text-foreground">{customer.totalSpent.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</TableCell>
                      <TableCell><div className="flex flex-wrap gap-1">{customer.preferences.map(pref => <Badge key={pref} variant="secondary">{pref}</Badge>)}</div></TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(customer)} title="Editar Cliente"><Edit className="h-4 w-4" /><span className="sr-only">Editar</span></Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(customer.id)} className="text-destructive hover:text-destructive/80" title="Excluir Cliente"><Trash2 className="h-4 w-4" /><span className="sr-only">Excluir</span></Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : null}
              </TableBody>
            </Table>
          </div>
          {!isLoading && filteredCustomers.length === 0 && (
            <p className="text-center text-muted-foreground py-8">Nenhum cliente encontrado.</p>
          )}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-4">
              <p className="text-sm text-muted-foreground">Página {currentPage} de {totalPages}</p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}><ChevronLeft className="h-4 w-4 mr-1" /> Anterior</Button>
                <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>Próxima <ChevronRight className="h-4 w-4 ml-1" /></Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
