"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ExternalLink, Database, FileText, ImageIcon, Globe } from "lucide-react"

export default function CMSPage() {
  const cmsModules = [
    {
      name: "Sanity Studio",
      description: "Main content management interface",
      url: "https://your-project.sanity.studio",
      status: "connected",
      icon: Database,
    },
    {
      name: "Blog Content",
      description: "Manage blog posts and articles",
      url: "/admin/cms/blog",
      status: "active",
      icon: FileText,
    },
    {
      name: "Media Library",
      description: "Manage images and videos",
      url: "/admin/cms/media",
      status: "active",
      icon: ImageIcon,
    },
    {
      name: "Product Content",
      description: "Product descriptions and specs",
      url: "/admin/cms/products",
      status: "active",
      icon: Globe,
    },
  ]

  const recentContent = [
    {
      type: "Blog Post",
      title: "Solar Panel Installation Guide",
      status: "published",
      lastModified: "2024-01-15 14:30",
      author: "Admin",
    },
    {
      type: "Product",
      title: "Premium Solar Panel 400W",
      status: "draft",
      lastModified: "2024-01-15 12:15",
      author: "Editor",
    },
    {
      type: "Page",
      title: "About Us",
      status: "published",
      lastModified: "2024-01-14 16:45",
      author: "Admin",
    },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Content Management System</h1>
        <p className="text-muted-foreground">Manage your website content through Sanity CMS and other content tools.</p>
      </div>

      {/* CMS Access Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {cmsModules.map((module) => (
          <Card key={module.name} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{module.name}</CardTitle>
              <module.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground mb-3">{module.description}</p>
              <div className="flex items-center justify-between">
                <Badge variant={module.status === "connected" ? "default" : "secondary"}>{module.status}</Badge>
                <Button size="sm" variant="outline" asChild>
                  <a href={module.url} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-3 w-3 mr-1" />
                    Open
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Sanity Studio Integration */}
      <Card>
        <CardHeader>
          <CardTitle>Sanity Studio</CardTitle>
          <CardDescription>Access your Sanity CMS directly from the admin panel.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-3">
                <Database className="h-8 w-8 text-blue-500" />
                <div>
                  <h3 className="font-semibold">Sanity Studio Dashboard</h3>
                  <p className="text-sm text-muted-foreground">Manage all your content types, schemas, and data</p>
                </div>
              </div>
              <Button asChild>
                <a href="https://your-project.sanity.studio" target="_blank" rel="noopener noreferrer">
                  Open Sanity Studio
                  <ExternalLink className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </div>

            <div className="p-4 bg-muted/50 rounded-lg">
              <h4 className="font-medium mb-2">Quick Actions</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                <Button variant="outline" size="sm" asChild>
                  <a href="https://your-project.sanity.studio/desk/post" target="_blank" rel="noopener noreferrer">
                    <FileText className="mr-2 h-3 w-3" />
                    Blog Posts
                  </a>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <a href="https://your-project.sanity.studio/desk/product" target="_blank" rel="noopener noreferrer">
                    <Globe className="mr-2 h-3 w-3" />
                    Products
                  </a>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <a href="https://your-project.sanity.studio/desk/page" target="_blank" rel="noopener noreferrer">
                    <FileText className="mr-2 h-3 w-3" />
                    Pages
                  </a>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <a href="https://your-project.sanity.studio/desk/media" target="_blank" rel="noopener noreferrer">
                    <ImageIcon className="mr-2 h-3 w-3" />
                    Media
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Content Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Content Activity</CardTitle>
          <CardDescription>Latest changes to your content across all platforms.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentContent.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div>
                    <div className="font-medium">{item.title}</div>
                    <div className="text-sm text-muted-foreground">
                      {item.type} • Modified by {item.author} • {item.lastModified}
                    </div>
                  </div>
                </div>
                <Badge variant={item.status === "published" ? "default" : "secondary"}>{item.status}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* CMS Configuration */}
      <Card>
        <CardHeader>
          <CardTitle>CMS Configuration</CardTitle>
          <CardDescription>Configure your content management settings.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Auto-sync Content</div>
                <div className="text-sm text-muted-foreground">Automatically sync content changes from Sanity</div>
              </div>
              <Badge variant="outline">Enabled</Badge>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Content Preview</div>
                <div className="text-sm text-muted-foreground">Enable live preview for draft content</div>
              </div>
              <Badge variant="outline">Enabled</Badge>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Webhook Status</div>
                <div className="text-sm text-muted-foreground">Real-time updates from CMS</div>
              </div>
              <Badge>Connected</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
