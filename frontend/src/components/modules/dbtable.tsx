import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Plus, 
  Search, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  MapPin,
  AlertTriangle,
  Clock,
  Database
} from 'lucide-react'

interface DataEntry {
  id: number
  location: string
  riskLevel: 'Low' | 'Medium' | 'High' | 'Critical'
  lastChecked: string
}

const riskLevelColors = {
  Low: 'bg-green-100 text-green-800',
  Medium: 'bg-yellow-100 text-yellow-800', 
  High: 'bg-orange-100 text-orange-800',
  Critical: 'bg-red-100 text-red-800'
}

const initialData: DataEntry[] = [
  { id: 1, location: 'New York Office', riskLevel: 'Low', lastChecked: '2025-01-28' },
  { id: 2, location: 'London Warehouse', riskLevel: 'Medium', lastChecked: '2025-01-27' },
  { id: 3, location: 'Tokyo Data Center', riskLevel: 'High', lastChecked: '2025-01-26' },
  { id: 4, location: 'Berlin Branch', riskLevel: 'Low', lastChecked: '2025-01-28' },
  { id: 5, location: 'Sydney Office', riskLevel: 'Critical', lastChecked: '2025-01-25' },
  { id: 6, location: 'Toronto Hub', riskLevel: 'Medium', lastChecked: '2025-01-27' },
  { id: 7, location: 'Mumbai Center', riskLevel: 'Low', lastChecked: '2025-01-28' },
  { id: 8, location: 'Paris Facility', riskLevel: 'High', lastChecked: '2025-01-26' }
]

export function CrudDashboard() {
  const [data, setData] = useState<DataEntry[]>(initialData)
  const [searchTerm, setSearchTerm] = useState('')
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingEntry, setEditingEntry] = useState<DataEntry | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Form states
  const [formData, setFormData] = useState({
    location: '',
    riskLevel: 'Low' as DataEntry['riskLevel'],
    lastChecked: new Date().toISOString().split('T')[0]
  })

  // Filter data based on search term
  const filteredData = data.filter(entry =>
    entry.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.riskLevel.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Statistics
  const stats = {
    total: data.length,
    critical: data.filter(entry => entry.riskLevel === 'Critical').length,
    high: data.filter(entry => entry.riskLevel === 'High').length,
    medium: data.filter(entry => entry.riskLevel === 'Medium').length,
    low: data.filter(entry => entry.riskLevel === 'Low').length
  }

  const resetForm = () => {
    setFormData({
      location: '',
      riskLevel: 'Low',
      lastChecked: new Date().toISOString().split('T')[0]
    })
  }

  const handleAdd = async () => {
    if (!formData.location.trim()) {
      alert('Please enter a location')
      return
    }

    setIsLoading(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500))

    const newEntry: DataEntry = {
      id: Math.max(...data.map(d => d.id)) + 1,
      location: formData.location.trim(),
      riskLevel: formData.riskLevel,
      lastChecked: formData.lastChecked
    }

    setData(prev => [...prev, newEntry])
    setIsAddDialogOpen(false)
    resetForm()
    setIsLoading(false)
  }

  const handleEdit = (entry: DataEntry) => {
    setEditingEntry(entry)
    setFormData({
      location: entry.location,
      riskLevel: entry.riskLevel,
      lastChecked: entry.lastChecked
    })
    setIsEditDialogOpen(true)
  }

  const handleUpdate = async () => {
    if (!formData.location.trim() || !editingEntry) {
      alert('Please enter a location')
      return
    }

    setIsLoading(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500))

    setData(prev => prev.map(entry => 
      entry.id === editingEntry.id 
        ? { ...entry, location: formData.location.trim(), riskLevel: formData.riskLevel, lastChecked: formData.lastChecked }
        : entry
    ))

    setIsEditDialogOpen(false)
    setEditingEntry(null)
    resetForm()
    setIsLoading(false)
  }

  const handleDelete = async (id: number) => {
    setIsLoading(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500))

    setData(prev => prev.filter(entry => entry.id !== id))
    setIsLoading(false)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
      <div className="space-y-6 pb-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">CRUD Dashboard</h1>
            <p className="text-gray-600 mt-2">Manage locations and risk assessments</p>
          </div>
          
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="h-4 w-4 mr-2" />
                Add Entry
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Entry</DialogTitle>
                <DialogDescription>
                  Add a new location with risk assessment details.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="add-location">Location</Label>
                  <Input
                    id="add-location"
                    placeholder="Enter location name"
                    value={formData.location}
                    onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="add-risk">Risk Level</Label>
                  <Select value={formData.riskLevel} onValueChange={(value: DataEntry['riskLevel']) => 
                    setFormData(prev => ({ ...prev, riskLevel: value }))
                  }>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Low">Low</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="High">High</SelectItem>
                      <SelectItem value="Critical">Critical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="add-date">Last Checked</Label>
                  <Input
                    id="add-date"
                    type="date"
                    value={formData.lastChecked}
                    onChange={(e) => setFormData(prev => ({ ...prev, lastChecked: e.target.value }))}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAdd} disabled={isLoading}>
                  {isLoading ? 'Adding...' : 'Add Entry'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Entries</CardTitle>
              <Database className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Critical</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.critical}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">High Risk</CardTitle>
              <AlertTriangle className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{stats.high}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Medium Risk</CardTitle>
              <AlertTriangle className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{stats.medium}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Low Risk</CardTitle>
              <AlertTriangle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.low}</div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Data Management</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search locations or risk levels..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>

            {/* Data Table */}
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">ID</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Risk Level</TableHead>
                    <TableHead>Last Checked</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredData.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                        {searchTerm ? 'No entries match your search.' : 'No entries found.'}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredData.map((entry) => (
                      <TableRow key={entry.id}>
                        <TableCell className="font-medium">{entry.id}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <span>{entry.location}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={riskLevelColors[entry.riskLevel]}>
                            {entry.riskLevel}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span>{formatDate(entry.lastChecked)}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem onClick={() => handleEdit(entry)}>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Delete
                                  </DropdownMenuItem>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Delete Entry</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Are you sure you want to delete "{entry.location}"? This action cannot be undone.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => handleDelete(entry.id)}
                                      className="bg-red-600 hover:bg-red-700"
                                    >
                                      {isLoading ? 'Deleting...' : 'Delete'}
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Entry</DialogTitle>
              <DialogDescription>
                Update the location and risk assessment details.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-location">Location</Label>
                <Input
                  id="edit-location"
                  placeholder="Enter location name"
                  value={formData.location}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-risk">Risk Level</Label>
                <Select value={formData.riskLevel} onValueChange={(value: DataEntry['riskLevel']) => 
                  setFormData(prev => ({ ...prev, riskLevel: value }))
                }>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Low">Low</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-date">Last Checked</Label>
                <Input
                  id="edit-date"
                  type="date"
                  value={formData.lastChecked}
                  onChange={(e) => setFormData(prev => ({ ...prev, lastChecked: e.target.value }))}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleUpdate} disabled={isLoading}>
                {isLoading ? 'Updating...' : 'Update Entry'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
  )
}