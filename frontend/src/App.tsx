import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthPage } from './components/AuthPage';
import { MainLayout } from './components/MainLayout';
import { ChatLearningPage } from './components/ChatLearningPage';
import { ChatHistory } from './components/ChatHistory';
import { SavedVideos } from './components/SavedVideos';
import { SettingsPanel } from './components/SettingsPanel';
import { EnhancedVideoPlayer } from './components/EnhancedVideoPlayer';
import { ThemeProvider } from './contexts/ThemeContext';

interface ChatHistoryItem {
  id: string;
  topic: string;
  type: string;
  language: string;
  timestamp: Date;
  messageCount: number;
}

interface SavedVideo {
  id: string;
  topic: string;
  type: string;
  language: string;
  thumbnail: string;
  videoUrl: string;
  duration: string;
  savedDate: Date;
}

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<{ name: string; email: string } | null>(null);
  const [currentView, setCurrentView] = useState<'chat' | 'history' | 'saved' | 'settings'>('chat');
  const [playingVideo, setPlayingVideo] = useState<SavedVideo | null>(null);
  const [chatHistory, setChatHistory] = useState<ChatHistoryItem[]>([
    {
      id: '1',
      topic: 'Quantum Mechanics',
      type: 'Definition',
      language: 'English',
      timestamp: new Date(Date.now() - 3600000),
      messageCount: 12,
    },
    {
      id: '2',
      topic: 'Photosynthesis',
      type: 'Real-world Applications',
      language: 'Hindi',
      timestamp: new Date(Date.now() - 86400000),
      messageCount: 8,
    },
    {
      id: '3',
      topic: 'Machine Learning',
      type: 'Creative Explanation',
      language: 'English',
      timestamp: new Date(Date.now() - 172800000),
      messageCount: 15,
    },
  ]);
  const [savedVideos, setSavedVideos] = useState<SavedVideo[]>([
    {
      id: '1',
      topic: 'Quantum Mechanics Explained',
      type: 'Definition',
      language: 'English',
      thumbnail: 'https://images.unsplash.com/photo-1752451399416-faef5f9fe572?w=800&q=80',
      videoUrl: 'https://example.com/video1.mp4',
      duration: '16:23',
      savedDate: new Date(Date.now() - 3600000),
    },
    {
      id: '2',
      topic: 'The Process of Photosynthesis',
      type: 'Real-world Applications',
      language: 'Hindi',
      thumbnail: 'https://images.unsplash.com/photo-1634626601884-90acf3c95a5b?w=800&q=80',
      videoUrl: 'https://example.com/video2.mp4',
      duration: '15:47',
      savedDate: new Date(Date.now() - 86400000),
    },
    {
      id: '3',
      topic: 'Introduction to Machine Learning',
      type: 'Creative Explanation',
      language: 'English',
      thumbnail: 'https://images.unsplash.com/photo-1697577418970-95d99b5a55cf?w=800&q=80',
      videoUrl: 'https://example.com/video3.mp4',
      duration: '17:12',
      savedDate: new Date(Date.now() - 172800000),
    },
  ]);

  const handleLogin = (user: { name: string; email: string }) => {
    setCurrentUser(user);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    setCurrentView('chat');
  };

  const handleNewChat = () => {
    setCurrentView('chat');
  };

  const handleViewChange = (view: 'chat' | 'history' | 'saved' | 'settings') => {
    setCurrentView(view);
  };

  const handleSelectChat = (chatId: string) => {
    // TODO: Load the selected chat and switch to chat view
    console.log('Selected chat:', chatId);
    setCurrentView('chat');
  };

  const handleDeleteChat = (chatId: string) => {
    setChatHistory(prev => prev.filter(chat => chat.id !== chatId));
  };

  const handlePlayVideo = (videoId: string) => {
    // TODO: Open video player
    console.log('Play video:', videoId);
    const video = savedVideos.find(v => v.id === videoId);
    if (video) {
      setPlayingVideo(video);
    }
  };

  const handleDeleteVideo = (videoId: string) => {
    setSavedVideos(prev => prev.filter(video => video.id !== videoId));
  };

  const handleDownloadVideo = (videoId: string) => {
    // TODO: Download video
    console.log('Download video:', videoId);
  };

  const handleShareVideo = (videoId: string) => {
    // TODO: Share video
    console.log('Share video:', videoId);
  };

  const handleUpdateProfile = (data: { name: string; email: string; phone: string }) => {
    if (currentUser) {
      setCurrentUser({ name: data.name, email: data.email });
    }
  };

  const handleVideoGenerated = (videoData: any) => {
    // Add to saved videos
    const newVideo: SavedVideo = {
      id: Date.now().toString(),
      topic: videoData.topic,
      type: videoData.type,
      language: videoData.language,
      thumbnail: videoData.thumbnail,
      videoUrl: videoData.videoUrl,
      duration: '16:23', // Mock duration
      savedDate: new Date(),
    };
    setSavedVideos(prev => [newVideo, ...prev]);
  };

  const handleChatComplete = (messages: any) => {
    // Add to chat history
    const newChat: ChatHistoryItem = {
      id: Date.now().toString(),
      topic: 'New Learning Session',
      type: 'General',
      language: 'English',
      timestamp: new Date(),
      messageCount: messages.length,
    };
    setChatHistory(prev => [newChat, ...prev]);
  };

  if (!isAuthenticated) {
    return (
      <ThemeProvider>
        <AuthPage onLogin={handleLogin} />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      <MainLayout
        user={currentUser!}
        currentView={currentView}
        onViewChange={handleViewChange}
        onNewChat={handleNewChat}
        chatCount={chatHistory.length}
        savedCount={savedVideos.length}
      >
        {currentView === 'chat' && (
          <ChatLearningPage
            user={currentUser!}
            onLogout={handleLogout}
            onChatComplete={handleChatComplete}
            onVideoGenerated={handleVideoGenerated}
          />
        )}
        {currentView === 'history' && (
          <ChatHistory
            chats={chatHistory}
            onSelectChat={handleSelectChat}
            onDeleteChat={handleDeleteChat}
          />
        )}
        {currentView === 'saved' && (
          <SavedVideos
            videos={savedVideos}
            onPlayVideo={handlePlayVideo}
            onDeleteVideo={handleDeleteVideo}
            onDownloadVideo={handleDownloadVideo}
            onShareVideo={handleShareVideo}
          />
        )}
        {currentView === 'settings' && (
          <SettingsPanel
            user={currentUser!}
            onLogout={handleLogout}
            onUpdateProfile={handleUpdateProfile}
          />
        )}
        {playingVideo && (
          <EnhancedVideoPlayer
            video={playingVideo}
            onClose={() => setPlayingVideo(null)}
          />
        )}
      </MainLayout>
    </ThemeProvider>
  );
}