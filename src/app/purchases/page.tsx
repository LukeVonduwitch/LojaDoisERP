"use client";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { UploadCloud, FileText, Settings2, ShoppingBag, ImagePlus, AlertTriangle, PlusCircle, MinusCircle } from "lucide-react";
import Image from "next/image";

interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
}

interface PurchaseOrder {
  supplier: string;
  items: OrderItem[];
  notes?: string;
}

interface ProductGridItem {
  size: string;
  color: string;
  sku: string;
  stock: number;
}

export default function PurchasesPage() {
  const [activeTab, setActiveTab] = useState("place-order");
  const [currentOrder, setCurrentOrder] = useState<PurchaseOrder>({ supplier: "", items: [] });
  const [xmlFile, setXmlFile] = useState<File | null>(null);
  const [reconciliationItems, setReconciliationItems] = useState<any[]>([]); // Placeholder
  const [productForGrid, setProductForGrid] = useState<string | undefined>(undefined);
  const [productGrid, setProductGrid] = useState<ProductGridItem[]>([]);
  const [productImages, setProductImages] = useState<string[]>([]); // URLs or base64
  const [defectDescription, setDefectDescription] = useState("");

  const suppliers = ["Supplier Alpha", "Supplier Beta", "Supplier Gamma"];
  const products = [
    { id: "P001", name: "Men's Classic T-Shirt", price: 10.50 },
    { id: "P002", name: "Women's Skinny Jeans", price: 25.00 },
    { id: "P003", name: "Unisex Hoodie", price: 30.75 },
  ];

  const handleAddItemToOrder = () => {
    // For simplicity, adding a fixed item. In reality, you'd select a product.
    const newItem: OrderItem = {
      id: String(Date.now()),
      productId: products[0].id,
      productName: products[0].name,
      quantity: 1,
      unitPrice: products[0].price
    };
    setCurrentOrder(prev => ({ ...prev, items: [...prev.items, newItem] }));
  };
  
  const handleItemQuantityChange = (itemId: string, quantity: number) => {
    setCurrentOrder(prev => ({
      ...prev,
      items: prev.items.map(item => item.id === itemId ? {...item, quantity: Math.max(0, quantity)} : item)
    }))
  };

  const handleRemoveItemFromOrder = (itemId: string) => {
    setCurrentOrder(prev => ({
      ...prev,
      items: prev.items.filter(item => item.id !== itemId)
    }))
  };

  const handlePlaceOrder = () => {
    alert(`Order placed with ${currentOrder.supplier} for ${currentOrder.items.length} item types.`);
    // Reset form or send to backend
    setCurrentOrder({ supplier: "", items: [] });
  };

  const handleXmlImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setXmlFile(event.target.files[0]);
      // Simulate processing
      setReconciliationItems([
        { id: "INV001", product: "Men's Classic T-Shirt", qtyOrdered: 50, qtyReceived: 48, priceExpected: 10.50, priceActual: 10.50, match: false },
        { id: "INV002", product: "Women's Skinny Jeans", qtyOrdered: 30, qtyReceived: 30, priceExpected: 25.00, priceActual: 25.00, match: true },
      ]);
    }
  };

  const handleProductGridGenerate = () => {
    if (productForGrid) {
      // Dummy grid generation
      const sizes = ["S", "M", "L"];
      const colors = ["Black", "White"];
      const grid: ProductGridItem[] = [];
      sizes.forEach(size => {
        colors.forEach(color => {
          grid.push({ size, color, sku: `${productForGrid}-${size}-${color.substring(0,2)}`, stock: 0 });
        });
      });
      setProductGrid(grid);
    }
  };
  
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const filesArray = Array.from(event.target.files);
      const newImageUrls = filesArray.map(file => URL.createObjectURL(file));
      setProductImages(prev => [...prev, ...newImageUrls]);
       // In a real app, upload to a server and store URLs
    }
  };


  const orderTotal = currentOrder.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold font-headline text-foreground">Purchase Management</h1>

      <Tabs defaultValue="place-order" onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-1 md:grid-cols-3 gap-2 mb-6">
          <TabsTrigger value="place-order" className="text-sm py-2.5">
            <ShoppingBag className="mr-2 h-4 w-4" /> Place Order
          </TabsTrigger>
          <TabsTrigger value="reconcile-invoice" className="text-sm py-2.5">
            <FileText className="mr-2 h-4 w-4" /> Reconcile Invoice
          </TabsTrigger>
          <TabsTrigger value="product-setup" className="text-sm py-2.5">
            <Settings2 className="mr-2 h-4 w-4" /> Product Setup
          </TabsTrigger>
        </TabsList>

        <TabsContent value="place-order">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Create New Purchase Order</CardTitle>
              <CardDescription>Select supplier and add items to your purchase order.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="supplier">Supplier</Label>
                <Select value={currentOrder.supplier} onValueChange={(value) => setCurrentOrder(prev => ({...prev, supplier: value}))}>
                  <SelectTrigger id="supplier"><SelectValue placeholder="Select a supplier" /></SelectTrigger>
                  <SelectContent>
                    {suppliers.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Order Items</h3>
                {currentOrder.items.length === 0 && <p className="text-muted-foreground">No items added yet.</p>}
                <div className="space-y-2">
                  {currentOrder.items.map(item => (
                    <div key={item.id} className="flex items-center gap-2 p-2 border rounded-md bg-muted/20">
                      <span className="flex-1">{item.productName} (${item.unitPrice.toFixed(2)})</span>
                      <Input 
                        type="number" 
                        value={item.quantity} 
                        onChange={(e) => handleItemQuantityChange(item.id, parseInt(e.target.value))}
                        className="w-20 text-center" 
                        min="0"
                      />
                      <span>x ${item.unitPrice.toFixed(2)} = ${(item.quantity * item.unitPrice).toFixed(2)}</span>
                      <Button variant="ghost" size="icon" onClick={() => handleRemoveItemFromOrder(item.id)} className="text-destructive">
                        <MinusCircle className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
                <Button onClick={handleAddItemToOrder} variant="outline" className="mt-2">
                  <PlusCircle className="mr-2 h-4 w-4" /> Add Product (Placeholder)
                </Button>
              </div>

              <div className="text-right">
                <p className="text-xl font-bold">Total: ${orderTotal.toFixed(2)}</p>
              </div>

              <div>
                <Label htmlFor="notes">Notes (Optional)</Label>
                <Textarea id="notes" placeholder="Any special instructions for this order..." value={currentOrder.notes || ''} onChange={(e) => setCurrentOrder(prev => ({ ...prev, notes: e.target.value }))} />
              </div>
              <Button onClick={handlePlaceOrder} size="lg" className="w-full md:w-auto" disabled={!currentOrder.supplier || currentOrder.items.length === 0}>
                <ShoppingBag className="mr-2 h-5 w-5" /> Place Order
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reconcile-invoice">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Import Supplier Invoice (XML)</CardTitle>
              <CardDescription>Upload the XML invoice from your supplier to reconcile items.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg hover:border-primary transition-colors">
                <UploadCloud className="h-12 w-12 text-muted-foreground mb-2" />
                <Label htmlFor="xml-upload" className="cursor-pointer text-primary font-medium">
                  {xmlFile ? `Selected: ${xmlFile.name}` : "Click to upload XML file"}
                </Label>
                <Input id="xml-upload" type="file" accept=".xml" onChange={handleXmlImport} className="hidden" />
                <p className="text-xs text-muted-foreground mt-1">Only .xml files are accepted.</p>
              </div>
              {reconciliationItems.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-2">Reconciliation Details</h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead className="text-center">Ordered</TableHead>
                        <TableHead className="text-center">Received</TableHead>
                        <TableHead className="text-right">Price Expected</TableHead>
                        <TableHead className="text-right">Price Actual</TableHead>
                        <TableHead className="text-center">Match</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {reconciliationItems.map(item => (
                        <TableRow key={item.id} className={!item.match ? "bg-destructive/10" : ""}>
                          <TableCell>{item.product}</TableCell>
                          <TableCell className="text-center">{item.qtyOrdered}</TableCell>
                          <TableCell className="text-center">{item.qtyReceived}</TableCell>
                          <TableCell className="text-right">${item.priceExpected.toFixed(2)}</TableCell>
                          <TableCell className="text-right">${item.priceActual.toFixed(2)}</TableCell>
                          <TableCell className="text-center">
                            {item.match ? <Checkbox checked disabled /> : <Checkbox disabled />}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="product-setup">
          <div className="grid lg:grid-cols-2 gap-6">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Product Grid Setup</CardTitle>
                <CardDescription>Create grids by sizes and numbering for products automatically.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Select onValueChange={setProductForGrid}>
                  <SelectTrigger><SelectValue placeholder="Select a product for grid setup" /></SelectTrigger>
                  <SelectContent>
                    {products.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
                  </SelectContent>
                </Select>
                <Button onClick={handleProductGridGenerate} disabled={!productForGrid}>Generate Grid</Button>
                {productGrid.length > 0 && (
                  <div className="mt-4 max-h-60 overflow-y-auto">
                    <Table>
                      <TableHeader><TableRow><TableHead>Size</TableHead><TableHead>Color</TableHead><TableHead>SKU</TableHead><TableHead>Stock</TableHead></TableRow></TableHeader>
                      <TableBody>
                        {productGrid.map(item => (
                          <TableRow key={item.sku}>
                            <TableCell>{item.size}</TableCell><TableCell>{item.color}</TableCell><TableCell>{item.sku}</TableCell>
                            <TableCell><Input type="number" defaultValue={item.stock} className="w-20 h-8" /></TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Manage Product Images</CardTitle>
                <CardDescription>Add images for your products.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col items-center justify-center p-4 border-2 border-dashed rounded-lg">
                    <ImagePlus className="h-10 w-10 text-muted-foreground mb-2" />
                    <Label htmlFor="image-upload" className="cursor-pointer text-primary font-medium">Click to upload images</Label>
                    <Input id="image-upload" type="file" accept="image/*" multiple onChange={handleImageUpload} className="hidden" />
                </div>
                {productImages.length > 0 && (
                    <div className="grid grid-cols-3 gap-2 mt-2">
                        {productImages.map((url, index) => (
                            <Image key={index} src={url} alt={`Product image ${index+1}`} width={100} height={100} className="rounded object-cover aspect-square" data-ai-hint="product clothing" />
                        ))}
                    </div>
                )}
              </CardContent>
            </Card>

            <Card className="lg:col-span-2 shadow-lg">
              <CardHeader>
                <CardTitle className="text-destructive flex items-center gap-2"><AlertTriangle /> Defect Release</CardTitle>
                <CardDescription>Report and manage defective items to return to the supplier.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Select>
                  <SelectTrigger><SelectValue placeholder="Select product with defect" /></SelectTrigger>
                  <SelectContent>
                    {products.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
                  </SelectContent>
                </Select>
                <Textarea placeholder="Describe the defect..." value={defectDescription} onChange={(e) => setDefectDescription(e.target.value)} />
                <Button variant="destructive" disabled={!defectDescription}>Submit Defect Report</Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
