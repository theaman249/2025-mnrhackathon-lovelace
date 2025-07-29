import { useState, useRef } from 'react'
import { useAuth } from '@/lib/auth-context'
import axios from 'axios'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  Camera, 
  Save, 
  Eye, 
  EyeOff,
  Bell,
  BellOff,
  Mail,
  User,
  Lock
} from 'lucide-react'

interface UserPreferences {
  emailNotifications: boolean
  mutedUntil: string | null
}

export function UserProfile() {
  const { user, token } = useAuth()
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  // Form states
  const [formData, setFormData] = useState({
    name: user?.name || '',
    surname: user?.surname || '',
    email: user?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  
  const [preferences, setPreferences] = useState<UserPreferences>({
    emailNotifications: true,
    mutedUntil: null
  })
  
  const [profileImage, setProfileImage] = useState<string | null>(null)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Mute duration options
  const muteDurations = [
    { value: '1h', label: '1 Hour' },
    { value: '2h', label: '2 Hours' },
    { value: '4h', label: '4 Hours' },
    { value: '8h', label: '8 Hours' },
    { value: '1d', label: '1 Day' },
    { value: '3d', label: '3 Days' },
    { value: '1w', label: '1 Week' }
  ]

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB')
        return
      }
      
      // Check file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file')
        return
      }

      const reader = new FileReader()
      reader.onload = (e) => {
        setProfileImage(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleProfileSave = async () => {
    // Validation
    if (!formData.name.trim() || !formData.surname.trim() || !formData.email.trim()) {
      alert('Please fill in all required fields')
      return
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      alert('Please enter a valid email address')
      return
    }

    if (!user?.id || !token) {
      alert('User authentication error. Please login again.')
      return
    }

    setIsLoading(true)
    
    try {
      // Prepare data for API
      const updateData = {
        id: user.id,
         data: {
          name: formData.name.trim(),
          surname: formData.surname.trim(),
          email: formData.email.trim()
        }
      }

      // Make API call with authorization header
      const response = await axios.post(
        '/profile/preferences',  // Remove the full URL
        updateData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      )

      if (response.status === 200) {
         alert('Profile updated successfully!')
        
        // Update user data in localStorage if needed
        const updatedUser = {
          ...user,
          name: formData.name.trim(),
          surname: formData.surname.trim(),
          email: formData.email.trim()
        }
        localStorage.setItem('user', JSON.stringify(updatedUser))
        
        // console.log('Profile update response:', response.data)
        window.location.reload()
      }
    } catch (error: any) {
      console.error('Error updating profile:', error)
      
      if (error.response?.status === 401) {
        alert('Authentication failed. Please login again.')
      } else if (error.response?.data?.message) {
        alert(`Failed to update profile: ${error.response.data.message}`)
      } else {
        alert('Failed to update profile. Please try again.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handlePasswordChange = async () => {
    if (formData.newPassword !== formData.confirmPassword) {
      alert('New passwords do not match')
      return
    }
    
    if (formData.newPassword.length < 6) {
      alert('Password must be at least 6 characters long')
      return
    }

    setIsLoading(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      console.log('Changing password')
      
      // Reset password fields
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }))
      
      alert('Password changed successfully!')
    } catch (error) {
      console.error('Error changing password:', error)
      alert('Failed to change password')
    } finally {
      setIsLoading(false)
    }
  }

  const handleMuteNotifications = (duration: string) => {
    const now = new Date()
    let mutedUntil: Date
    
    switch (duration) {
      case '1h':
        mutedUntil = new Date(now.getTime() + 60 * 60 * 1000)
        break
      case '2h':
        mutedUntil = new Date(now.getTime() + 2 * 60 * 60 * 1000)
        break
      case '4h':
        mutedUntil = new Date(now.getTime() + 4 * 60 * 60 * 1000)
        break
      case '8h':
        mutedUntil = new Date(now.getTime() + 8 * 60 * 60 * 1000)
        break
      case '1d':
        mutedUntil = new Date(now.getTime() + 24 * 60 * 60 * 1000)
        break
      case '3d':
        mutedUntil = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000)
        break
      case '1w':
        mutedUntil = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
        break
      default:
        return
    }
    
    setPreferences(prev => ({
      ...prev,
      mutedUntil: mutedUntil.toISOString()
    }))
  }

  const unmuteNotifications = () => {
    setPreferences(prev => ({
      ...prev,
      mutedUntil: null
    }))
  }

  const isMuted = preferences.mutedUntil && new Date(preferences.mutedUntil) > new Date()

  return (
      <div className="space-y-6 pb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
          <p className="text-gray-600 mt-2">Manage your account settings and preferences</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Picture */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>Profile Picture</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col items-center space-y-4">
                <Avatar className="w-24 h-24">
                  <AvatarImage src={profileImage || undefined} />
                  <AvatarFallback className="text-xl">
                    {user?.name?.charAt(0).toUpperCase()}{user?.surname?.charAt(0).toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                
                <div className="space-y-2 w-full">
                  <Button
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full"
                  >
                    <Camera className="h-4 w-4 mr-2" />
                    Upload Photo
                  </Button>
                  
                  {profileImage && (
                    <Button
                      variant="ghost"
                      onClick={() => setProfileImage(null)}
                      className="w-full text-red-600 hover:text-red-700"
                    >
                      Remove Photo
                    </Button>
                  )}
                </div>
                
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                
                <p className="text-xs text-gray-500 text-center">
                  JPG, PNG or GIF. Max size 5MB.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Personal Information */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>Personal Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">First Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Enter your first name"
                    disabled={isLoading}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="surname">Last Name</Label>
                  <Input
                    id="surname"
                    value={formData.surname}
                    onChange={(e) => handleInputChange('surname', e.target.value)}
                    placeholder="Enter your last name"
                    disabled={isLoading}
                  />
                </div>
                
                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="Enter your email"
                    disabled={isLoading}
                  />
                </div>
              </div>
              
              <div className="pt-4">
                <Button 
                  onClick={handleProfileSave}
                  disabled={isLoading}
                  className="w-full md:w-auto"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {isLoading ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Password Change */}
          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Lock className="h-5 w-5" />
                <span>Change Password</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <div className="relative">
                    <Input
                      id="currentPassword"
                      type={showCurrentPassword ? "text" : "password"}
                      value={formData.currentPassword}
                      onChange={(e) => handleInputChange('currentPassword', e.target.value)}
                      placeholder="Enter current password"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    >
                      {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <div className="relative">
                    <Input
                      id="newPassword"
                      type={showNewPassword ? "text" : "password"}
                      value={formData.newPassword}
                      onChange={(e) => handleInputChange('newPassword', e.target.value)}
                      placeholder="Enter new password"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                      placeholder="Confirm new password"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="pt-4">
                <Button 
                  onClick={handlePasswordChange}
                  disabled={isLoading || !formData.currentPassword || !formData.newPassword || !formData.confirmPassword}
                  variant="outline"
                >
                  <Lock className="h-4 w-4 mr-2" />
                  {isLoading ? 'Changing...' : 'Change Password'}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Notification Preferences */}
          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="h-5 w-5" />
                <span>Notification Preferences</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Email Notifications */}
              <div className="flex items-center justify-between py-2">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <Label className="text-base font-medium">Email Notifications</Label>
                  </div>
                  <p className="text-sm text-gray-600">Receive notifications via email</p>
                </div>
                <Switch
                  checked={preferences.emailNotifications}
                  onCheckedChange={(checked) => 
                    setPreferences(prev => ({ ...prev, emailNotifications: checked }))
                  }
                />
              </div>
              
              <Separator />
              
              {/* Mute Notifications */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      {isMuted ? (
                        <BellOff className="h-4 w-4 text-orange-500" />
                      ) : (
                        <Bell className="h-4 w-4 text-gray-500" />
                      )}
                      <Label className="text-base font-medium">
                        {isMuted ? 'Notifications Muted' : 'Mute Notifications'}
                      </Label>
                    </div>
                    <p className="text-sm text-gray-600">
                      {isMuted 
                        ? `Muted until ${new Date(preferences.mutedUntil!).toLocaleString()}`
                        : 'Temporarily disable all notifications'
                      }
                    </p>
                  </div>
                  
                  {isMuted && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={unmuteNotifications}
                    >
                      Unmute
                    </Button>
                  )}
                </div>
                
                {!isMuted && (
                  <div className="flex items-center space-x-2">
                    <Select onValueChange={handleMuteNotifications}>
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="Select duration" />
                      </SelectTrigger>
                      <SelectContent>
                        {muteDurations.map((duration) => (
                          <SelectItem key={duration.value} value={duration.value}>
                            {duration.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
              
              <div className="pt-4">
                <Button 
                  onClick={handleProfileSave}
                  disabled={isLoading}
                  className="w-full md:w-auto"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {isLoading ? 'Saving...' : 'Save Preferences'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
  )
}