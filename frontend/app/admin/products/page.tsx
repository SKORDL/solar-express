"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MoreHorizontal, Plus, Search, Edit, Trash2, Zap, Battery, Sun } from "lucide-react"

export default function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedBrand, setSelectedBrand] = useState("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)

  // Mock data - replace with your API calls
  const categories = [
    { id: "solar-panels", name: "Solar Panels", icon: Sun, color: "bg-yellow-500" },
    { id: "batteries", name: "Batteries", icon: Battery, color: "bg-green-500" },
    { id: "inverters", name: "Inverters", icon: Zap, color: "bg-blue-500" },
  ]

  const brands = [
    { id: "tesla", name: "Tesla" },
    { id: "lg", name: "LG" },
    { id: "panasonic", name: "Panasonic" },
    { id: "jinko", name: "Jinko Solar" },
    { id: "canadian", name: "Canadian Solar" },
    { id: "fronius", name: "Fronius" },
    { id: "sma", name: "SMA" },
  ]

  const products = [
    {
      id: "1",
      name: "Tesla Solar Panel 400W",
      description: "High-efficiency monocrystalline solar panel",
      price: 299.99,
      stock: 25,
      category: "solar-panels",
      brand: "tesla",
      status: "active",
      image: "/placeholder.svg?height=64&width=64",
      specifications: {
        power: "400W",
        efficiency: "22.8%",
        warranty: "25 years",
      },
    },
    {
      id: "2",
      name: "LG Chem RESU 10H Battery",
      description: "Residential energy storage system",
      price: 4999.99,
      stock: 8,
      category: "batteries",
      brand: "lg",
      status: "active",
      image: "/placeholder.svg?height=64&width=64",
      specifications: {
        capacity: "9.8 kWh",
        voltage: "400V",
        warranty: "10 years",
      },
    },
    {
      id: "3",
      name: "Fronius Primo 5.0-1 Inverter",
      description: "Single-phase string inverter with SnapINverter mounting",
      price: 1299.99,
      stock: 15,
      category: "inverters",
      brand: "fronius",
      status: "active",
      image: "/placeholder.svg?height=64&width=64",
      specifications: {
        power: "5000W",
        efficiency: "97.8%",
        warranty: "12 years",
      },
    },
    {
      id: "4",
      name: "Jinko Tiger Neo 450W",
      description: "Bifacial solar panel with excellent performance",
      price: 199.99,
      stock: 0,
      category: "solar-panels",
      brand: "jinko",
      status: "out_of_stock",
      image: "/placeholder.svg?height=64&width=64",
      specifications: {
        power: "450W",
        efficiency: "21.25%",
        warranty: "25 years",
      },
    },
  ]

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory
    const matchesBrand = selectedBrand === "all" || product.brand === selectedBrand
    return matchesSearch && matchesCategory && matchesBrand
  })

  const getCategoryStats = () => {
    return categories.map((category) => ({
      ...category,
      count: products.filter((p) => p.category === category.id).length,
      activeCount: products.filter((p) => p.category === category.id && p.status === "active").length,
    }))
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Products</h1>
          <p className="text-muted-foreground">Manage your solar energy product inventory.</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Add New Product</DialogTitle>
              <DialogDescription>Create a new product listing with category and brand information.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Product Name</Label>
                <Input id="name" placeholder="Enter product name" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" placeholder="Enter product description" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="category">Category</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="brand">Brand</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select brand" />
                    </SelectTrigger>
                    <SelectContent>
                      {brands.map((brand) => (
                        <SelectItem key={brand.id} value={brand.id}>
                          {brand.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="price">Price</Label>
                  <Input id="price" type="number" placeholder="0.00" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="stock">Stock Quantity</Label>
                  <Input id="stock" type="number" placeholder="0" />
                </div>
              </div>
              <div className="grid gap-2">
                <Label>Specifications</Label>
                <div className="grid grid-cols-2 gap-4">
                  <Input placeholder="Power (e.g., 400W)" />
                  <Input placeholder="Efficiency (e.g., 22%)" />
                </div>
                <Input placeholder="Warranty (e.g., 25 years)" />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={() => setIsAddDialogOpen(false)}>
                Add Product
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Category Overview */}
      <div className="grid gap-4 md:grid-cols-3">
        {getCategoryStats().map((category) => (
          <Card key={category.id} className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{category.name}</CardTitle>
              <div className={`p-2 rounded-md ${category.color}`}>
                <category.icon className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{category.count}</div>
              <p className="text-xs text-muted-foreground">
                {category.activeCount} active • {category.count - category.activeCount} inactive
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Products</TabsTrigger>
          <TabsTrigger value="solar-panels">Solar Panels</TabsTrigger>
          <TabsTrigger value="batteries">Batteries</TabsTrigger>
          <TabsTrigger value="inverters">Inverters</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Product Inventory</CardTitle>
              <CardDescription>Complete product catalog with category and brand filtering.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4 mb-4">
                <div className="flex items-center space-x-2 flex-1">
                  <Search className="h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="max-w-sm"
                  />
                </div>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={selectedBrand} onValueChange={setSelectedBrand}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="All Brands" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Brands</SelectItem>
                    {brands.map((brand) => (
                      <SelectItem key={brand.id} value={brand.id}>
                        {brand.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Brand</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <Image
                            src={product.image || "/placeholder.svg"}
                            alt={product.name}
                            width={40}
                            height={40}
                            className="rounded-md"
                          />
                          <div>
                            <div className="font-medium">{product.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {product.description.substring(0, 50)}...
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{categories.find((c) => c.id === product.category)?.name}</Badge>
                      </TableCell>
                      <TableCell>{brands.find((b) => b.id === product.brand)?.name}</TableCell>
                      <TableCell>${product.price}</TableCell>
                      <TableCell>
                        <span className={product.stock === 0 ? "text-red-500" : ""}>{product.stock}</span>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            product.status === "active"
                              ? "default"
                              : product.status === "out_of_stock"
                                ? "destructive"
                                : "secondary"
                          }
                        >
                          {product.status.replace("_", " ")}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Individual category tabs would have filtered content */}
        {categories.map((category) => (
          <TabsContent key={category.id} value={category.id} className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <category.icon className="h-5 w-5" />
                  {category.name}
                </CardTitle>
                <CardDescription>Products in the {category.name.toLowerCase()} category.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <category.icon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Category-specific product management would be implemented here.</p>
                  <p className="text-sm">Filter and manage only {category.name.toLowerCase()} products.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
