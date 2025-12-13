import { useState } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  Bell, 
  Info, 
  LogOut,
  ChevronRight,
  Save,
  X,
  Globe,
  Download,
  Lock,
  HelpCircle,
  FileText,
  Shield,
  Wifi,
  PlayCircle,
  Volume2,
  Palette,
  Languages,
  Camera,
  Upload,
  Moon,
  Sun
} from 'lucide-react';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useTheme } from '../contexts/ThemeContext';

interface SettingsPanelProps {
  user: { name: string; email: string };
  onLogout: () => void;
  onUpdateProfile: (data: { name: string; email: string; phone: string }) => void;
}

type SettingsView = 'main' | 'profile' | 'email' | 'phone' | 'notifications' | 'about' | 'language' | 'video-quality' | 'privacy' | 'data' | 'help' | 'terms' | 'policy' | 'themes';

export function SettingsPanel({ user, onLogout, onUpdateProfile }: SettingsPanelProps) {
  const { theme, toggleTheme } = useTheme();
  const [currentView, setCurrentView] = useState<SettingsView>('main');
  const [profileData, setProfileData] = useState({
    name: user.name,
    email: user.email,
    phone: '+91 9876543210',
  });
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [notifications, setNotifications] = useState({
    videoComplete: true,
    newFeatures: true,
    learningReminders: false,
    emailNotifications: true,
  });
  const [hasChanges, setHasChanges] = useState(false);

  const handleSaveProfile = () => {
    onUpdateProfile(profileData);
    setHasChanges(false);
  };

  const handleProfileChange = (field: string, value: string) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePhoto(reader.result as string);
        setHasChanges(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const settingsMenuItems = [
    { id: 'profile', icon: User, label: 'Edit Profile', description: 'Update your personal information' },
    { id: 'email', icon: Mail, label: 'Email', description: user.email },
    { id: 'phone', icon: Phone, label: 'Mobile Number', description: '+91 9876543210' },
    { id: 'themes', icon: Palette, label: 'Theme', description: theme === 'light' ? 'Light Mode' : 'Dark Mode' },
    { id: 'notifications', icon: Bell, label: 'Notifications', description: 'Manage notification preferences' },
    { id: 'language', icon: Languages, label: 'Language Preferences', description: 'Set default learning language' },
    { id: 'video-quality', icon: PlayCircle, label: 'Video & Playback', description: 'Quality, autoplay, and speed settings' },
    { id: 'privacy', icon: Lock, label: 'Privacy & Security', description: 'Manage your privacy settings' },
    { id: 'data', icon: Wifi, label: 'Data Usage', description: 'Control data and storage options' },
    { id: 'help', icon: HelpCircle, label: 'Help & Support', description: 'Get help and contact support' },
    { id: 'terms', icon: FileText, label: 'Terms & Conditions', description: 'View terms of service' },
    { id: 'policy', icon: Shield, label: 'Privacy Policy', description: 'View privacy policy' },
    { id: 'about', icon: Info, label: 'About', description: 'App version and information' },
  ];

  // Main Settings Menu
  if (currentView === 'main') {
    return (
      <div className="h-full overflow-y-auto bg-background">
        <div className="max-w-4xl mx-auto p-6 space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-foreground mb-2">Settings</h1>
            <p className="text-muted-foreground">Manage your account and preferences</p>
          </div>

          {/* Profile Card */}
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center gap-4">
              {profilePhoto ? (
                <img src={profilePhoto} alt="Profile" className="w-16 h-16 rounded-full object-cover" />
              ) : (
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl">
                  {user.name.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="flex-1">
                <h3 className="text-card-foreground mb-1">{user.name}</h3>
                <p className="text-sm text-muted-foreground">{user.email}</p>
                <p className="text-xs text-muted-foreground mt-1">Mobile: +91 9876543210</p>
              </div>
            </div>
          </div>

          {/* Settings Menu */}
          <div className="bg-card border border-border rounded-lg divide-y divide-border">
            {settingsMenuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentView(item.id as SettingsView)}
                  className="w-full flex items-center gap-4 p-4 hover:bg-accent transition-colors"
                >
                  <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center">
                    <Icon className="w-5 h-5 text-foreground" />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="text-card-foreground">{item.label}</div>
                    <div className="text-sm text-muted-foreground">{item.description}</div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </button>
              );
            })}
          </div>

          {/* Logout Button */}
          <div className="bg-card border border-border rounded-lg">
            <button
              onClick={onLogout}
              className="w-full flex items-center gap-4 p-4 hover:bg-destructive/10 transition-colors text-destructive"
            >
              <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center">
                <LogOut className="w-5 h-5" />
              </div>
              <div className="flex-1 text-left">
                <div>Logout</div>
                <div className="text-sm opacity-70">Sign out of your account</div>
              </div>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Edit Profile View
  if (currentView === 'profile') {
    return (
      <div className="h-full overflow-y-auto bg-background">
        <div className="max-w-2xl mx-auto p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                setCurrentView('main');
                setHasChanges(false);
                setProfileData({ name: user.name, email: user.email, phone: '+91 9876543210' });
                setProfilePhoto(null);
              }}
              className="p-2 hover:bg-accent rounded-lg transition"
            >
              <X className="w-5 h-5 text-foreground" />
            </button>
            <div>
              <h2 className="text-foreground">Edit Profile</h2>
              <p className="text-sm text-muted-foreground">Update your personal information</p>
            </div>
          </div>

          {/* Profile Form */}
          <div className="bg-card border border-border rounded-lg p-6 space-y-6">
            {/* Profile Picture */}
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                {profilePhoto ? (
                  <img src={profilePhoto} alt="Profile" className="w-24 h-24 rounded-full object-cover" />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-3xl">
                    {profileData.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <label
                  htmlFor="photo-upload"
                  className="absolute bottom-0 right-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center cursor-pointer hover:bg-primary/90 transition shadow-lg"
                >
                  <Camera className="w-4 h-4" />
                  <input
                    id="photo-upload"
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="sr-only"
                  />
                </label>
              </div>
              <div className="text-center">
                <Button variant="outline" size="sm" onClick={() => document.getElementById('photo-upload')?.click()}>
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Photo
                </Button>
                <p className="text-xs text-muted-foreground mt-2">JPG, PNG or GIF (Max 5MB)</p>
              </div>
            </div>

            {/* Name Field */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-card-foreground">Full Name</Label>
              <Input
                id="name"
                value={profileData.name}
                onChange={(e) => handleProfileChange('name', e.target.value)}
                placeholder="Enter your full name"
                className="text-foreground"
              />
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-card-foreground">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={profileData.email}
                onChange={(e) => handleProfileChange('email', e.target.value)}
                placeholder="Enter your email"
                className="text-foreground"
              />
            </div>

            {/* Phone Field */}
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-card-foreground">Mobile Number (Email Connected)</Label>
              <Input
                id="phone"
                type="tel"
                value={profileData.phone}
                onChange={(e) => handleProfileChange('phone', e.target.value)}
                placeholder="+91 9876543210"
                className="text-foreground"
              />
              <p className="text-xs text-muted-foreground">This mobile number is connected to your email for notifications and account recovery</p>
            </div>
          </div>

          {/* Save Button */}
          {hasChanges && (
            <Button
              onClick={handleSaveProfile}
              className="w-full"
              size="lg"
            >
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          )}
        </div>
      </div>
    );
  }

  // Email View
  if (currentView === 'email') {
    return (
      <div className="h-full overflow-y-auto bg-background">
        <div className="max-w-2xl mx-auto p-6 space-y-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setCurrentView('main')}
              className="p-2 hover:bg-accent rounded-lg transition"
            >
              <X className="w-5 h-5 text-foreground" />
            </button>
            <div>
              <h2 className="text-foreground">Email Address</h2>
              <p className="text-sm text-muted-foreground">Manage your email settings</p>
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-6 space-y-4">
            <div className="space-y-2">
              <Label>Current Email</Label>
              <div className="text-card-foreground">{user.email}</div>
            </div>
            <p className="text-sm text-muted-foreground">
              This email is used for login and notifications. To change it, please go to Edit Profile.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Phone View
  if (currentView === 'phone') {
    return (
      <div className="h-full overflow-y-auto bg-background">
        <div className="max-w-2xl mx-auto p-6 space-y-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setCurrentView('main')}
              className="p-2 hover:bg-accent rounded-lg transition"
            >
              <X className="w-5 h-5 text-foreground" />
            </button>
            <div>
              <h2 className="text-foreground">Mobile Number</h2>
              <p className="text-sm text-muted-foreground">Manage your phone number</p>
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-6 space-y-4">
            <div className="space-y-2">
              <Label>Current Number</Label>
              <div className="text-card-foreground">+91 9876543210</div>
            </div>
            <p className="text-sm text-muted-foreground">
              Used for SMS notifications and account recovery. To update, please go to Edit Profile.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Notifications View
  if (currentView === 'notifications') {
    return (
      <div className="h-full overflow-y-auto bg-background">
        <div className="max-w-2xl mx-auto p-6 space-y-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setCurrentView('main')}
              className="p-2 hover:bg-accent rounded-lg transition"
            >
              <X className="w-5 h-5 text-foreground" />
            </button>
            <div>
              <h2 className="text-foreground">Notifications</h2>
              <p className="text-sm text-muted-foreground">Manage your notification preferences</p>
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg divide-y divide-border">
            <div className="p-4 flex items-center justify-between">
              <div className="flex-1">
                <div className="text-card-foreground">Video Generation Complete</div>
                <div className="text-sm text-muted-foreground">Get notified when your videos are ready</div>
              </div>
              <Switch
                checked={notifications.videoComplete}
                onCheckedChange={(checked) =>
                  setNotifications(prev => ({ ...prev, videoComplete: checked }))
                }
              />
            </div>
            <div className="p-4 flex items-center justify-between">
              <div className="flex-1">
                <div className="text-card-foreground">New Features</div>
                <div className="text-sm text-muted-foreground">Updates about new features and improvements</div>
              </div>
              <Switch
                checked={notifications.newFeatures}
                onCheckedChange={(checked) =>
                  setNotifications(prev => ({ ...prev, newFeatures: checked }))
                }
              />
            </div>
            <div className="p-4 flex items-center justify-between">
              <div className="flex-1">
                <div className="text-card-foreground">Learning Reminders</div>
                <div className="text-sm text-muted-foreground">Daily reminders to continue learning</div>
              </div>
              <Switch
                checked={notifications.learningReminders}
                onCheckedChange={(checked) =>
                  setNotifications(prev => ({ ...prev, learningReminders: checked }))
                }
              />
            </div>
            <div className="p-4 flex items-center justify-between">
              <div className="flex-1">
                <div className="text-card-foreground">Email Notifications</div>
                <div className="text-sm text-muted-foreground">Receive updates via email</div>
              </div>
              <Switch
                checked={notifications.emailNotifications}
                onCheckedChange={(checked) =>
                  setNotifications(prev => ({ ...prev, emailNotifications: checked }))
                }
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // About View
  if (currentView === 'about') {
    return (
      <div className="h-full overflow-y-auto bg-background">
        <div className="max-w-2xl mx-auto p-6 space-y-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setCurrentView('main')}
              className="p-2 hover:bg-accent rounded-lg transition"
            >
              <X className="w-5 h-5 text-foreground" />
            </button>
            <div>
              <h2 className="text-foreground">About</h2>
              <p className="text-sm text-muted-foreground">Application information</p>
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-6 space-y-6 text-center">
            <div className="w-20 h-20 mx-auto bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
              <Info className="w-10 h-10 text-white" />
            </div>
            <div>
              <h3 className="text-card-foreground mb-2">Learning With AI</h3>
              <p className="text-muted-foreground">Version 1.0.0</p>
            </div>
            <div className="text-sm text-muted-foreground space-y-2">
              <p>
                A multi-language topic learning platform with AI video generation capabilities.
              </p>
              <p>
                Learn any topic through AI-generated animated videos with voiceover, subtitles, and comprehensive explanations in 13+ Indian languages.
              </p>
            </div>
            <div className="text-xs text-muted-foreground pt-4 border-t border-border">
              <p>© 2025 Learning With AI. All rights reserved.</p>
              <p className="mt-1">Built with React, TypeScript, and Tailwind CSS</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Language Preferences View
  if (currentView === 'language') {
    return (
      <div className="h-full overflow-y-auto bg-background">
        <div className="max-w-2xl mx-auto p-6 space-y-6">
          <div className="flex items-center gap-4">
            <button onClick={() => setCurrentView('main')} className="p-2 hover:bg-accent rounded-lg transition">
              <X className="w-5 h-5 text-foreground" />
            </button>
            <div>
              <h2 className="text-foreground">Language Preferences</h2>
              <p className="text-sm text-muted-foreground">Set your default learning language</p>
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-6 space-y-4">
            <div className="space-y-2">
              <Label>Default Learning Language</Label>
              <Select defaultValue="english">
                <SelectTrigger>
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="english">English</SelectItem>
                  <SelectItem value="hindi">Hindi (हिंदी)</SelectItem>
                  <SelectItem value="telugu">Telugu (తెలుగు)</SelectItem>
                  <SelectItem value="tamil">Tamil (தமிழ்)</SelectItem>
                  <SelectItem value="malayalam">Malayalam (മലയാളം)</SelectItem>
                  <SelectItem value="kannada">Kannada (ಕನ್ನಡ)</SelectItem>
                  <SelectItem value="gujarati">Gujarati (ગુજરાતી)</SelectItem>
                  <SelectItem value="marathi">Marathi (मराठी)</SelectItem>
                  <SelectItem value="bengali">Bengali (বাংলা)</SelectItem>
                  <SelectItem value="punjabi">Punjabi (ਪੰਜਾਬੀ)</SelectItem>
                  <SelectItem value="urdu">Urdu (اردو)</SelectItem>
                  <SelectItem value="odia">Odia (ଓଡ଼ିଆ)</SelectItem>
                  <SelectItem value="assamese">Assamese (অসমীয়া)</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground">Videos will be generated in this language by default</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Video Quality & Playback View
  if (currentView === 'video-quality') {
    return (
      <div className="h-full overflow-y-auto bg-background">
        <div className="max-w-2xl mx-auto p-6 space-y-6">
          <div className="flex items-center gap-4">
            <button onClick={() => setCurrentView('main')} className="p-2 hover:bg-accent rounded-lg transition">
              <X className="w-5 h-5 text-foreground" />
            </button>
            <div>
              <h2 className="text-foreground">Video & Playback</h2>
              <p className="text-sm text-muted-foreground">Customize video settings</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-card border border-border rounded-lg p-6 space-y-4">
              <div className="space-y-2">
                <Label>Video Quality</Label>
                <Select defaultValue="1080p">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="auto">Auto (Recommended)</SelectItem>
                    <SelectItem value="1080p">1080p HD</SelectItem>
                    <SelectItem value="720p">720p</SelectItem>
                    <SelectItem value="480p">480p</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Playback Speed</Label>
                <Select defaultValue="1.0">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0.5">0.5x</SelectItem>
                    <SelectItem value="0.75">0.75x</SelectItem>
                    <SelectItem value="1.0">1.0x (Normal)</SelectItem>
                    <SelectItem value="1.25">1.25x</SelectItem>
                    <SelectItem value="1.5">1.5x</SelectItem>
                    <SelectItem value="2.0">2.0x</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="bg-card border border-border rounded-lg divide-y divide-border">
              <div className="p-4 flex items-center justify-between">
                <div className="flex-1">
                  <div className="text-card-foreground">Auto-play Next Chapter</div>
                  <div className="text-sm text-muted-foreground">Automatically play the next chapter</div>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="p-4 flex items-center justify-between">
                <div className="flex-1">
                  <div className="text-card-foreground">Show Subtitles</div>
                  <div className="text-sm text-muted-foreground">Display subtitles during playback</div>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="p-4 flex items-center justify-between">
                <div className="flex-1">
                  <div className="text-card-foreground">Loop Videos</div>
                  <div className="text-sm text-muted-foreground">Repeat video when it ends</div>
                </div>
                <Switch />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Privacy & Security View
  if (currentView === 'privacy') {
    return (
      <div className="h-full overflow-y-auto bg-background">
        <div className="max-w-2xl mx-auto p-6 space-y-6">
          <div className="flex items-center gap-4">
            <button onClick={() => setCurrentView('main')} className="p-2 hover:bg-accent rounded-lg transition">
              <X className="w-5 h-5 text-foreground" />
            </button>
            <div>
              <h2 className="text-foreground">Privacy & Security</h2>
              <p className="text-sm text-muted-foreground">Manage your privacy settings</p>
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg divide-y divide-border">
            <div className="p-4 flex items-center justify-between">
              <div className="flex-1">
                <div className="text-card-foreground">Save Learning History</div>
                <div className="text-sm text-muted-foreground">Keep track of your learning progress</div>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="p-4 flex items-center justify-between">
              <div className="flex-1">
                <div className="text-card-foreground">Anonymous Usage Data</div>
                <div className="text-sm text-muted-foreground">Help improve the app by sharing anonymous data</div>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="p-4 flex items-center justify-between">
              <div className="flex-1">
                <div className="text-card-foreground">Personalized Recommendations</div>
                <div className="text-sm text-muted-foreground">Get topic suggestions based on your interests</div>
              </div>
              <Switch defaultChecked />
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-card-foreground mb-4">Data Management</h3>
            <div className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <Download className="w-4 h-4 mr-2" />
                Download My Data
              </Button>
              <Button variant="outline" className="w-full justify-start text-destructive hover:text-destructive">
                <X className="w-4 h-4 mr-2" />
                Delete My Account
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Data Usage View
  if (currentView === 'data') {
    return (
      <div className="h-full overflow-y-auto bg-background">
        <div className="max-w-2xl mx-auto p-6 space-y-6">
          <div className="flex items-center gap-4">
            <button onClick={() => setCurrentView('main')} className="p-2 hover:bg-accent rounded-lg transition">
              <X className="w-5 h-5 text-foreground" />
            </button>
            <div>
              <h2 className="text-foreground">Data Usage</h2>
              <p className="text-sm text-muted-foreground">Control data and storage options</p>
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-6 space-y-4">
            <div className="space-y-2">
              <Label>Download Quality (WiFi)</Label>
              <Select defaultValue="high">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">High Quality</SelectItem>
                  <SelectItem value="medium">Medium Quality</SelectItem>
                  <SelectItem value="low">Low Quality</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Download Quality (Mobile Data)</Label>
              <Select defaultValue="medium">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">High Quality</SelectItem>
                  <SelectItem value="medium">Medium Quality</SelectItem>
                  <SelectItem value="low">Low Quality</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg divide-y divide-border">
            <div className="p-4 flex items-center justify-between">
              <div className="flex-1">
                <div className="text-card-foreground">Download Over Mobile Data</div>
                <div className="text-sm text-muted-foreground">Allow video downloads without WiFi</div>
              </div>
              <Switch />
            </div>
            <div className="p-4 flex items-center justify-between">
              <div className="flex-1">
                <div className="text-card-foreground">Auto-Delete Watched Videos</div>
                <div className="text-sm text-muted-foreground">Remove videos after 7 days</div>
              </div>
              <Switch />
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-card-foreground mb-2">Storage Used</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Videos</span>
                <span className="text-card-foreground">2.4 GB</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Cache</span>
                <span className="text-card-foreground">156 MB</span>
              </div>
              <div className="flex justify-between text-sm pt-2 border-t border-border">
                <span className="text-card-foreground">Total</span>
                <span className="text-card-foreground">2.56 GB</span>
              </div>
            </div>
            <Button variant="outline" className="w-full mt-4">
              Clear Cache
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Help & Support View
  if (currentView === 'help') {
    return (
      <div className="h-full overflow-y-auto bg-background">
        <div className="max-w-2xl mx-auto p-6 space-y-6">
          <div className="flex items-center gap-4">
            <button onClick={() => setCurrentView('main')} className="p-2 hover:bg-accent rounded-lg transition">
              <X className="w-5 h-5 text-foreground" />
            </button>
            <div>
              <h2 className="text-foreground">Help & Support</h2>
              <p className="text-sm text-muted-foreground">Get help and contact us</p>
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg divide-y divide-border">
            <button className="w-full p-4 text-left hover:bg-accent transition">
              <div className="text-card-foreground mb-1">FAQ</div>
              <div className="text-sm text-muted-foreground">Frequently asked questions</div>
            </button>
            <button className="w-full p-4 text-left hover:bg-accent transition">
              <div className="text-card-foreground mb-1">Contact Support</div>
              <div className="text-sm text-muted-foreground">support@learningwithai.com</div>
            </button>
            <button className="w-full p-4 text-left hover:bg-accent transition">
              <div className="text-card-foreground mb-1">Report a Bug</div>
              <div className="text-sm text-muted-foreground">Help us improve the app</div>
            </button>
            <button className="w-full p-4 text-left hover:bg-accent transition">
              <div className="text-card-foreground mb-1">Feature Request</div>
              <div className="text-sm text-muted-foreground">Suggest new features</div>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Terms & Conditions View
  if (currentView === 'terms') {
    return (
      <div className="h-full overflow-y-auto bg-background">
        <div className="max-w-2xl mx-auto p-6 space-y-6">
          <div className="flex items-center gap-4">
            <button onClick={() => setCurrentView('main')} className="p-2 hover:bg-accent rounded-lg transition">
              <X className="w-5 h-5 text-foreground" />
            </button>
            <div>
              <h2 className="text-foreground">Terms & Conditions</h2>
              <p className="text-sm text-muted-foreground">Our terms of service</p>
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-6 space-y-4 text-sm">
            <div>
              <h3 className="text-card-foreground mb-2">1. Acceptance of Terms</h3>
              <p className="text-muted-foreground">
                By accessing and using Learning With AI, you accept and agree to be bound by the terms and provision of this agreement.
              </p>
            </div>
            <div>
              <h3 className="text-card-foreground mb-2">2. Use License</h3>
              <p className="text-muted-foreground">
                Permission is granted to temporarily access the materials on Learning With AI for personal, non-commercial transitory viewing only.
              </p>
            </div>
            <div>
              <h3 className="text-card-foreground mb-2">3. Educational Content</h3>
              <p className="text-muted-foreground">
                All AI-generated educational videos and content are provided for learning purposes. We strive for accuracy but cannot guarantee complete correctness.
              </p>
            </div>
            <div className="pt-4 border-t border-border text-xs text-muted-foreground">
              Last updated: December 12, 2025
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Privacy Policy View
  if (currentView === 'policy') {
    return (
      <div className="h-full overflow-y-auto bg-background">
        <div className="max-w-2xl mx-auto p-6 space-y-6">
          <div className="flex items-center gap-4">
            <button onClick={() => setCurrentView('main')} className="p-2 hover:bg-accent rounded-lg transition">
              <X className="w-5 h-5 text-foreground" />
            </button>
            <div>
              <h2 className="text-foreground">Privacy Policy</h2>
              <p className="text-sm text-muted-foreground">How we protect your data</p>
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-6 space-y-4 text-sm">
            <div>
              <h3 className="text-card-foreground mb-2">Data Collection</h3>
              <p className="text-muted-foreground">
                We collect information you provide directly to us, including name, email, and learning preferences to enhance your experience.
              </p>
            </div>
            <div>
              <h3 className="text-card-foreground mb-2">How We Use Your Data</h3>
              <p className="text-muted-foreground">
                Your data is used to personalize your learning experience, generate relevant educational content, and improve our services.
              </p>
            </div>
            <div>
              <h3 className="text-card-foreground mb-2">Data Security</h3>
              <p className="text-muted-foreground">
                We implement appropriate technical and organizational measures to protect your personal information against unauthorized access.
              </p>
            </div>
            <div>
              <h3 className="text-card-foreground mb-2">Your Rights</h3>
              <p className="text-muted-foreground">
                You have the right to access, update, or delete your personal information at any time through your account settings.
              </p>
            </div>
            <div className="pt-4 border-t border-border text-xs text-muted-foreground">
              Last updated: December 12, 2025
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Themes View
  if (currentView === 'themes') {
    return (
      <div className="h-full overflow-y-auto bg-background">
        <div className="max-w-2xl mx-auto p-6 space-y-6">
          <div className="flex items-center gap-4">
            <button onClick={() => setCurrentView('main')} className="p-2 hover:bg-accent rounded-lg transition">
              <X className="w-5 h-5 text-foreground" />
            </button>
            <div>
              <h2 className="text-foreground">Theme</h2>
              <p className="text-sm text-muted-foreground">Choose your preferred theme</p>
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-6 space-y-4">
            <div className="space-y-2">
              <Label>Current Theme</Label>
              <Select defaultValue={theme}>
                <SelectTrigger>
                  <SelectValue placeholder="Select theme" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">
                    <Sun className="w-5 h-5 mr-2" />
                    Light Mode
                  </SelectItem>
                  <SelectItem value="dark">
                    <Moon className="w-5 h-5 mr-2" />
                    Dark Mode
                  </SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground">Switch between light and dark themes</p>
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-card-foreground mb-4">Theme Management</h3>
            <div className="space-y-3">
              <Button variant="outline" className="w-full justify-start" onClick={toggleTheme}>
                <Palette className="w-4 h-4 mr-2" />
                Toggle Theme
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}