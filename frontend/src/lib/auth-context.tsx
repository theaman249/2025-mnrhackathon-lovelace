import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import axios from 'axios'

interface User {
  id: string
  email: string
  name: string
  surname: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  isLoading: boolean
  token: string | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Configure axios defaults
const API_BASE_URL = ''
axios.defaults.baseURL = API_BASE_URL

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Check if user is already logged in on app start
  useEffect(() => {
    const storedToken = localStorage.getItem('authToken')
    const storedUser = localStorage.getItem('user')
    
    if (storedToken && storedUser) {
      setToken(storedToken)
      setUser(JSON.parse(storedUser))
      // Set axios default header
      axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`
    }
    
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true)
    
    try {
      const response = await axios.post('/auth/login', {
        email,
        password
      })

      // Match your API response structure
      const { jwt_token, id, name, surname, email: userEmail } = response.data

      if (jwt_token && id) {
        // Create user object from response
        const userData: User = {
          id: id,
          name: name,
          surname: surname,
          email: userEmail
        }

        // Store token and user info
        localStorage.setItem('authToken', jwt_token)
        localStorage.setItem('user', JSON.stringify(userData))
        
        // Set axios default header for future requests
        axios.defaults.headers.common['Authorization'] = `Bearer ${jwt_token}`
        
        // Update state
        setToken(jwt_token)
        localStorage.setItem('authToken', jwt_token)
        setUser(userData)
        
        return true
      }
      
      return false
    } catch (error: any) {
      console.error('Login failed:', error.response?.data?.message || error.message)
      
      // Clear any existing auth data on failed login
      localStorage.removeItem('authToken')
      localStorage.removeItem('user')
      delete axios.defaults.headers.common['Authorization']
      
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    // Clear storage
    localStorage.removeItem('authToken')
    localStorage.removeItem('user')
    
    // Clear axios header
    delete axios.defaults.headers.common['Authorization']
    
    // Clear state
    setUser(null)
    setToken(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading, token }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}