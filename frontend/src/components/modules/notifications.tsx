import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { 
  Bell, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Plus, 
  Edit, 
  Trash2,
  Clock,
  MapPin,
  User,
  AlertCircle,
  Info
} from 'lucide-react'

interface Notification {
  id: number
  title: string
  message: string
  type: 'success' | 'warning' | 'error' | 'info'
  status: 'unread' | 'read'
  timestamp: string
  action: 'created' | 'updated' | 'deleted'
  entityType: 'location' | 'user' | 'system'
  entityId?: number
  entityName?: string
  details: {
    location?: string
    riskLevel?: string
    previousRiskLevel?: string
    user?: string
    changes?: string[]
  }
}

const mockNotifications: Notification[] = [
  {
    id: 1,
    title: 'New Location Added',
    message: 'Mumbai Center has been added to the system',
    type: 'success',
    status: 'unread',
    timestamp: '2025-01-29T10:30:00Z',
    action: 'created',
    entityType: 'location',
    entityId: 7,
    entityName: 'Mumbai Center',
    details: {
      location: 'Mumbai Center',
      riskLevel: 'Low',
      user: 'John Doe'
    }
  },
  {
    id: 2,
    title: 'Risk Level Updated',
    message: 'Tokyo Data Center risk level changed from Medium to High',
    type: 'warning',
    status: 'unread',
    timestamp: '2025-01-29T09:15:00Z',
    action: 'updated',
    entityType: 'location',
    entityId: 3,
    entityName: 'Tokyo Data Center',
    details: {
      location: 'Tokyo Data Center',
      riskLevel: 'High',
      previousRiskLevel: 'Medium',
      user: 'Sarah Smith',
      changes: ['Risk Level: Medium → High', 'Last Checked: Updated']
    }
  },
  {
    id: 3,
    title: 'Location Deleted',
    message: 'Berlin Branch has been removed from the system',
    type: 'error',
    status: 'read',
    timestamp: '2025-01-29T08:45:00Z',
    action: 'deleted',
    entityType: 'location',
    entityId: 4,
    entityName: 'Berlin Branch',
    details: {
      location: 'Berlin Branch',
      riskLevel: 'Low',
      user: 'Mike Johnson'
    }
  },
  {
    id: 4,
    title: 'Critical Risk Alert',
    message: 'Sydney Office marked as Critical risk level',
    type: 'error',
    status: 'read',
    timestamp: '2025-01-29T07:20:00Z',
    action: 'updated',
    entityType: 'location',
    entityId: 5,
    entityName: 'Sydney Office',
    details: {
      location: 'Sydney Office',
      riskLevel: 'Critical',
      previousRiskLevel: 'High',
      user: 'Admin System',
      changes: ['Risk Level: High → Critical', 'Requires immediate attention']
    }
  },
  {
    id: 5,
    title: 'New Assessment Added',
    message: 'Paris Facility has been added with High risk assessment',
    type: 'warning',
    status: 'read',
    timestamp: '2025-01-28T16:10:00Z',
    action: 'created',
    entityType: 'location',
    entityId: 8,
    entityName: 'Paris Facility',
    details: {
      location: 'Paris Facility',
      riskLevel: 'High',
      user: 'Emma Wilson'
    }
  },
  {
    id: 6,
    title: 'Location Updated',
    message: 'London Warehouse assessment has been updated',
    type: 'info',
    status: 'read',
    timestamp: '2025-01-28T14:30:00Z',
    action: 'updated',
    entityType: 'location',
    entityId: 2,
    entityName: 'London Warehouse',
    details: {
      location: 'London Warehouse',
      riskLevel: 'Medium',
      user: 'David Brown',
      changes: ['Last Checked: Updated', 'Assessment Notes: Added']
    }
  },
  {
    id: 7,
    title: 'Location Removed',
    message: 'Old storage facility has been decommissioned',
    type: 'info',
    status: 'read',
    timestamp: '2025-01-28T11:15:00Z',
    action: 'deleted',
    entityType: 'location',
    entityName: 'Old Storage Facility',
    details: {
      location: 'Old Storage Facility',
      riskLevel: 'Medium',
      user: 'System Admin'
    }
  },
  {
    id: 8,
    title: 'System Assessment',
    message: 'Toronto Hub has been added to monitoring',
    type: 'success',
    status: 'read',
    timestamp: '2025-01-27T15:45:00Z',
    action: 'created',
    entityType: 'location',
    entityId: 6,
    entityName: 'Toronto Hub',
    details: {
      location: 'Toronto Hub',
      riskLevel: 'Medium',
      user: 'Security Team'
    }
  }
]

