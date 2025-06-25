
"use client";
import { useState, useMemo, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePickerWithRange } from "@/components/ui/date-picker-range";
import { PackageSearch, TrendingUp, DollarSign, Filter, Edit3, AlertCircle, ArrowUpDown, CalendarDays, PlusCircle, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { Checkbox } from "@/components/ui/checkbox";
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


interface Product {
  id: string;
  name: string;
  sku: string;
  stock: number;
  unitPrice: number;
  markup: number; 
  category: string;
  supplier: string;
  lastOrderDate: string;
  image?: string;
  profitability: number; 
  salesVolume: number; 
}

const initialProducts: Product[] = [
  { id: "1", name: "Camiseta Branca Clássica", sku: "CWT001", stock: 150, unitPrice: 15.00, markup: 50, category: "Blusas", supplier: "Vestuário Cia.", lastOrderDate: "2023-05-10", image: "https://placehold.co/80x80.png", profitability: 7.50, salesVolume: 200 },
  { id: "2", name: "Calça Jeans Slim Fit", sku: "SFJ002", stock: 80, unitPrice: 45.00, markup: 60, category: "Partes de Baixo", supplier: "Jeans Expresso", lastOrderDate: "2023-04-22", image: "https://placehold.co/80x80.png", profitability: 27.00, salesVolume: 90 },
  { id: "3", name: "Cachecol de Mistura de Lã", sku: "WBS003", stock: 20, unitPrice: 25.00, markup: 40, category: "Acessórios", supplier: "Malhas Quentes Ltda.", lastOrderDate: "2023-06-01", image: "https://placehold.co/80x80.png", profitability: 10.00, salesVolume: 50 },
  { id: "4", name: "Botins de Couro", sku: "LAB004", stock: 45, unitPrice: 120.00, markup: 70, category: "Calçados", supplier: "Calçados Finos Inc.", lastOrderDate: "2023-03-15", image: "https://placehold.co/80x80.png", profitability: 84.00, salesVolume: 30 },
  { id: "5", name: "Vestido Longo Floral", sku: "FMD005", stock: 5, unitPrice: 75.00, markup: 55, category: "Vestidos", supplier: "Designs Elegantes", lastOrderDate: "2023-05-25", image: "https://placehold.co/80x80.png", profitability: 41.25, salesVolume: 15 },
];

const categories = ["Todos", "Blusas", "Partes de Baixo", "Vestidos", "Acessórios", "Calçados", "Casacos", "Saias", "Moda Praia"];
const suppliersList = ["Todos", "Vestuário Cia.", "Jeans Expresso", "Malhas Quentes Ltda.", "Calçados Finos Inc.", "Designs Elegantes", "Fornecedor Alpha", "Importados Beta"];

const productCategories = categories.filter(c => c !== "Todos");
const productSuppliers = suppliersList.filter(s => s !== "Todos");

const ITEMS_PER_PAGE = 10;
const LOCAL_STORAGE_KEY_PRODUCTS = 'vestuario-erp-products';

export default function StockPage() {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [isDataInitialized, setIsDataInitialized] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("Todos");
  const [supplierFilter, setSupplierFilter] = useState("Todos");
  const [showLowStockOnly, setShowLowStockOnly] = useState(false);
  const lowStockThreshold = 10;

  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [currentMarkup, setCurrentMarkup] = useState(0);
  const [dateRange, setDateRange] = useState<object | undefined>(undefined);

  const [isAddProductDialogOpen, setIsAddProductDialogOpen] = useState(false);
  const [newProductForm, setNewProductForm] = useState<Partial<Omit<Product, 'id' | 'profitability' | 'salesVolume' | 'lastOrderDate'>>>({
    name: "",
    sku: "",
    stock: 0,
    unitPrice: 0,
    markup: 0,
    category: productCategories[0] || "",
    supplier: productSuppliers[0] || "",
    image: "",
  });

  const [currentPage, setCurrentPage] = useState(1);

  // Load products from localStorage on initial client render
  useEffect(() => {
    try {
      const storedProducts = localStorage.getItem(LOCAL_STORAGE_KEY_PRODUCTS);
      if (storedProducts) {
        setProducts(JSON.parse(storedProducts));
      } else {
        // If nothing is in storage, set initial products and save them
        localStorage.setItem(LOCAL_STORAGE_KEY_PRODUCTS, JSON.stringify(initialProducts));
      }
    } catch (error) {
      console.error("Failed to access localStorage for products:", error);
      // Fallback to initial products in case of error
      setProducts(initialProducts);
    }
    setIsDataInitialized(true);
  }, []);

  // Save products to localStorage whenever they change
  useEffect(() => {
    if (isDataInitialized) {
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY_PRODUCTS, JSON.stringify(products));
      } catch (error) {
        console.error("Failed to save products to localStorage:", error);
      }
    }
  }, [products, isDataInitialized]);


  const filteredProducts = useMemo(() => {
    return products.filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (categoryFilter === "Todos" || product.category === categoryFilter) &&
      (supplierFilter === "Todos" || product.supplier === supplierFilter) &&
      (!showLowStockOnly || product.stock < lowStockThreshold)
    );
  }, [products, searchTerm, categoryFilter, supplierFilter, showLowStockOnly]);
  
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredProducts.slice(startIndex, endIndex);
  }, [filteredProducts, currentPage]);


  const insights = useMemo(() => {
    const sortedByOutput = [...products].sort((a, b) => (b.salesVolume ?? 0) - (a.salesVolume ?? 0)).slice(0, 5);
    const sortedByProfitability = [...products].sort((a, b) => (b.profitability ?? 0) - (a.profitability ?? 0)).slice(0, 5);
    const needsReplacement = products.filter(p => p.stock < lowStockThreshold);
    return { sortedByOutput, sortedByProfitability, needsReplacement };
  }, [products]);

  const handleEditMarkup = (product: Product) => {
    setEditingProduct(product);
    setCurrentMarkup(product.markup);
  };

  const handleSaveMarkup = () => {
    if (editingProduct) {
      setProducts(prev => prev.map(p => p.id === editingProduct.id ? { ...p, markup: currentMarkup, profitability: p.unitPrice * (currentMarkup / 100) } : p));
      setEditingProduct(null);
    }
  };

  const handleNewProductInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewProductForm(prev => ({ ...prev, [name]: name === 'stock' || name === 'unitPrice' || name === 'markup' ? parseFloat(value) || 0 : value }));
  };

  const handleNewProductSelectChange = (name: string, value: string) => {
    setNewProductForm(prev => ({ ...prev, [name]: value }));
  };

  const handleAddProduct = () => {
    if (!newProductForm.name || !newProductForm.sku || !newProductForm.category || !newProductForm.supplier) {
      alert("Por favor, preencha todos os campos obrigatórios (Nome, SKU, Categoria, Fornecedor).");
      return;
    }

    const newProduct: Product = {
      id: String(Date.now()),
      name: newProductForm.name!,
      sku: newProductForm.sku!,
      stock: newProductForm.stock || 0,
      unitPrice: newProductForm.unitPrice || 0,
      markup: newProductForm.markup || 0,
      category: newProductForm.category!,
      supplier: newProductForm.supplier!,
      image: newProductForm.image || `https://placehold.co/80x80.png?text=${newProductForm.name?.substring(0,2).toUpperCase() || 'P'}`,
      lastOrderDate: new Date().toISOString().split('T')[0],
      profitability: (newProductForm.unitPrice || 0) * ((newProductForm.markup || 0) / 100),
      salesVolume: 0,
    };
    setProducts(prev => [newProduct, ...prev]);
    setIsAddProductDialogOpen(false);
    setNewProductForm({
      name: "", sku: "", stock: 0, unitPrice: 0, markup: 0,
      category: productCategories[0] || "", supplier: productSuppliers[0] || "", image: ""
    });
  };
  
  useEffect(() => {
    setCurrentPage(1); // Reset to first page when filters change
  }, [searchTerm, categoryFilter, supplierFilter, showLowStockOnly]);


  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold font-headline text-foreground">Gerenciamento de Estoque</h1>

      <Dialog open={isAddProductDialogOpen} onOpenChange={setIsAddProductDialogOpen}>
        <DialogTrigger asChild>
          <Button className="fixed bottom-6 right-6 z-50 shadow-lg rounded-full p-4 h-auto" size="lg">
            <PlusCircle className="h-6 w-6 mr-2" /> Adicionar Novo Produto
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Adicionar Novo Produto</DialogTitle>
            <DialogDescription>Preencha os detalhes do novo produto para adicioná-lo ao estoque.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto pr-2">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">Nome*</Label>
              <Input id="name" name="name" value={newProductForm.name} onChange={handleNewProductInputChange} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="sku" className="text-right">SKU*</Label>
              <Input id="sku" name="sku" value={newProductForm.sku} onChange={handleNewProductInputChange} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="stock" className="text-right">Estoque Inicial</Label>
              <Input id="stock" name="stock" type="number" value={newProductForm.stock} onChange={handleNewProductInputChange} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="unitPrice" className="text-right">Preço Unit. (Custo)</Label>
              <Input id="unitPrice" name="unitPrice" type="number" step="0.01" value={newProductForm.unitPrice} onChange={handleNewProductInputChange} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="markup" className="text-right">Markup (%)</Label>
              <Input id="markup" name="markup" type="number" value={newProductForm.markup} onChange={handleNewProductInputChange} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category" className="text-right">Categoria*</Label>
              <Select name="category" value={newProductForm.category} onValueChange={(value) => handleNewProductSelectChange("category", value)}>
                <SelectTrigger className="col-span-3"><SelectValue placeholder="Selecione uma categoria" /></SelectTrigger>
                <SelectContent>
                  {productCategories.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="supplier" className="text-right">Fornecedor*</Label>
               <Select name="supplier" value={newProductForm.supplier} onValueChange={(value) => handleNewProductSelectChange("supplier", value)}>
                <SelectTrigger className="col-span-3"><SelectValue placeholder="Selecione um fornecedor" /></SelectTrigger>
                <SelectContent>
                  {productSuppliers.map(sup => <SelectItem key={sup} value={sup}>{sup}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
             <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="image" className="text-right">URL da Imagem</Label>
              <Input id="image" name="image" placeholder="https://placehold.co/80x80.png" value={newProductForm.image} onChange={handleNewProductInputChange} className="col-span-3" />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild><Button variant="outline">Cancelar</Button></DialogClose>
            <Button onClick={handleAddProduct}>Adicionar Produto</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>


      <Tabs defaultValue="all-products">
        <TabsList className="grid w-full grid-cols-1 md:grid-cols-3 gap-2 mb-6">
          <TabsTrigger value="all-products" className="text-sm py-2.5">
            <PackageSearch className="mr-2 h-4 w-4" /> Todos os Produtos
          </TabsTrigger>
          <TabsTrigger value="insights" className="text-sm py-2.5">
            <TrendingUp className="mr-2 h-4 w-4" /> Insights de Estoque
          </TabsTrigger>
          <TabsTrigger value="edit-markup" className="text-sm py-2.5">
            <DollarSign className="mr-2 h-4 w-4" /> Editar Margem de Lucro
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all-products">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Lista de Produtos</CardTitle>
              <CardDescription>Visualize e gerencie seu inventário de produtos atual.</CardDescription>
              <div className="mt-4 flex flex-col md:flex-row gap-4 items-center">
                <Input
                  placeholder="Buscar produtos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-sm"
                />
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-full md:w-[180px]">
                    <SelectValue placeholder="Filtrar por categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                  </SelectContent>
                </Select>
                <Select value={supplierFilter} onValueChange={setSupplierFilter}>
                  <SelectTrigger className="w-full md:w-[180px]">
                    <SelectValue placeholder="Filtrar por fornecedor" />
                  </SelectTrigger>
                  <SelectContent>
                    {suppliersList.map(sup => <SelectItem key={sup} value={sup}>{sup}</SelectItem>)}
                  </SelectContent>
                </Select>
                <div className="flex items-center space-x-2">
                  <Checkbox id="lowStock" checked={showLowStockOnly} onCheckedChange={(checked) => setShowLowStockOnly(Boolean(checked))} />
                  <label htmlFor="lowStock" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Apenas Estoque Baixo ({`<${lowStockThreshold}`})
                  </label>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Imagem</TableHead>
                      <TableHead className="cursor-pointer hover:bg-muted/50"><ArrowUpDown className="inline-block mr-1 h-4 w-4" />Nome</TableHead>
                      <TableHead>SKU</TableHead>
                      <TableHead className="text-right">Estoque</TableHead>
                      <TableHead className="text-right">Preço Custo</TableHead>
                      <TableHead className="text-right">Margem (%)</TableHead>
                      <TableHead className="text-right">Preço Varejo</TableHead>
                       <TableHead className="text-right">Rentabilidade</TableHead>
                      <TableHead>Categoria</TableHead>
                      <TableHead>Fornecedor</TableHead>
                       <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedProducts.map((product) => (
                      <TableRow key={product.id} className={product.stock < lowStockThreshold ? "bg-destructive/10 hover:bg-destructive/20" : ""}>
                        <TableCell>
                          <Image 
                            src={product.image || "https://placehold.co/80x80.png"} 
                            alt={product.name} 
                            width={40} 
                            height={40} 
                            className="rounded object-cover"
                            data-ai-hint="fashion product" 
                          />
                        </TableCell>
                        <TableCell className="font-medium">{product.name}</TableCell>
                        <TableCell>{product.sku}</TableCell>
                        <TableCell className={`text-right font-semibold ${product.stock < lowStockThreshold ? 'text-destructive' : 'text-foreground'}`}>
                          {product.stock}
                          {product.stock < lowStockThreshold && <AlertCircle className="inline-block ml-1 h-4 w-4 text-destructive" />}
                        </TableCell>
                        <TableCell className="text-right">{product.unitPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</TableCell>
                        <TableCell className="text-right">{product.markup}%</TableCell>
                        <TableCell className="text-right font-semibold">{(product.unitPrice * (1 + product.markup / 100)).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</TableCell>
                        <TableCell className="text-right">{product.profitability.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</TableCell>
                        <TableCell>{product.category}</TableCell>
                        <TableCell>{product.supplier}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" onClick={() => alert(`Editando ${product.name}`)} title="Editar Produto">
                            <Edit3 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
               {filteredProducts.length === 0 && (
                <p className="text-center text-muted-foreground py-8">Nenhum produto corresponde aos seus filtros.</p>
              )}
              {filteredProducts.length > 0 && (
                <div className="flex items-center justify-between pt-4">
                  <p className="text-sm text-muted-foreground">
                    Mostrando {paginatedProducts.length} de {filteredProducts.length} produtos. Página {currentPage} de {totalPages}.
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
        </TabsContent>

        <TabsContent value="insights">
          <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Produtos de Maior Saída</CardTitle>
                <CardDescription>Top 5 produtos por volume de vendas mensal.</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader><TableRow><TableHead>Produto</TableHead><TableHead className="text-right">Volume de Vendas</TableHead></TableRow></TableHeader>
                  <TableBody>
                    {insights.sortedByOutput.map(p => (
                      <TableRow key={p.id}><TableCell>{p.name}</TableCell><TableCell className="text-right">{p.salesVolume}</TableCell></TableRow>
                    ))}
                     {insights.sortedByOutput.length === 0 && <TableRow><TableCell colSpan={2} className="text-center text-muted-foreground">Nenhum dado de venda ainda.</TableCell></TableRow>}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
             <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Produtos de Maior Rentabilidade</CardTitle>
                <CardDescription>Top 5 produtos por lucro por unidade.</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader><TableRow><TableHead>Produto</TableHead><TableHead className="text-right">Lucro/Unidade</TableHead></TableRow></TableHeader>
                  <TableBody>
                    {insights.sortedByProfitability.map(p => (
                      <TableRow key={p.id}><TableCell>{p.name}</TableCell><TableCell className="text-right">{p.profitability?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</TableCell></TableRow>
                    ))}
                    {insights.sortedByProfitability.length === 0 && <TableRow><TableCell colSpan={2} className="text-center text-muted-foreground">Nenhum produto com rentabilidade definida.</TableCell></TableRow>}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
            <Card className="lg:col-span-2 shadow-lg">
              <CardHeader>
                <CardTitle className="text-destructive flex items-center gap-2"><AlertCircle /> Precisa de Reposição</CardTitle>
                <CardDescription>Produtos com níveis de estoque abaixo do limite de {lowStockThreshold} unidades.</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader><TableRow><TableHead>Produto</TableHead><TableHead>Categoria</TableHead><TableHead className="text-right">Estoque Atual</TableHead><TableHead className="text-right">Preço Custo</TableHead></TableRow></TableHeader>
                  <TableBody>
                    {insights.needsReplacement.map(p => (
                      <TableRow key={p.id} className="bg-destructive/10">
                        <TableCell className="font-medium">{p.name}</TableCell>
                        <TableCell>{p.category}</TableCell>
                        <TableCell className="text-right font-semibold text-destructive">{p.stock}</TableCell>
                        <TableCell className="text-right">{p.unitPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                 {insights.needsReplacement.length === 0 && (
                    <p className="text-center text-muted-foreground py-4">Nenhum produto precisa de reposição no momento.</p>
                  )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="edit-markup">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Editar Margem de Lucro do Produto</CardTitle>
              <CardDescription>Selecione um produto para ajustar sua porcentagem de margem de lucro.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Selecionar Produto</h3>
                  <Select onValueChange={(productId) => handleEditMarkup(products.find(p => p.id === productId) as Product)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Escolha um produto..." />
                    </SelectTrigger>
                    <SelectContent>
                      {products.map(p => (
                        <SelectItem key={p.id} value={p.id}>{p.name} (Margem Atual: {p.markup}%)</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {editingProduct && (
                  <div className="p-4 border rounded-lg bg-muted/30">
                    <h3 className="text-lg font-semibold mb-2">Editando: {editingProduct.name}</h3>
                    <p className="text-sm text-muted-foreground">Preço Unitário Atual: {editingProduct.unitPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
                    <p className="text-sm text-muted-foreground">Margem Atual: {editingProduct.markup}%</p>
                    <p className="text-sm text-muted-foreground mb-2">Preço de Varejo Atual: {(editingProduct.unitPrice * (1 + editingProduct.markup / 100)).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
                    
                    <label htmlFor="markup" className="block text-sm font-medium mb-1">Nova Margem de Lucro (%)</label>
                    <Input 
                      type="number"
                      id="markup"
                      value={currentMarkup}
                      onChange={(e) => setCurrentMarkup(Number(e.target.value))}
                      className="mb-3"
                    />
                    <p className="text-sm text-muted-foreground mb-2">Novo Preço de Varejo: {(editingProduct.unitPrice * (1 + currentMarkup / 100)).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
                    <p className="text-sm text-muted-foreground mb-3">Nova Rentabilidade: {(editingProduct.unitPrice * (currentMarkup / 100)).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
                    <Button onClick={handleSaveMarkup} className="w-full">
                      <Edit3 className="mr-2 h-4 w-4" /> Salvar Margem de Lucro
                    </Button>
                  </div>
                )}
              </div>
               {!editingProduct && (
                  <p className="text-center text-muted-foreground py-4">Selecione um produto para editar sua margem de lucro.</p>
                )}
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-2">Filtros Globais para Análise</h3>
                <div className="flex flex-col md:flex-row gap-4 items-center">
                    <DatePickerWithRange onDateChange={setDateRange} />
                    <Button variant="outline"><Filter className="mr-2 h-4 w-4" /> Aplicar Filtros</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
