"use client";
import { useState, useMemo } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuCheckboxItem } from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePickerWithRange } from "@/components/ui/date-picker-range"; // Assuming this component exists or will be created
import { PackageSearch, TrendingUp, DollarSign, Filter, Edit3, AlertCircle, ArrowUpDown, CalendarDays } from "lucide-react";
import Image from "next/image";
import { Checkbox } from "@/components/ui/checkbox";


// Placeholder for DatePickerWithRange if not available
const DatePickerWithRangeFallback = () => (
  <Button variant="outline" className="w-full justify-start text-left font-normal">
    <CalendarDays className="mr-2 h-4 w-4" />
    <span>Pick a date range</span>
  </Button>
);

interface Product {
  id: string;
  name: string;
  sku: string;
  stock: number;
  unitPrice: number;
  markup: number; // percentage, e.g., 20 for 20%
  category: string;
  supplier: string;
  lastOrderDate: string;
  image?: string;
  profitability?: number; // calculated
  salesVolume?: number; // monthly
}

const initialProducts: Product[] = [
  { id: "1", name: "Classic White Tee", sku: "CWT001", stock: 150, unitPrice: 15.00, markup: 50, category: "Tops", supplier: "Apparel Co.", lastOrderDate: "2023-05-10", image: "https://placehold.co/80x80.png", profitability: 7.50, salesVolume: 200 },
  { id: "2", name: "Slim Fit Denim Jeans", sku: "SFJ002", stock: 80, unitPrice: 45.00, markup: 60, category: "Bottoms", supplier: "Denim Express", lastOrderDate: "2023-04-22", image: "https://placehold.co/80x80.png", profitability: 27.00, salesVolume: 90 },
  { id: "3", name: "Wool Blend Scarf", sku: "WBS003", stock: 20, unitPrice: 25.00, markup: 40, category: "Accessories", supplier: "Warm Knits Ltd.", lastOrderDate: "2023-06-01", image: "https://placehold.co/80x80.png", profitability: 10.00, salesVolume: 50 },
  { id: "4", name: "Leather Ankle Boots", sku: "LAB004", stock: 45, unitPrice: 120.00, markup: 70, category: "Footwear", supplier: "Fine Footwear Inc.", lastOrderDate: "2023-03-15", image: "https://placehold.co/80x80.png", profitability: 84.00, salesVolume: 30 },
  { id: "5", name: "Floral Maxi Dress", sku: "FMD005", stock: 5, unitPrice: 75.00, markup: 55, category: "Dresses", supplier: "Elegant Designs", lastOrderDate: "2023-05-25", image: "https://placehold.co/80x80.png", profitability: 41.25, salesVolume: 15 },
];

const categories = ["All", "Tops", "Bottoms", "Dresses", "Accessories", "Footwear"];
const suppliers = ["All", "Apparel Co.", "Denim Express", "Warm Knits Ltd.", "Fine Footwear Inc.", "Elegant Designs"];


