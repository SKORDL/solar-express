"use client"

import { useState } from "react"
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
import { Switch } from "@/components/ui/switch"
import { MoreHorizontal, Plus, Search, Edit, Trash2, Sun, Battery, Zap, Tag } from "lucide-react"

export default function CategoriesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)

  // Mock data - replace with your API calls
  const categories = [
    {
      id: "1",
      name: "Solar Panels",
      slug: "solar-panels",
      description: "High-efficiency solar panels for residential and commercial use",
      icon: "Sun",
      color: "#f59e0b",
      productCount: 45,
      status: "active",
      featured: true,
      parentCategory: null,
      sortOrder: 1,
      createdDate: "2023-01-15",
    },
    {
      id: "2",
      name: "Batteries",
      slug: "batteries",
      description: "Energy storage solutions for solar systems",
      icon: "Battery",
      color: "#10b981",
      productCount: 28,
      status: "active",
      featured: true,
      parentCategory: null,
      sortOrder: 2,
      createdDate: "2023-01-15",
    },
    {
      id: "3",
      name: "Inverters",
      slug: "inverters",
      description: "Convert DC power to AC power for home use",
      icon: "Zap",
      color: "#3b82f6",
      productCount: 32,
      status: "active",
      featured: true,
      parentCategory: null,
      sortOrder: 3,
      createdDate: "2023-01-15",
    },
    {
      id: "4",
      name: "Monocrystalline Panels",
      slug: "monocrystalline-panels",
      description: "High-efficiency single crystal solar panels",
      icon: "Sun",
      color: "#f59e0b",
      productCount: 25,
      status: "active",
      featured: false,
      parentCategory: "1",
      sortOrder: 1,
      createdDate: "2023-02-10",
    },
    {
      id: "5",
      name: "Lithium Batteries",
      slug: "lithium-batteries",
      description: "Long-lasting lithium-ion battery systems",
      icon: "Battery",
      color: "#10b981",
      productCount: 18,
      status: "active",
      featured: false,
      parentCategory: "2",
      sortOrder: 1,
      createdDate: "2023-02-15",
    },
  ]

  const filteredCategories = categories.filter(
    (category) =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getIcon = (iconName) => {
    switch (iconName) {
      case "Sun":
        return Sun
      case "Battery":
        return Battery
      case "Zap":
        return Zap
      default:
        return Tag
    }
  }

  const getCategoryStats = () => {
    return {
      total: categories.length,
      active: categories.filter((c) => c.status === "active").length,
      featured: categories.filter((c) => c.featured).length,
      mainCategories: categories.filter((c) => !c.parentCategory).length,
      subCategories: categories.filter((c) => c.parentCategory).length,
    }
  }

  const stats = getCategoryStats()

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Category Management</h1>
          <p className="text-muted-foreground">Organize your products with categories and subcategories.</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Category
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add New Category</DialogTitle>
              <DialogDescription>Create a new product category or subcategory.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="category-name">Category Name</Label>
                <Input id="category-name" placeholder="Enter category name" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="category-slug">URL Slug</Label>
                <Input id="category-slug" placeholder="category-url-slug" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="category-description">Description</Label>
                <Textarea id="category-description" placeholder="Describe this category" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="parent-category">Parent Category</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="None (Main Category)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None (Main Category)</SelectItem>
                      {categories
                        .filter((c) => !c.parentCategory)
                        .map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="category-icon">Icon</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select icon" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Sun">Sun (Solar Panels)</SelectItem>
                      <SelectItem value="Battery">Battery</SelectItem>
                      <SelectItem value="Zap">Zap (Inverters)</SelectItem>
                      <SelectItem value="Tag">Tag (General)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="category-color">Brand Color</Label>
                <Input id="category-color" type="color" defaultValue="#3b82f6" />
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="featured" />
                <Label htmlFor="featured">Featured Category</Label>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={() => setIsAddDialogOpen(false)}>Add Category</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Category Stats */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Categories</CardTitle>
            <Tag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">All categories</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Main Categories</CardTitle>
            <Tag className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.mainCategories}</div>
            <p className="text-xs text-muted-foreground">Top level</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Subcategories</CardTitle>
            <Tag className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.subCategories}</div>
            <p className="text-xs text-muted-foreground">Child categories</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
            <Tag className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{stats.active}</div>
            <p className="text-xs text-muted-foreground">Currently used</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Featured</CardTitle>
            <Tag className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.featured}</div>
            <p className="text-xs text-muted-foreground">Homepage display</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Categories Overview */}
      <div className="grid gap-4 md:grid-cols-3">
        {categories
          .filter((category) => !category.parentCategory)
          .map((category) => {
            const IconComponent = getIcon(category.icon)
            const subCategories = categories.filter((c) => c.parentCategory === category.id)
            return (
              <Card key={category.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{category.name}</CardTitle>
                  <div className="p-2 rounded-md" style={{ backgroundColor: category.color }}>
                    <IconComponent className="h-4 w-4 text-white" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{category.productCount}</div>
                  <p className="text-xs text-muted-foreground mb-2">{subCategories.length} subcategories</p>
                  {category.featured && <Badge variant="outline">Featured</Badge>}
                </CardContent>
              </Card>
            )
          })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Category Hierarchy</CardTitle>
          <CardDescription>Manage all categories and their relationships.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Category</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Products</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Featured</TableHead>
                <TableHead>Order</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCategories.map((category) => {
                const IconComponent = getIcon(category.icon)
                const isSubCategory = !!category.parentCategory
                const parentName = isSubCategory ? categories.find((c) => c.id === category.parentCategory)?.name : null

                return (
                  <TableRow key={category.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <div className="p-2 rounded-md" style={{ backgroundColor: category.color }}>
                          <IconComponent className="h-4 w-4 text-white" />
                        </div>
                        <div>
                          <div className="font-medium">
                            {isSubCategory && "↳ "}
                            {category.name}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {isSubCategory ? `Under ${parentName}` : category.description.substring(0, 50)}...
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={isSubCategory ? "secondary" : "default"}>
                        {isSubCategory ? "Subcategory" : "Main"}
                      </Badge>
                    </TableCell>
                    <TableCell>{category.productCount}</TableCell>
                    <TableCell>
                      <Badge variant={category.status === "active" ? "default" : "secondary"}>{category.status}</Badge>
                    </TableCell>
                    <TableCell>
                      {category.featured ? (
                        <Badge variant="outline">Featured</Badge>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>{category.sortOrder}</TableCell>
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
                            Edit Category
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete Category
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
