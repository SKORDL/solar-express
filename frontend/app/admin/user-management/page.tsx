"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { MoreHorizontal, Search, Eye, UserX, UserCheck, AlertTriangle, Users } from "lucide-react"

export default function UserManagementPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedUser, setSelectedUser] = useState(null)

  // Mock data - replace with your API calls
  const users = [
    {
      id: "1",
      name: "John Customer",
      email: "john@customer.com",
      phone: "+1 234 567 8900",
      status: "active",
      joinDate: "2023-06-15",
      lastLogin: "2024-01-15 10:30",
      totalOrders: 12,
      totalSpent: 2450.75,
      isBlocked: false,
      accountType: "individual",
      verificationStatus: "verified",
    },
    {
      id: "2",
      name: "Jane Business",
      email: "jane@business.com",
      phone: "+1 234 567 8901",
      status: "active",
      joinDate: "2023-08-22",
      lastLogin: "2024-01-14 15:45",
      totalOrders: 25,
      totalSpent: 8900.25,
      isBlocked: false,
      accountType: "business",
      verificationStatus: "verified",
    },
    {
      id: "3",
      name: "Bob Suspicious",
      email: "bob@suspicious.com",
      phone: "+1 234 567 8902",
      status: "flagged",
      joinDate: "2024-01-10",
      lastLogin: "2024-01-12 09:15",
      totalOrders: 1,
      totalSpent: 25.0,
      isBlocked: false,
      accountType: "individual",
      verificationStatus: "pending",
    },
    {
      id: "4",
      name: "Alice Blocked",
      email: "alice@blocked.com",
      phone: "+1 234 567 8903",
      status: "blocked",
      joinDate: "2023-12-01",
      lastLogin: "2023-12-15 14:20",
      totalOrders: 0,
      totalSpent: 0,
      isBlocked: true,
      accountType: "individual",
      verificationStatus: "rejected",
    },
  ]

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "default"
      case "blocked":
        return "destructive"
      case "flagged":
        return "secondary"
      case "inactive":
        return "outline"
      default:
        return "outline"
    }
  }

  const getUserStats = () => {
    return {
      total: users.length,
      active: users.filter((u) => u.status === "active").length,
      blocked: users.filter((u) => u.status === "blocked").length,
      flagged: users.filter((u) => u.status === "flagged").length,
    }
  }

  const stats = getUserStats()

  const handleBlockUser = (userId, block = true) => {
    // Implement block/unblock logic
    console.log(`${block ? "Blocking" : "Unblocking"} user ${userId}`)
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
        <p className="text-muted-foreground">Manage customer accounts and user access.</p>
      </div>

      {/* User Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">Registered accounts</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <UserCheck className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.active}</div>
            <p className="text-xs text-muted-foreground">Can place orders</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Blocked Users</CardTitle>
            <UserX className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.blocked}</div>
            <p className="text-xs text-muted-foreground">Account suspended</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Flagged Users</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.flagged}</div>
            <p className="text-xs text-muted-foreground">Needs review</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Users</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="flagged">Flagged</TabsTrigger>
          <TabsTrigger value="blocked">Blocked</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>User Accounts</CardTitle>
              <CardDescription>Manage all customer accounts and their access permissions.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2 mb-4">
                <Search className="h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-sm"
                />
              </div>

              {stats.flagged > 0 && (
                <Alert className="mb-4">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    You have {stats.flagged} flagged user{stats.flagged > 1 ? "s" : ""} that need
                    {stats.flagged === 1 ? "s" : ""} review.
                  </AlertDescription>
                </Alert>
              )}

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Account Type</TableHead>
                    <TableHead>Orders</TableHead>
                    <TableHead>Total Spent</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Login</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <Avatar>
                            <AvatarImage src={`/placeholder-user.jpg`} />
                            <AvatarFallback>
                              {user.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{user.name}</div>
                            <div className="text-sm text-muted-foreground">{user.email}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{user.accountType}</Badge>
                      </TableCell>
                      <TableCell>{user.totalOrders}</TableCell>
                      <TableCell>${user.totalSpent.toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusColor(user.status)}>{user.status}</Badge>
                      </TableCell>
                      <TableCell>{user.lastLogin}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <Dialog>
                              <DialogTrigger asChild>
                                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                  <Eye className="mr-2 h-4 w-4" />
                                  View Profile
                                </DropdownMenuItem>
                              </DialogTrigger>
                              <DialogContent className="sm:max-w-[500px]">
                                <DialogHeader>
                                  <DialogTitle>User Profile - {user.name}</DialogTitle>
                                  <DialogDescription>Complete user account information.</DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                  <div className="flex items-center space-x-4">
                                    <Avatar className="h-16 w-16">
                                      <AvatarImage src="/placeholder-user.jpg" />
                                      <AvatarFallback>
                                        {user.name
                                          .split(" ")
                                          .map((n) => n[0])
                                          .join("")}
                                      </AvatarFallback>
                                    </Avatar>
                                    <div>
                                      <h3 className="text-lg font-semibold">{user.name}</h3>
                                      <p className="text-muted-foreground">Member since {user.joinDate}</p>
                                      <Badge variant={getStatusColor(user.status)}>{user.status}</Badge>
                                    </div>
                                  </div>
                                  <div className="grid gap-2">
                                    <div>
                                      <strong>Email:</strong> {user.email}
                                    </div>
                                    <div>
                                      <strong>Phone:</strong> {user.phone}
                                    </div>
                                    <div>
                                      <strong>Account Type:</strong> {user.accountType}
                                    </div>
                                    <div>
                                      <strong>Verification:</strong> {user.verificationStatus}
                                    </div>
                                    <div>
                                      <strong>Total Orders:</strong> {user.totalOrders}
                                    </div>
                                    <div>
                                      <strong>Total Spent:</strong> ${user.totalSpent.toFixed(2)}
                                    </div>
                                    <div>
                                      <strong>Last Login:</strong> {user.lastLogin}
                                    </div>
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>
                            {user.isBlocked ? (
                              <DropdownMenuItem onClick={() => handleBlockUser(user.id, false)}>
                                <UserCheck className="mr-2 h-4 w-4 text-green-500" />
                                Unblock User
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem
                                onClick={() => handleBlockUser(user.id, true)}
                                className="text-destructive"
                              >
                                <UserX className="mr-2 h-4 w-4" />
                                Block User
                              </DropdownMenuItem>
                            )}
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

        {/* Other tab contents would show filtered users */}
        <TabsContent value="active" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Active Users</CardTitle>
              <CardDescription>Users who can currently access and use the platform.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <UserCheck className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Active users list would be filtered and displayed here.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="flagged" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Flagged Users</CardTitle>
              <CardDescription>Users that need manual review for suspicious activity.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <AlertTriangle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Flagged users requiring attention would be displayed here.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="blocked" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Blocked Users</CardTitle>
              <CardDescription>Users who have been blocked from accessing the platform.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <UserX className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Blocked users would be listed here with unblock options.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