export default function StockPage() {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [supplierFilter, setSupplierFilter] = useState("All");
  const [showLowStockOnly, setShowLowStockOnly] = useState(false);
  const lowStockThreshold = 10;

  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [currentMarkup, setCurrentMarkup] = useState(0);

  const filteredProducts = useMemo(() => {
    return products.filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (categoryFilter === "All" || product.category === categoryFilter) &&
      (supplierFilter === "All" || product.supplier === supplierFilter) &&
      (!showLowStockOnly || product.stock < lowStockThreshold)
    );
  }, [products, searchTerm, categoryFilter, supplierFilter, showLowStockOnly]);

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

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold font-headline text-foreground">Stock Management</h1>

      <Tabs defaultValue="all-products">
        <TabsList className="grid w-full grid-cols-1 md:grid-cols-3 gap-2 mb-6">
          <TabsTrigger value="all-products" className="text-sm py-2.5">
            <PackageSearch className="mr-2 h-4 w-4" /> All Products
          </TabsTrigger>
          <TabsTrigger value="insights" className="text-sm py-2.5">
            <TrendingUp className="mr-2 h-4 w-4" /> Stock Insights
          </TabsTrigger>
          <TabsTrigger value="edit-markup" className="text-sm py-2.5">
            <DollarSign className="mr-2 h-4 w-4" /> Edit Markup
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all-products">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Product List</CardTitle>
              <CardDescription>View and manage your current product inventory.</CardDescription>
              <div className="mt-4 flex flex-col md:flex-row gap-4 items-center">
                <Input
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-sm"
                />
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-full md:w-[180px]">
                    <SelectValue placeholder="Filter by category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                  </SelectContent>
                </Select>
                <Select value={supplierFilter} onValueChange={setSupplierFilter}>
                  <SelectTrigger className="w-full md:w-[180px]">
                    <SelectValue placeholder="Filter by supplier" />
                  </SelectTrigger>
                  <SelectContent>
                    {suppliers.map(sup => <SelectItem key={sup} value={sup}>{sup}</SelectItem>)}
                  </SelectContent>
                </Select>
                <div className="flex items-center space-x-2">
                  <Checkbox id="lowStock" checked={showLowStockOnly} onCheckedChange={(checked) => setShowLowStockOnly(Boolean(checked))} />
                  <label htmlFor="lowStock" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Low Stock Only ({`<${lowStockThreshold}`})
                  </label>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Image</TableHead>
                      <TableHead className="cursor-pointer hover:bg-muted/50"><ArrowUpDown className="inline-block mr-1 h-4 w-4" />Name</TableHead>
                      <TableHead>SKU</TableHead>
                      <TableHead className="text-right">Stock</TableHead>
                      <TableHead className="text-right">Unit Price</TableHead>
                      <TableHead className="text-right">Markup</TableHead>
                      <TableHead className="text-right">Retail Price</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Supplier</TableHead>
                       <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProducts.map((product) => (
                      <TableRow key={product.id} className={product.stock < lowStockThreshold ? "bg-destructive/10 hover:bg-destructive/20" : ""}>
                        <TableCell>
                          <Image 
                            src={product.image || "https://placehold.co/80x80.png"} 
                            alt={product.name} 
                            width={40} 
                            height={40} 
                            className="rounded"
                            data-ai-hint="fashion product" 
                          />
                        </TableCell>
                        <TableCell className="font-medium">{product.name}</TableCell>
                        <TableCell>{product.sku}</TableCell>
                        <TableCell className={`text-right font-semibold ${product.stock < lowStockThreshold ? 'text-destructive' : 'text-foreground'}`}>
                          {product.stock}
                          {product.stock < lowStockThreshold && <AlertCircle className="inline-block ml-1 h-4 w-4 text-destructive" />}
                        </TableCell>
                        <TableCell className="text-right">${product.unitPrice.toFixed(2)}</TableCell>
                        <TableCell className="text-right">{product.markup}%</TableCell>
                        <TableCell className="text-right font-semibold">${(product.unitPrice * (1 + product.markup / 100)).toFixed(2)}</TableCell>
                        <TableCell>{product.category}</TableCell>
                        <TableCell>{product.supplier}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" onClick={() => alert(`Editing ${product.name}`)}>
                            <Edit3 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
               {filteredProducts.length === 0 && (
                <p className="text-center text-muted-foreground py-8">No products match your filters.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights">
          <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Highest Output Products</CardTitle>
                <CardDescription>Top 5 products by monthly sales volume.</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader><TableRow><TableHead>Product</TableHead><TableHead className="text-right">Sales Volume</TableHead></TableRow></TableHeader>
                  <TableBody>
                    {insights.sortedByOutput.map(p => (
                      <TableRow key={p.id}><TableCell>{p.name}</TableCell><TableCell className="text-right">{p.salesVolume}</TableCell></TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
             <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Highest Profitability Products</CardTitle>
                <CardDescription>Top 5 products by profit per unit.</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader><TableRow><TableHead>Product</TableHead><TableHead className="text-right">Profit/Unit</TableHead></TableRow></TableHeader>
                  <TableBody>
                    {insights.sortedByProfitability.map(p => (
                      <TableRow key={p.id}><TableCell>{p.name}</TableCell><TableCell className="text-right">${p.profitability?.toFixed(2)}</TableCell></TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
            <Card className="lg:col-span-2 shadow-lg">
              <CardHeader>
                <CardTitle className="text-destructive flex items-center gap-2"><AlertCircle /> Needs Replacement</CardTitle>
                <CardDescription>Products with stock levels below the threshold of {lowStockThreshold} units.</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader><TableRow><TableHead>Product</TableHead><TableHead>Category</TableHead><TableHead className="text-right">Current Stock</TableHead><TableHead className="text-right">Unit Price</TableHead></TableRow></TableHeader>
                  <TableBody>
                    {insights.needsReplacement.map(p => (
                      <TableRow key={p.id} className="bg-destructive/10">
                        <TableCell className="font-medium">{p.name}</TableCell>
                        <TableCell>{p.category}</TableCell>
                        <TableCell className="text-right font-semibold text-destructive">{p.stock}</TableCell>
                        <TableCell className="text-right">${p.unitPrice.toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                 {insights.needsReplacement.length === 0 && (
                    <p className="text-center text-muted-foreground py-4">No products currently need replacement.</p>
                  )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="edit-markup">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Edit Product Markup</CardTitle>
              <CardDescription>Select a product to adjust its markup percentage.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Select Product</h3>
                  <Select onValueChange={(productId) => handleEditMarkup(products.find(p => p.id === productId) as Product)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a product..." />
                    </SelectTrigger>
                    <SelectContent>
                      {products.map(p => (
                        <SelectItem key={p.id} value={p.id}>{p.name} (Current Markup: {p.markup}%)</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {editingProduct && (
                  <div className="p-4 border rounded-lg bg-muted/30">
                    <h3 className="text-lg font-semibold mb-2">Editing: {editingProduct.name}</h3>
                    <p className="text-sm text-muted-foreground">Current Unit Price: ${editingProduct.unitPrice.toFixed(2)}</Popup_Large_text_with_rounded_corners_and_modern_design>
                    <p className="text-sm text-muted-foreground">Current Markup: {editingProduct.markup}%</Popup_Large_text_with_rounded_corners_and_modern_design>
                    <p className="text-sm text-muted-foreground mb-2">Current Retail Price: ${(editingProduct.unitPrice * (1 + editingProduct.markup / 100)).toFixed(2)}</Popup_Large_text_with_rounded_corners_and_modern_design>
                    
                    <label htmlFor="markup" className="block text-sm font-medium mb-1">New Markup (%)</label>
                    <Input 
                      type="number"
                      id="markup"
                      value={currentMarkup}
                      onChange={(e) => setCurrentMarkup(Number(e.target.value))}
                      className="mb-3"
                    />
                    <p className="text-sm text-muted-foreground mb-2">New Retail Price: ${(editingProduct.unitPrice * (1 + currentMarkup / 100)).toFixed(2)}</Popup_Large_text_with_rounded_corners_and_modern_design>
                    <Button onClick={handleSaveMarkup} className="w-full">
                      <Edit3 className="mr-2 h-4 w-4" /> Save Markup
                    </Button>
                  </div>
                )}
              </div>
               {!editingProduct && (
                  <p className="text-center text-muted-foreground py-4">Select a product to edit its markup.</p>
                )}
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-2">Global Filters for Analysis</h3>
                <div className="flex flex-col md:flex-row gap-4 items-center">
                    <DatePickerWithRangeFallback /> {/* Placeholder for date range picker */}
                    <Button variant="outline"><Filter className="mr-2 h-4 w-4" /> Apply Filters</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Placeholder for DatePickerWithRange if not provided by shadcn/ui by default
// You would typically create this in components/ui/date-picker-range.tsx
// For now, this is just a type definition to satisfy TypeScript
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'Popup_Large_text_with_rounded_corners_and_modern_design': React.DetailedHTMLProps<React.HTMLAttributes<HTMLParagraphElement>, HTMLParagraphElement>;
    }
  }
}
