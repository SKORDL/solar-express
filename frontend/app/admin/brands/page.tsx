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
import { Switch } from "@/components/ui/switch"
import { MoreHorizontal, Plus, Search, Edit, Trash2, Building2 } from "lucide-react"

export default function BrandsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)

  // Mock data - replace with your API calls
  const brands = [
    {
      id: "1",
      name: "Tesla",
      description: "Leading electric vehicle and clean energy company",
      logo: "/placeholder.svg?height=64&width=64",
      website: "https://tesla.com",
      status: "active",
      productCount: 15,
      totalSales: 125000,
      createdDate: "2023-01-15",
      featured: true,
    },
    {
      id: "2",
      name: "LG",
      description: "Global leader in electronics and energy solutions",
      logo: "/placeholder.svg?height=64&width=64",
      website: "https://lg.com",
      status: "active",
      productCount: 22,
      totalSales: 89000,
      createdDate: "2023-02-20",
      featured: true,
    },
    {
      id: "3",
      name: "Panasonic",
      description: "Japanese multinational electronics corporation",
      logo: "/placeholder.svg?height=64&width=64",
      website: "https://panasonic.com",
      status: "active",
      productCount: 18,
      totalSales: 67000,
      createdDate: "2023-03-10",
      featured: false,
    },
    {
      id: "4",
      name: "Jinko Solar",
      description: "World's most innovative solar technology company",
      logo: "/placeholder.svg?height=64&width=64",
      website: "https://jinkosolar.com",
      status: "active",
      productCount: 35,
      totalSales: 156000,
      createdDate: "2023-01-05",
      featured: true,
    },
    {
      id: "5",
      name: "Canadian Solar",
      description: "Leading manufacturer of solar photovoltaic modules",
      logo: "/placeholder.svg?height=64&width=64",
      website: "https://canadiansolar.com",
      status: "inactive",
      productCount: 8,
      totalSales: 12000,
      createdDate: "2023-06-15",
      featured: false,
    },
  ]

  const filteredBrands = brands.filter(
    (brand) =>
      brand.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      brand.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getBrandStats = () => {
    return {
      total: brands.length,
      active: brands.filter((b) => b.status === "active").length,
      featured: brands.filter((b) => b.featured).length,
      totalProducts: brands.reduce((sum, b) => sum + b.productCount, 0),
    }
  }

  const stats = getBrandStats()

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Brand Management</h1>
          <p className="text-muted-foreground">Manage product brands and their information.</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Brand
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add New Brand</DialogTitle>
              <DialogDescription>Create a new brand for your product catalog.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="brand-name">Brand Name</Label>
                <Input id="brand-name" placeholder="Enter brand name" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="brand-description">Description</Label>
                <Textarea id="brand-description" placeholder="Brief description of the brand" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="brand-website">Website URL</Label>
                <Input id="brand-website" placeholder="https://example.com" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="brand-logo">Logo Upload</Label>
                <Input id="brand-logo" type="file" accept="image/*" />
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="featured" />
                <Label htmlFor="featured">Featured Brand</Label>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={() => setIsAddDialogOpen(false)}>Add Brand</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Brand Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Brands</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">Registered brands</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Brands</CardTitle>
            <Building2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.active}</div>
            <p className="text-xs text-muted-foreground">Currently selling</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Featured Brands</CardTitle>
            <Building2 className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.featured}</div>
            <p className="text-xs text-muted-foreground">Homepage featured</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Building2 className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{stats.totalProducts}</div>
            <p className="text-xs text-muted-foreground">Across all brands</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Brand Directory</CardTitle>
          <CardDescription>Manage all product brands and their information.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search brands..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Brand</TableHead>
                <TableHead>Products</TableHead>
                <TableHead>Total Sales</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Featured</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBrands.map((brand) => (
                <TableRow key={brand.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <Image
                        src={brand.logo || "/placeholder.svg"}
                        alt={brand.name}
                        width={40}
                        height={40}
                        className="rounded-md"
                      />
                      <div>
                        <div className="font-medium">{brand.name}</div>
                        <div className="text-sm text-muted-foreground">{brand.description.substring(0, 50)}...</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{brand.productCount}</TableCell>
                  <TableCell>${brand.totalSales.toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge variant={brand.status === "active" ? "default" : "secondary"}>{brand.status}</Badge>
                  </TableCell>
                  <TableCell>
                    {brand.featured ? (
                      <Badge variant="outline">Featured</Badge>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell>{brand.createdDate}</TableCell>
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
                          Edit Brand
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete Brand
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
    </div>
  )
}