export function Notifications() {
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(
    mockNotifications[0]
  )
  const [notifications, setNotifications] = useState(mockNotifications)

  const getNotificationIcon = (type: Notification['type'], action: Notification['action']) => {
    if (action === 'created') return <Plus className="h-4 w-4" />
    if (action === 'updated') return <Edit className="h-4 w-4" />
    if (action === 'deleted') return <Trash2 className="h-4 w-4" />
    
    switch (type) {
      case 'success':
        return <CheckCircle className="h-4 w-4" />
      case 'warning':
        return <AlertTriangle className="h-4 w-4" />
      case 'error':
        return <XCircle className="h-4 w-4" />
      default:
        return <Info className="h-4 w-4" />
    }
  }

  const getNotificationColor = (type: Notification['type'], action: Notification['action']) => {
    if (action === 'created') return 'text-green-600'
    if (action === 'updated') return 'text-blue-600'
    if (action === 'deleted') return 'text-red-600'
    
    switch (type) {
      case 'success':
        return 'text-green-600'
      case 'warning':
        return 'text-orange-600'
      case 'error':
        return 'text-red-600'
      default:
        return 'text-blue-600'
    }
  }

  const getBadgeVariant = (type: Notification['type'], action: Notification['action']) => {
    if (action === 'created') return 'bg-green-100 text-green-800'
    if (action === 'updated') return 'bg-blue-100 text-blue-800'
    if (action === 'deleted') return 'bg-red-100 text-red-800'
    
    switch (type) {
      case 'success':
        return 'bg-green-100 text-green-800'
      case 'warning':
        return 'bg-orange-100 text-orange-800'
      case 'error':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-blue-100 text-blue-800'
    }
  }

  const markAsRead = (notificationId: number) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, status: 'read' as const }
          : notification
      )
    )
  }

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, status: 'read' as const }))
    )
  }

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
      return `${diffInMinutes} minutes ago`
    } else if (diffInHours < 24) {
      return `${diffInHours} hours ago`
    } else {
      const diffInDays = Math.floor(diffInHours / 24)
      return `${diffInDays} days ago`
    }
  }

  const unreadCount = notifications.filter(n => n.status === 'unread').length

  return (
      <div className="space-y-6 pb-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
            <p className="text-gray-600 mt-2">
              Stay updated with system alerts and data changes
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
              {unreadCount} unread
            </Badge>
            <Button variant="outline" onClick={markAllAsRead}>
              <CheckCircle className="h-4 w-4 mr-2" />
              Mark All Read
            </Button>
          </div>
        </div>

        {/* Main Content - Two Panel Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-16rem)]">
          {/* Left Panel - Notifications List */}
          <div className="lg:col-span-1">
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Bell className="h-5 w-5" />
                  <span>Recent Alerts</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[calc(100vh-20rem)]">
                  <div className="space-y-1">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`
                          p-4 cursor-pointer border-b transition-colors hover:bg-gray-50
                          ${selectedNotification?.id === notification.id ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''}
                          ${notification.status === 'unread' ? 'bg-blue-25' : ''}
                        `}
                        onClick={() => {
                          setSelectedNotification(notification)
                          if (notification.status === 'unread') {
                            markAsRead(notification.id)
                          }
                        }}
                      >
                        <div className="flex items-start space-x-3">
                          <div className={`flex-shrink-0 mt-1 ${getNotificationColor(notification.type, notification.action)}`}>
                            {getNotificationIcon(notification.type, notification.action)}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <p className={`text-sm font-medium ${notification.status === 'unread' ? 'text-gray-900' : 'text-gray-700'}`}>
                                {notification.title}
                              </p>
                              {notification.status === 'unread' && (
                                <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0"></div>
                              )}
                            </div>
                            
                            <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                              {notification.message}
                            </p>
                            
                            <div className="flex items-center justify-between mt-2">
                              <Badge className={`text-xs ${getBadgeVariant(notification.type, notification.action)}`}>
                                {notification.action.charAt(0).toUpperCase() + notification.action.slice(1)}
                              </Badge>
                              <span className="text-xs text-gray-400">
                                {formatTimestamp(notification.timestamp)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          {/* Right Panel - Notification Details */}
          <div className="lg:col-span-2">
            <Card className="h-full">
              {selectedNotification ? (
                <>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center space-x-3">
                        <div className={getNotificationColor(selectedNotification.type, selectedNotification.action)}>
                          {getNotificationIcon(selectedNotification.type, selectedNotification.action)}
                        </div>
                        <span>{selectedNotification.title}</span>
                      </CardTitle>
                      <Badge className={getBadgeVariant(selectedNotification.type, selectedNotification.action)}>
                        {selectedNotification.action.charAt(0).toUpperCase() + selectedNotification.action.slice(1)}
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-6">
                    {/* Timestamp and Status */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <Clock className="h-4 w-4" />
                          <span>Timestamp</span>
                        </div>
                        <p className="text-sm font-medium">
                          {new Date(selectedNotification.timestamp).toLocaleString()}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatTimestamp(selectedNotification.timestamp)}
                        </p>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <AlertCircle className="h-4 w-4" />
                          <span>Status</span>
                        </div>
                        <Badge variant={selectedNotification.status === 'unread' ? 'default' : 'secondary'}>
                          {selectedNotification.status.charAt(0).toUpperCase() + selectedNotification.status.slice(1)}
                        </Badge>
                      </div>
                    </div>

                    <Separator />

                    {/* Message */}
                    <div className="space-y-3">
                      <h4 className="text-sm font-medium text-gray-900">Description</h4>
                      <p className="text-sm text-gray-700 leading-relaxed">
                        {selectedNotification.message}
                      </p>
                    </div>

                    <Separator />

                    {/* Details */}
                    <div className="space-y-4">
                      <h4 className="text-sm font-medium text-gray-900">Details</h4>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {selectedNotification.details.location && (
                          <div className="space-y-1">
                            <div className="flex items-center space-x-2 text-xs text-gray-500">
                              <MapPin className="h-3 w-3" />
                              <span>Location</span>
                            </div>
                            <p className="text-sm font-medium">{selectedNotification.details.location}</p>
                          </div>
                        )}

                        {selectedNotification.details.user && (
                          <div className="space-y-1">
                            <div className="flex items-center space-x-2 text-xs text-gray-500">
                              <User className="h-3 w-3" />
                              <span>Performed by</span>
                            </div>
                            <p className="text-sm font-medium">{selectedNotification.details.user}</p>
                          </div>
                        )}

                        {selectedNotification.details.riskLevel && (
                          <div className="space-y-1">
                            <div className="flex items-center space-x-2 text-xs text-gray-500">
                              <AlertTriangle className="h-3 w-3" />
                              <span>Risk Level</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              {selectedNotification.details.previousRiskLevel && (
                                <>
                                  <Badge variant="outline">{selectedNotification.details.previousRiskLevel}</Badge>
                                  <span className="text-xs text-gray-400">→</span>
                                </>
                              )}
                              <Badge className={
                                selectedNotification.details.riskLevel === 'Critical' ? 'bg-red-100 text-red-800' :
                                selectedNotification.details.riskLevel === 'High' ? 'bg-orange-100 text-orange-800' :
                                selectedNotification.details.riskLevel === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-green-100 text-green-800'
                              }>
                                {selectedNotification.details.riskLevel}
                              </Badge>
                            </div>
                          </div>
                        )}

                        {selectedNotification.entityId && (
                          <div className="space-y-1">
                            <div className="flex items-center space-x-2 text-xs text-gray-500">
                              <span>Entity ID</span>
                            </div>
                            <p className="text-sm font-medium">#{selectedNotification.entityId}</p>
                          </div>
                        )}
                      </div>

                      {/* Changes */}
                      {selectedNotification.details.changes && selectedNotification.details.changes.length > 0 && (
                        <div className="space-y-2">
                          <h5 className="text-xs font-medium text-gray-500 uppercase tracking-wide">Changes Made</h5>
                          <ul className="space-y-1">
                            {selectedNotification.details.changes.map((change, index) => (
                              <li key={index} className="text-sm text-gray-700 flex items-center space-x-2">
                                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full flex-shrink-0"></div>
                                <span>{change}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </>
              ) : (
                <CardContent className="flex items-center justify-center h-full">
                  <div className="text-center space-y-3">
                    <Bell className="h-12 w-12 text-gray-300 mx-auto" />
                    <p className="text-gray-500">Select a notification to view details</p>
                  </div>
                </CardContent>
              )}
            </Card>
          </div>
        </div>
      </div>
  )
}