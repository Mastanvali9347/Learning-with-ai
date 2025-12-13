import { useState, useEffect } from 'react';
import { 
  X, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize, 
  Download, 
  Share2,
  BookOpen,
  GitBranch,
  Sparkles,
  Layers,
  ChevronRight,
  CheckCircle2,
  Circle
} from 'lucide-react';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ScrollArea } from './ui/scroll-area';

interface EnhancedVideoPlayerProps {
  video: {
    id: string;
    topic: string;
    type: string;
    language: string;
    thumbnail: string;
    videoUrl: string;
    duration: string;
  };
  onClose: () => void;
}

interface Chapter {
  id: number;
  title: string;
  timestamp: string;
  duration: number;
  completed: boolean;
}

interface StepExplanation {
  step: number;
  title: string;
  description: string;
  diagram?: string;
}

interface FlowChartNode {
  id: string;
  label: string;
  type: 'start' | 'process' | 'decision' | 'end';
}

export function EnhancedVideoPlayer({ video, onClose }: EnhancedVideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration] = useState(976); // ~16 minutes in seconds
  const [currentChapter, setCurrentChapter] = useState(0);
  const [activeTab, setActiveTab] = useState('overview');

  const chapters: Chapter[] = [
    { id: 1, title: 'Introduction', timestamp: '0:00', duration: 60, completed: true },
    { id: 2, title: 'Core Concepts', timestamp: '1:00', duration: 120, completed: true },
    { id: 3, title: 'Key Fundamentals', timestamp: '3:00', duration: 180, completed: false },
    { id: 4, title: 'Visual Explanation', timestamp: '6:00', duration: 180, completed: false },
    { id: 5, title: 'Detailed Analysis', timestamp: '9:00', duration: 180, completed: false },
    { id: 6, title: 'Real-World Applications', timestamp: '12:00', duration: 120, completed: false },
    { id: 7, title: 'Examples & Case Studies', timestamp: '14:00', duration: 120, completed: false },
    { id: 8, title: 'Summary & Conclusion', timestamp: '16:00', duration: 136, completed: false },
  ];

  const stepByStepExplanations: StepExplanation[] = [
    {
      step: 1,
      title: 'Understanding the Foundation',
      description: `Begin with the fundamental principles of ${video.topic}. This foundational knowledge establishes the framework for deeper understanding.`,
      diagram: 'https://images.unsplash.com/photo-1516534775068-ba3e7458af70?w=400&q=80',
    },
    {
      step: 2,
      title: 'Breaking Down Components',
      description: `Analyze the individual components that make up ${video.topic}. Each element plays a crucial role in the overall system.`,
      diagram: 'https://images.unsplash.com/photo-1509228627152-72ae9ae6848d?w=400&q=80',
    },
    {
      step: 3,
      title: 'Connecting the Dots',
      description: `Understand how different components interact and influence each other. These relationships are key to mastering the concept.`,
      diagram: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&q=80',
    },
    {
      step: 4,
      title: 'Practical Application',
      description: `Learn how to apply ${video.topic} in real-world scenarios. Theory becomes valuable when put into practice.`,
      diagram: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&q=80',
    },
    {
      step: 5,
      title: 'Advanced Concepts',
      description: `Explore advanced aspects and edge cases. This deepens your expertise and prepares you for complex situations.`,
      diagram: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&q=80',
    },
  ];

  const flowChartNodes: FlowChartNode[] = [
    { id: '1', label: 'Start Learning', type: 'start' },
    { id: '2', label: 'Understand Basics', type: 'process' },
    { id: '3', label: 'Concepts Clear?', type: 'decision' },
    { id: '4', label: 'Deep Dive', type: 'process' },
    { id: '5', label: 'Practice Applications', type: 'process' },
    { id: '6', label: 'Master the Topic', type: 'end' },
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime(prev => {
          const next = prev + 1;
          if (next >= duration) {
            setIsPlaying(false);
            return duration;
          }
          return next;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, duration]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleDownload = () => {
    alert('Video download started! This will be implemented with actual video files.');
  };

  const handleShare = () => {
    alert('Share functionality will be implemented with actual sharing options.');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
      <div className="bg-background rounded-lg shadow-2xl w-full max-w-7xl h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex-1 min-w-0">
            <h2 className="text-foreground truncate">{video.topic}</h2>
            <div className="flex gap-2 text-sm text-muted-foreground mt-1">
              <span>{video.type}</span>
              <span>•</span>
              <span>{video.language}</span>
              <span>•</span>
              <span>{video.duration}</span>
            </div>
          </div>
          <div className="flex gap-2 ml-4">
            <Button variant="outline" size="sm" onClick={handleDownload}>
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
            <Button variant="outline" size="sm" onClick={handleShare}>
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Video Player Section */}
          <div className="flex-1 flex flex-col min-w-0">
            {/* Video Area */}
            <div className="relative bg-black aspect-video">
              <img
                src={video.thumbnail}
                alt={video.topic}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              
              {/* Play/Pause Overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="w-20 h-20 rounded-full bg-white/90 hover:bg-white flex items-center justify-center transition-all hover:scale-110"
                >
                  {isPlaying ? (
                    <Pause className="w-10 h-10 text-black" />
                  ) : (
                    <Play className="w-10 h-10 text-black ml-1" />
                  )}
                </button>
              </div>

              {/* Animation Indicator */}
              {isPlaying && (
                <div className="absolute top-4 right-4 flex items-center gap-2 px-3 py-2 bg-purple-600 text-white rounded-full text-sm">
                  <Sparkles className="w-4 h-4 animate-pulse" />
                  AI Animation Active
                </div>
              )}

              {/* Voice Indicator */}
              {isPlaying && (
                <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-full text-sm">
                  <Volume2 className="w-4 h-4 animate-pulse" />
                  Friendly Voice Narration
                </div>
              )}

              {/* Controls */}
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent">
                <Progress value={(currentTime / duration) * 100} className="mb-3" />
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="text-white hover:text-blue-400 transition"
                  >
                    {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                  </button>
                  <button
                    onClick={() => setIsMuted(!isMuted)}
                    className="text-white hover:text-blue-400 transition"
                  >
                    {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                  </button>
                  <div className="flex-1 text-white text-sm">
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </div>
                  <button className="text-white hover:text-blue-400 transition">
                    <Maximize className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Chapter Timeline */}
            <ScrollArea className="border-t border-border">
              <div className="p-4">
                <h3 className="text-foreground mb-3 flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  Chapters
                </h3>
                <div className="space-y-2">
                  {chapters.map((chapter, index) => (
                    <button
                      key={chapter.id}
                      onClick={() => setCurrentChapter(index)}
                      className={`w-full flex items-center gap-3 p-3 rounded-lg transition ${
                        currentChapter === index
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-card hover:bg-accent text-card-foreground'
                      }`}
                    >
                      {chapter.completed ? (
                        <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                      ) : (
                        <Circle className="w-5 h-5 flex-shrink-0" />
                      )}
                      <div className="flex-1 text-left">
                        <div className="text-sm">{chapter.title}</div>
                        <div className="text-xs opacity-70">{chapter.timestamp}</div>
                      </div>
                      <ChevronRight className="w-4 h-4 flex-shrink-0" />
                    </button>
                  ))}
                </div>
              </div>
            </ScrollArea>
          </div>

          {/* Side Panel with Tabs */}
          <div className="w-96 border-l border-border flex flex-col">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
              <TabsList className="grid w-full grid-cols-3 m-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="steps">Steps</TabsTrigger>
                <TabsTrigger value="flow">Flow</TabsTrigger>
              </TabsList>

              <ScrollArea className="flex-1">
                <TabsContent value="overview" className="p-4 space-y-4 m-0">
                  <div>
                    <h3 className="text-foreground mb-2 flex items-center gap-2">
                      <Layers className="w-4 h-4" />
                      Learning Features
                    </h3>
                    <div className="space-y-2">
                      <div className="flex items-center gap-3 p-3 bg-card rounded-lg border border-border">
                        <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                          <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div className="flex-1">
                          <div className="text-sm text-card-foreground">AI Animations</div>
                          <div className="text-xs text-muted-foreground">Dynamic visual learning</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-card rounded-lg border border-border">
                        <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                          <Volume2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div className="flex-1">
                          <div className="text-sm text-card-foreground">Human Voice</div>
                          <div className="text-xs text-muted-foreground">Natural narration</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-card rounded-lg border border-border">
                        <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                          <BookOpen className="w-5 h-5 text-green-600 dark:text-green-400" />
                        </div>
                        <div className="flex-1">
                          <div className="text-sm text-card-foreground">Subtitles</div>
                          <div className="text-xs text-muted-foreground">In {video.language}</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-foreground mb-2">Topic Type</h3>
                    <div className="p-3 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 rounded-lg border border-border">
                      <p className="text-card-foreground">{video.type}</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Comprehensive {video.type.toLowerCase()} with detailed explanations
                      </p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-foreground mb-2">Key Features</h3>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-card-foreground">Interactive diagrams and visualizations</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-card-foreground">Step-by-step explanations</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-card-foreground">Real-world examples and applications</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-card-foreground">Animated treemap visualization</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-card-foreground">Creative storytelling approach</span>
                      </li>
                    </ul>
                  </div>
                </TabsContent>

                <TabsContent value="steps" className="p-4 space-y-4 m-0">
                  <h3 className="text-foreground mb-3">Step-by-Step Guide</h3>
                  {stepByStepExplanations.map((step) => (
                    <div key={step.step} className="bg-card rounded-lg border border-border overflow-hidden">
                      <div className="p-4">
                        <div className="flex items-start gap-3 mb-2">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white flex items-center justify-center flex-shrink-0">
                            {step.step}
                          </div>
                          <div className="flex-1">
                            <h4 className="text-card-foreground mb-1">{step.title}</h4>
                            <p className="text-sm text-muted-foreground">{step.description}</p>
                          </div>
                        </div>
                      </div>
                      {step.diagram && (
                        <div className="border-t border-border">
                          <img
                            src={step.diagram}
                            alt={step.title}
                            className="w-full h-32 object-cover"
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </TabsContent>

                <TabsContent value="flow" className="p-4 space-y-4 m-0">
                  <div>
                    <h3 className="text-foreground mb-3 flex items-center gap-2">
                      <GitBranch className="w-4 h-4" />
                      Learning Flow Chart
                    </h3>
                    <div className="space-y-3">
                      {flowChartNodes.map((node, index) => (
                        <div key={node.id}>
                          <div
                            className={`p-4 rounded-lg border-2 ${
                              node.type === 'start'
                                ? 'bg-green-50 dark:bg-green-950/30 border-green-500'
                                : node.type === 'end'
                                ? 'bg-blue-50 dark:bg-blue-950/30 border-blue-500'
                                : node.type === 'decision'
                                ? 'bg-yellow-50 dark:bg-yellow-950/30 border-yellow-500 transform rotate-45'
                                : 'bg-purple-50 dark:bg-purple-950/30 border-purple-500'
                            }`}
                          >
                            <div className={node.type === 'decision' ? 'transform -rotate-45' : ''}>
                              <p className="text-center text-card-foreground">
                                {node.label}
                              </p>
                            </div>
                          </div>
                          {index < flowChartNodes.length - 1 && (
                            <div className="flex justify-center py-2">
                              <div className="w-0.5 h-8 bg-border" />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 bg-card rounded-lg border border-border">
                    <h4 className="text-card-foreground mb-2">Learning Path</h4>
                    <p className="text-sm text-muted-foreground">
                      Follow this structured approach to master {video.topic}. Each step builds upon the previous one, ensuring comprehensive understanding.
                    </p>
                  </div>
                </TabsContent>
              </ScrollArea>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
