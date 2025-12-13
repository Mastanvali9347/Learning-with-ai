import { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';
import { motion } from 'framer-motion';
import { ChatMessage } from './ChatMessage';
import { TopicTypeSelector } from './TopicTypeSelector';
import { TeachingMethodSelector } from './TeachingMethodSelector';
import { LanguageSelector } from './LanguageSelector';
import { VideoGenerationConfirm } from './VideoGenerationConfirm';
import { VideoGenerationProgress } from './VideoGenerationProgress';
import { VideoResult } from './VideoResult';
import { Brain, Presentation, BookOpen, Target, Lightbulb, Users } from 'lucide-react';

interface ChatLearningPageProps {
  user: { name: string; email: string };
  onLogout: () => void;
  onChatComplete?: (chatData: any) => void;
  onVideoGenerated?: (videoData: any) => void;
}

type ConversationStep = 
  | 'initial'
  | 'topic-types'
  | 'teaching-methods'
  | 'language-selection'
  | 'video-confirmation'
  | 'generating-video'
  | 'video-complete';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface LearningSession {
  topic: string;
  selectedType?: string;
  selectedMethod?: string;
  selectedLanguage?: string;
  videoUrl?: string;
  thumbnail?: string;
  transcript?: string;
}

const TOPIC_TYPES = [
  { id: 'definition', label: 'Definition', icon: '📖' },
  { id: 'formulas', label: 'Formulas', icon: '🔢' },
  { id: 'real-world', label: 'Real-world Applications', icon: '🌍' },
  { id: 'derivation', label: 'Derivation', icon: '📐' },
  { id: 'summary', label: 'Summary', icon: '📝' },
  { id: 'diagram', label: 'Diagram Explanation', icon: '📊' },
  { id: 'creative', label: 'Creative Explanation', icon: '✨' },
];

const TEACHING_METHODS = [
  { id: 'visual', label: 'Visual Learning', description: 'Diagrams, charts, and visual explanations', icon: <Brain className="w-5 h-5" /> },
  { id: 'interactive', label: 'Interactive Learning', description: 'Hands-on activities and demonstrations', icon: <Presentation className="w-5 h-5" /> },
  { id: 'textual', label: 'Textual Learning', description: 'Reading and written explanations', icon: <BookOpen className="w-5 h-5" /> },
  { id: 'practical', label: 'Practical Learning', description: 'Real-world examples and applications', icon: <Target className="w-5 h-5" /> },
  { id: 'conceptual', label: 'Conceptual Learning', description: 'Theory and fundamental concepts', icon: <Lightbulb className="w-5 h-5" /> },
  { id: 'collaborative', label: 'Collaborative Learning', description: 'Group discussions and problem-solving', icon: <Users className="w-5 h-5" /> },
];

const INDIAN_LANGUAGES = [
  { id: 'english', label: 'English', nativeName: 'English' },
  { id: 'hindi', label: 'Hindi', nativeName: 'हिंदी' },
  { id: 'telugu', label: 'Telugu', nativeName: 'తెలుగు' },
  { id: 'tamil', label: 'Tamil', nativeName: 'தமிழ்' },
  { id: 'malayalam', label: 'Malayalam', nativeName: 'മലയാളം' },
  { id: 'kannada', label: 'Kannada', nativeName: 'ಕನ್ನಡ' },
  { id: 'gujarati', label: 'Gujarati', nativeName: 'ગુજરાતી' },
  { id: 'marathi', label: 'Marathi', nativeName: 'मराठी' },
  { id: 'bengali', label: 'Bengali', nativeName: 'বাংলা' },
  { id: 'punjabi', label: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ' },
  { id: 'urdu', label: 'Urdu', nativeName: 'اردو' },
  { id: 'odia', label: 'Odia', nativeName: 'ଓଡ଼ିଆ' },
  { id: 'assamese', label: 'Assamese', nativeName: 'অসমীয়া' },
  { id: 'konkani', label: 'Konkani', nativeName: 'कोंकणी' },
  { id: 'sindhi', label: 'Sindhi', nativeName: 'سنڌي' },
  { id: 'sanskrit', label: 'Sanskrit', nativeName: 'संस्कृत' },
  { id: 'manipuri', label: 'Manipuri', nativeName: 'মৈতৈলোন্' },
  { id: 'kashmiri', label: 'Kashmiri', nativeName: 'कॉशुर' },
  { id: 'nepali', label: 'Nepali', nativeName: 'नेपाली' },
  { id: 'maithili', label: 'Maithili', nativeName: 'मैथिली' },
  { id: 'santali', label: 'Santali', nativeName: 'ᱥᱟᱱᱛᱟᱲᱤ' },
  { id: 'bodo', label: 'Bodo', nativeName: 'बड़ो' },
  { id: 'dogri', label: 'Dogri', nativeName: 'डोगरी' },
  { id: 'tulu', label: 'Tulu', nativeName: 'ತುಳು' },
  { id: 'rajasthani', label: 'Rajasthani', nativeName: 'राजस्थानी' },
  { id: 'bhojpuri', label: 'Bhojpuri', nativeName: 'भोजपुरी' },
  { id: 'chhattisgarhi', label: 'Chhattisgarhi', nativeName: 'छत्तीसगढ़ी' },
];

export function ChatLearningPage({ user, onLogout, onChatComplete, onVideoGenerated }: ChatLearningPageProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: `Hello ${user.name}! 👋 I'm your AI learning assistant. I can help you learn any topic in your preferred language with engaging video content. What would you like to learn today?`,
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [currentStep, setCurrentStep] = useState<ConversationStep>('initial');
  const [session, setSession] = useState<LearningSession>({ topic: '' });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, currentStep]);

  const addMessage = (role: 'user' | 'assistant', content: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      role,
      content,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, newMessage]);
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage = inputValue.trim();
    addMessage('user', userMessage);
    setInputValue('');

    // Simulate AI response based on current step
    setTimeout(() => {
      if (currentStep === 'initial') {
        setSession({ topic: userMessage });
        addMessage(
          'assistant',
          `Great! Let's explore "${userMessage}". I can help you learn this topic in different ways. Please select which type of content you'd like:`
        );
        setCurrentStep('topic-types');
      }
    }, 500);
  };

  const handleTopicTypeSelect = (typeId: string) => {
    const selectedType = TOPIC_TYPES.find((t) => t.id === typeId);
    if (!selectedType) return;

    addMessage('user', selectedType.label);
    setSession((prev) => ({ ...prev, selectedType: selectedType.label }));

    setTimeout(() => {
      addMessage(
        'assistant',
        `Perfect! Now, which teaching method would you prefer for learning about ${session.topic}?`
      );
      setCurrentStep('teaching-methods');
    }, 500);
  };

  const handleTeachingMethodSelect = (methodId: string) => {
    const selectedMethod = TEACHING_METHODS.find((m) => m.id === methodId);
    if (!selectedMethod) return;

    addMessage('user', selectedMethod.label);
    setSession((prev) => ({ ...prev, selectedMethod: selectedMethod.label }));

    setTimeout(() => {
      addMessage(
        'assistant',
        `Excellent choice! Now, which language would you prefer for learning about ${session.topic}?`
      );
      setCurrentStep('language-selection');
    }, 500);
  };

  const handleLanguageSelect = (languageId: string) => {
    const selectedLang = INDIAN_LANGUAGES.find((l) => l.id === languageId);
    if (!selectedLang) return;

    addMessage('user', selectedLang.label);
    setSession((prev) => ({ ...prev, selectedLanguage: selectedLang.label }));

    setTimeout(() => {
      addMessage(
        'assistant',
        `Excellent choice! I can generate a comprehensive video about ${session.topic} (${session.selectedType}) in ${selectedLang.label}. Would you like me to generate the video?`
      );
      setCurrentStep('video-confirmation');
    }, 500);
  };

  const handleVideoConfirm = (confirmed: boolean) => {
    if (confirmed) {
      addMessage('user', 'YES - Generate Video');
      setCurrentStep('generating-video');

      // Simulate video generation completion after 5 seconds
      setTimeout(() => {
        const mockVideoUrl = 'https://example.com/generated-video.mp4';
        const mockThumbnail = 'https://images.unsplash.com/photo-1516534775068-ba3e7458af70?w=800&q=80';
        const mockTranscript = `Welcome to this comprehensive exploration of ${session.topic}.

In this ${Math.floor((900 + Math.random() * 180) / 60)}-minute video, we will thoroughly examine ${session.selectedType} related to ${session.topic}.

INTRODUCTION (0:00 - 1:00)
Welcome! Today we embark on an educational journey to understand ${session.topic} in depth. This video is designed to provide you with a complete understanding, from foundational concepts to advanced applications.

DEFINITION & CORE CONCEPTS (1:00 - 3:00)
Let's begin by defining ${session.topic}. At its core, ${session.topic} represents a fundamental concept that plays a crucial role in its field. We'll explore its origins, evolution, and why it matters in today's context.

KEY FUNDAMENTALS (3:00 - 6:00)
Now we dive deeper into the essential principles. Understanding these fundamentals is critical for building a strong foundation. We'll examine the theoretical framework, key terminology, and underlying mechanisms that make ${session.topic} work.

VISUAL EXPLANATION (6:00 - 9:00)
Here's where we use visual aids to enhance understanding. Our treemap visualization illustrates the hierarchical relationships and interconnections within ${session.topic}. Notice how different components relate to each other and contribute to the whole.

DETAILED ANALYSIS (9:00 - 12:00)
Let's break down each component systematically. We'll analyze the structure, examine individual elements, and understand how they integrate to form a cohesive system. Pay attention to the relationships and dependencies between different parts.

REAL-WORLD APPLICATIONS (12:00 - 14:00)
Theory meets practice! Discover how ${session.topic} manifests in real-world scenarios. From industry applications to everyday situations, we'll explore concrete examples that demonstrate practical relevance.

EXAMPLES & CASE STUDIES (14:00 - 16:00)
Through detailed case studies, we'll see ${session.topic} in action. These examples provide context and help solidify your understanding by showing practical implementation.

SUMMARY & CONCLUSION (16:00 - ${Math.floor((900 + Math.random() * 180) / 60)}:00)
Let's recap the key points we've covered. Remember the fundamental principles, understand the applications, and appreciate the significance of ${session.topic}. You now have a comprehensive understanding to build upon.

Thank you for watching! Continue your learning journey by exploring related topics and applying these concepts in your own context.`;

        setSession((prev) => ({
          ...prev,
          videoUrl: mockVideoUrl,
          thumbnail: mockThumbnail,
          transcript: mockTranscript,
        }));
        setCurrentStep('video-complete');
        if (onVideoGenerated) {
          onVideoGenerated({
            topic: session.topic,
            type: session.selectedType,
            method: session.selectedMethod,
            language: session.selectedLanguage,
            videoUrl: mockVideoUrl,
            thumbnail: mockThumbnail,
            transcript: mockTranscript,
          });
        }
      }, 5000);
    } else {
      addMessage('user', 'NO - Go Back');
      addMessage('assistant', 'No problem! What else would you like to learn?');
      setCurrentStep('initial');
      setSession({ topic: '' });
    }
  };

  const handleStartNew = () => {
    addMessage('assistant', 'What would you like to learn next?');
    setCurrentStep('initial');
    setSession({ topic: '' });
    if (onChatComplete) {
      onChatComplete(messages);
    }
  };

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Chat Messages Area */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}

          {/* Interactive Components Based on Step */}
          {currentStep === 'topic-types' && (
            <TopicTypeSelector types={TOPIC_TYPES} onSelect={handleTopicTypeSelect} />
          )}

          {currentStep === 'teaching-methods' && (
            <TeachingMethodSelector methods={TEACHING_METHODS} onSelect={handleTeachingMethodSelect} />
          )}

          {currentStep === 'language-selection' && (
            <LanguageSelector languages={INDIAN_LANGUAGES} onSelect={handleLanguageSelect} />
          )}

          {currentStep === 'video-confirmation' && (
            <VideoGenerationConfirm onConfirm={handleVideoConfirm} />
          )}

          {currentStep === 'generating-video' && (
            <VideoGenerationProgress
              topic={session.topic}
              type={session.selectedType || ''}
              method={session.selectedMethod || ''}
              language={session.selectedLanguage || ''}
            />
          )}

          {currentStep === 'video-complete' && (
            <VideoResult
              topic={session.topic}
              type={session.selectedType || ''}
              method={session.selectedMethod || ''}
              language={session.selectedLanguage || ''}
              videoUrl={session.videoUrl || ''}
              thumbnail={session.thumbnail || ''}
              transcript={session.transcript || ''}
              onStartNew={handleStartNew}
            />
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      {(currentStep === 'initial' || currentStep === 'video-complete') && (
        <div className="border-t border-border bg-card px-6 py-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex gap-3">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Enter a topic you want to learn... (e.g., Newton's Laws, Photosynthesis, Machine Learning)"
                className="flex-1 px-4 py-3 border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent outline-none bg-input-background text-foreground placeholder-muted-foreground"
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputValue.trim()}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
              >
                <Send className="w-5 h-5" />
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}