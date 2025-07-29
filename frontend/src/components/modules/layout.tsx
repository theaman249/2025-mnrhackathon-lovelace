import { useAuth } from '@/lib/auth-context'
import { Button } from '@/components/ui/button'
import { Link, useLocation } from 'react-router-dom'
import type { ReactNode } from 'react'
import { 
  Home, 
  Bell, 
  User, 
  LogOut,
  Menu,
  X,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'
import { useState } from 'react'

interface LayoutProps {
  children: ReactNode
}

export function Layout({ children }: LayoutProps) {
  const { user, logout } = useAuth()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false) // Mobile sidebar
  const [collapsed, setCollapsed] = useState(false) // Desktop collapse state
  const [hovered, setHovered] = useState(false) // Hover state

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Notifications', href: '/notifications', icon: Bell },
    { name: 'Profile', href: '/user-profile', icon: User },
  ]

  const isExpanded = !collapsed || hovered

  return (
    <div className="h-screen bg-gray-50 flex overflow-hidden">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Fixed */}
      <div 
        className={`
          fixed inset-y-0 left-0 z-50 bg-white shadow-lg transform transition-all duration-300 ease-in-out
          lg:relative lg:translate-x-0 lg:shadow-none lg:border-r
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          ${isExpanded ? 'w-64' : 'w-16 lg:w-16'}
        `}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between h-16 px-4 border-b bg-white">
            <div className="flex items-center space-x-3 min-w-0">
              {isExpanded ? (
                <h1 className="text-xl font-semibold text-gray-900 truncate">Atlas</h1>
              ) : (
                <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">A</span>
                </div>
              )}
            </div>
            
            {/* Desktop collapse toggle */}
            <div className="hidden lg:flex items-center space-x-1">
              {isExpanded && (
                <button
                  onClick={() => setCollapsed(!collapsed)}
                  className="p-1.5 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                  title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                >
                  {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
                </button>
              )}
            </div>

            {/* Mobile close button */}
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-2 py-6 space-y-1 overflow-y-auto">
            {navigation.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.href
              
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`
                    group flex items-center rounded-lg text-sm font-medium transition-all duration-200
                    ${isExpanded ? 'px-3 py-2.5 space-x-3' : 'px-3 py-2.5 justify-center'}
                    ${isActive 
                      ? 'bg-purple-50 text-purple-700' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }
                  `}
                  title={!isExpanded ? item.name : undefined}
                >
                  <Icon className={`h-5 w-5 flex-shrink-0 ${isActive ? 'text-purple-700' : ''}`} />
                  {isExpanded && (
                    <span className="truncate">{item.name}</span>
                  )}
                  
                  {/* Tooltip for collapsed state */}
                  {!isExpanded && !hovered && (
                    <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50">
                      {item.name}
                    </div>
                  )}
                </Link>
              )
            })}
          </nav>

          {/* User section */}
          <div className="border-t p-2 bg-white">
            {isExpanded ? (
              // Expanded user section
              <div className="space-y-3">
                <div className="flex items-center space-x-3 px-3 py-2">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="h-4 w-4 text-purple-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                       {user?.name} {user?.surname}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {user?.email}
                    </p>
                  </div>
                </div>
                
                <Button 
                  variant="outline" 
                  onClick={logout}
                  className="w-full justify-start text-sm hover:bg-purple-200"
                  size="sm"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            ) : (
              // Collapsed user section
              <div className="space-y-2">
                <div className="group relative flex justify-center">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-purple-600" />
                  </div>
                  {/* Tooltip */}
                  {!hovered && (
                    <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50">
                      {user?.name} {user?.surname}
                    </div>
                  )}
                </div>
                
                <div className="group relative flex justify-center">
                  <Button 
                    variant="outline" 
                    onClick={logout}
                    size="sm"
                    className="w-8 h-8 p-0"
                  >
                    <LogOut className="h-4 w-4" />
                  </Button>
                  {/* Tooltip */}
                  {!hovered && (
                    <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50">
                      Logout
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main content area - Scrollable */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile header - Fixed */}
        <div className="lg:hidden bg-white border-b px-4 py-3 flex items-center justify-between flex-shrink-0">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          >
            <Menu className="h-5 w-5" />
          </button>
          <h1 className="text-lg font-semibold">Atlas</h1>
          <div className="w-9" /> {/* Spacer for centering */}
        </div>

        {/* Scrollable content area */}
        <div className="flex-1 overflow-y-auto">
          <main className="p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}