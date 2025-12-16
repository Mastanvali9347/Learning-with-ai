import { ReactNode, useState } from 'react';
import {
  Menu,
  X,
  Plus,
  MessageSquare,
  Video,
  Settings,
  Moon,
  Sun,
  ChevronDown,
  User,
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import logoImage from '../assets/images/learning-ai.png';



interface MainLayoutProps {
  children: ReactNode;
  user: { name: string; email: string };
  currentView: 'chat' | 'history' | 'saved' | 'settings';
  onViewChange: (view: 'chat' | 'history' | 'saved' | 'settings') => void;
  onNewChat: () => void;
  chatCount?: number;
  savedCount?: number;
}

export function MainLayout({ 
  children, 
  user, 
  currentView, 
  onViewChange, 
  onNewChat,
  chatCount = 0,
  savedCount = 0 
}: MainLayoutProps) {
  const { theme, toggleTheme } = useTheme();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const menuItems = [
    { id: 'chat', icon: Plus, label: 'New Chat', badge: null },
    { id: 'history', icon: MessageSquare, label: 'Your Chats', badge: chatCount > 0 ? chatCount : null },
    { id: 'saved', icon: Video, label: 'Saved Videos', badge: savedCount > 0 ? savedCount : null },
    { id: 'settings', icon: Settings, label: 'Settings', badge: null },
  ];

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Sidebar */}
      <aside
        className={`${
          isSidebarOpen ? 'w-64' : 'w-0'
        } transition-all duration-300 bg-sidebar border-r border-sidebar-border flex flex-col overflow-hidden`}
      >
        {/* Logo Section */}
        <div className="p-4 border-b border-sidebar-border flex items-center gap-3">
          <div className="w-10 h-10 bg-white dark:bg-gray-700 rounded-lg flex items-center justify-center p-2 border border-gray-200 dark:border-gray-600">
            <img src={logoImage} alt="Logo" className="w-full h-full object-contain" />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-sidebar-foreground truncate">Learning With AI</h2>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            const isNewChat = item.id === 'chat';

            return (
              <button
                key={item.id}
                onClick={() => {
                  if (isNewChat) {
                    onNewChat();
                  } else {
                    onViewChange(item.id as any);
                  }
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  isActive && !isNewChat
                    ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                    : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
                }`}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span className="flex-1 text-left truncate">{item.label}</span>
                {item.badge !== null && (
                  <span className="px-2 py-0.5 text-xs rounded-full bg-primary text-primary-foreground">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Theme Toggle in Sidebar */}
        <div className="p-3 border-t border-sidebar-border">
          <button
            onClick={toggleTheme}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent/50 transition-all"
          >
            {theme === 'light' ? (
              <>
                <Moon className="w-5 h-5" />
                <span>Dark Mode</span>
              </>
            ) : (
              <>
                <Sun className="w-5 h-5" />
                <span>Light Mode</span>
              </>
            )}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="h-16 bg-card border-b border-border px-4 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-accent rounded-lg transition"
              aria-label="Toggle sidebar"
            >
              {isSidebarOpen ? (
                <X className="w-5 h-5 text-foreground" />
              ) : (
                <Menu className="w-5 h-5 text-foreground" />
              )}
            </button>
            
            {/* Current View Title */}
            <div className="hidden sm:block">
              <h1 className="text-foreground">
                {currentView === 'chat' && 'New Chat'}
                {currentView === 'history' && 'Your Chats'}
                {currentView === 'saved' && 'Saved Videos'}
                {currentView === 'settings' && 'Settings'}
              </h1>
            </div>
          </div>

          {/* Profile Section */}
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-3 px-3 py-2 hover:bg-accent rounded-lg transition"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="hidden md:block text-left">
                <div className="text-sm text-foreground">{user.name}</div>
                <div className="text-xs text-muted-foreground">{user.email}</div>
              </div>
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            </button>

            {/* Profile Dropdown */}
            {showProfileMenu && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowProfileMenu(false)}
                />
                <div className="absolute right-0 mt-2 w-64 bg-popover border border-border rounded-lg shadow-lg z-20 overflow-hidden">
                  <div className="p-4 border-b border-border">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm text-popover-foreground truncate">
                          {user.name}
                        </div>
                        <div className="text-xs text-muted-foreground truncate">
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="p-2">
                    <button
                      onClick={() => {
                        setShowProfileMenu(false);
                        onViewChange('settings');
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2 text-sm text-popover-foreground hover:bg-accent rounded-md transition"
                    >
                      <User className="w-4 h-4" />
                      <span>View Profile & Settings</span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
