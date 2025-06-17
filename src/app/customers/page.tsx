"use client";
import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { UserPlus, Edit, Trash2, Search, ArrowUpDown } from "lucide-react";
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
  { id: "1", name: "Alice Wonderland", email: "alice@example.com", phone: "555-0101", avatar: "https://placehold.co/40x40.png?text=AW", lastPurchaseDate: "2023-06-15", totalSpent: 1250.75, preferences: ["Dresses", "Vintage"], joinDate: "2022-01-10" },
  { id: "2", name: "Bob The Builder", email: "bob@example.com", phone: "555-0102", avatar: "https://placehold.co/40x40.png?text=BB", lastPurchaseDate: "2023-05-20", totalSpent: 875.50, preferences: ["Workwear", "Denim"], joinDate: "2022-03-05" },
  { id: "3", name: "Carol Danvers", email: "carol@example.com", phone: "555-0103", lastPurchaseDate: "2023-06-01", totalSpent: 2300.00, preferences: ["Leather", "Accessories"], joinDate: "2021-11-20" },
  { id: "4", name: "David Copperfield", email: "david@example.com", lastPurchaseDate: "2023-04-10", totalSpent: 450.20, preferences: ["Casual", "T-Shirts"], joinDate: "2023-02-15" },
  { id: "5", name: "Eve Harrington", email: "eve@example.com", phone: "555-0105", avatar: "https://placehold.co/40x40.png?text=EH", lastPurchaseDate: "2023-06-25", totalSpent: 175.90, preferences: ["Formal", "Silk"], joinDate: "2022-08-01" },
];


export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Form state for new/edit customer
  const [currentCustomer, setCurrentCustomer] = useState<Partial<Customer>>({ name: '', email: '', preferences: [] });

  const filteredCustomers = useMemo(() => {
    return customers.filter(customer =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [customers, searchTerm]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCurrentCustomer(prev => ({ ...prev, [name]: value }));
  };

  const handlePreferencesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentCustomer(prev => ({ ...prev, preferences: e.target.value.split(',').map(p => p.trim()).filter(Boolean) }));
  };

  const handleSubmit = () => {
    if (editingCustomer) { // Update existing
      setCustomers(prev => prev.map(c => c.id === editingCustomer.id ? { ...c, ...currentCustomer } as Customer : c));
    } else { // Add new
      const newCustomer: Customer = {
        id: String(Date.now()),
        joinDate: new Date().toISOString().split('T')[0],
        lastPurchaseDate: '',
        totalSpent: 0,
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
    if (window.confirm("Are you sure you want to delete this customer?")) {
      setCustomers(prev => prev.filter(c => c.id !== customerId));
    }
  };


  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-3xl font-bold font-headline text-foreground">Customer Management</h1>
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleAddNew} className="min-w-max">
              <UserPlus className="mr-2 h-4 w-4" /> Add New Customer
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{editingCustomer ? "Edit Customer" : "Add New Customer"}</DialogTitle>
              <DialogDescription>
                {editingCustomer ? "Update the customer's details." : "Fill in the details for the new customer."}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">Name</Label>
                <Input id="name" name="name" value={currentCustomer.name || ''} onChange={handleInputChange} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">Email</Label>
                <Input id="email" name="email" type="email" value={currentCustomer.email || ''} onChange={handleInputChange} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="phone" className="text-right">Phone</Label>
                <Input id="phone" name="phone" value={currentCustomer.phone || ''} onChange={handleInputChange} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="preferences" className="text-right">Preferences</Label>
                <Input id="preferences" placeholder="e.g. Dresses, Vintage" value={currentCustomer.preferences?.join(', ') || ''} onChange={handlePreferencesChange} className="col-span-3" />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
              <Button onClick={handleSubmit}>Save Customer</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Customer Database</CardTitle>
          <CardDescription>Manage customer information, purchase history, and preferences.</CardDescription>
          <div className="mt-4">
            <Input
              placeholder="Search customers by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-md"
              icon={<Search className="h-4 w-4 text-muted-foreground" />}
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead className="cursor-pointer hover:bg-muted/50"><ArrowUpDown className="inline-block mr-1 h-4 w-4" />Last Purchase</TableHead>
                  <TableHead className="text-right cursor-pointer hover:bg-muted/50"><ArrowUpDown className="inline-block mr-1 h-4 w-4" />Total Spent</TableHead>
                  <TableHead>Preferences</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCustomers.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={customer.avatar} alt={customer.name} data-ai-hint="person avatar" />
                          <AvatarFallback>{customer.name.split(' ').map(n => n[0]).join('').toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium text-foreground">{customer.name}</div>
                          <div className="text-xs text-muted-foreground">Joined: {new Date(customer.joinDate).toLocaleDateString()}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-foreground">{customer.email}</div>
                      {customer.phone && <div className="text-xs text-muted-foreground">{customer.phone}</div>}
                    </TableCell>
                    <TableCell>{customer.lastPurchaseDate ? new Date(customer.lastPurchaseDate).toLocaleDateString() : 'N/A'}</TableCell>
                    <TableCell className="text-right font-medium text-foreground">${customer.totalSpent.toFixed(2)}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {customer.preferences.map(pref => <Badge key={pref} variant="secondary">{pref}</Badge>)}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(customer)}>
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(customer.id)} className="text-destructive hover:text-destructive/80">
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {filteredCustomers.length === 0 && (
            <p className="text-center text-muted-foreground py-8">No customers found.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
