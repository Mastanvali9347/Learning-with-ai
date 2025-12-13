import { useState, useEffect, useRef } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, SkipBack, SkipForward, Settings } from 'lucide-react';

interface VideoPlayerProps {
  topic: string;
  type: string;
  language: string;
  thumbnail: string;
  duration: number; // in seconds
}

interface Chapter {
  title: string;
  startTime: number;
  endTime: number;
}

export function VideoPlayer({ topic, type, language, thumbnail, duration }: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [showSettings, setShowSettings] = useState(false);
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  // Generate chapters based on content type
  const chapters: Chapter[] = [
    { title: 'Introduction', startTime: 0, endTime: 60 },
    { title: `Definition of ${topic}`, startTime: 60, endTime: 180 },
    { title: 'Key Concepts & Fundamentals', startTime: 180, endTime: 360 },
    { title: 'Visual Explanation with Treemap', startTime: 360, endTime: 540 },
    { title: 'Detailed Breakdown', startTime: 540, endTime: 720 },
    { title: 'Real-world Applications', startTime: 720, endTime: 840 },
    { title: 'Examples & Case Studies', startTime: 840, endTime: 960 },
    { title: 'Summary & Key Takeaways', startTime: 960, endTime: duration },
  ];

  const getCurrentChapter = () => {
    return chapters.find(
      (chapter) => currentTime >= chapter.startTime && currentTime < chapter.endTime
    );
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= duration) {
            setIsPlaying(false);
            return duration;
          }
          return prev + playbackSpeed;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, duration, playbackSpeed]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (newVolume > 0) setIsMuted(false);
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressBarRef.current) return;
    const rect = progressBarRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = clickX / rect.width;
    const newTime = percentage * duration;
    setCurrentTime(newTime);
  };

  const skipBackward = () => {
    setCurrentTime((prev) => Math.max(0, prev - 10));
  };

  const skipForward = () => {
    setCurrentTime((prev) => Math.min(duration, prev + 10));
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleFullscreen = () => {
    if (videoContainerRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        videoContainerRef.current.requestFullscreen();
      }
    }
  };

  const currentChapter = getCurrentChapter();
  const progress = (currentTime / duration) * 100;

  // Generate visual content based on current time
  const getVisualContent = () => {
    const chapterIndex = chapters.findIndex(
      (ch) => currentTime >= ch.startTime && currentTime < ch.endTime
    );

    const visualStyles = [
      'from-blue-500 to-purple-600',
      'from-green-500 to-teal-600',
      'from-orange-500 to-red-600',
      'from-pink-500 to-rose-600',
      'from-indigo-500 to-blue-600',
      'from-yellow-500 to-orange-600',
      'from-purple-500 to-pink-600',
      'from-cyan-500 to-blue-600',
    ];

    return (
      <div className={`absolute inset-0 bg-gradient-to-br ${visualStyles[chapterIndex] || visualStyles[0]} transition-all duration-1000`}>
        <div className="absolute inset-0 flex items-center justify-center p-8">
          <div className="text-center text-white">
            <h2 className="text-4xl mb-6">{topic}</h2>
            <div className="text-6xl mb-6">
              {chapterIndex === 0 && '📚'}
              {chapterIndex === 1 && '📖'}
              {chapterIndex === 2 && '🔍'}
              {chapterIndex === 3 && '🗺️'}
              {chapterIndex === 4 && '📊'}
              {chapterIndex === 5 && '🌍'}
              {chapterIndex === 6 && '💡'}
              {chapterIndex === 7 && '✨'}
            </div>
            <p className="text-2xl opacity-90">{currentChapter?.title}</p>
            <div className="mt-8 max-w-2xl mx-auto">
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-6">
                <p className="text-lg leading-relaxed">
                  {chapterIndex === 0 && `Welcome to this comprehensive video about ${topic}. In the next ${Math.floor(duration / 60)} minutes, we'll explore everything you need to know.`}
                  {chapterIndex === 1 && `Let's start with the fundamental definition. ${topic} is a crucial concept that forms the foundation of our understanding.`}
                  {chapterIndex === 2 && `Now we'll dive into the key concepts and principles that make ${topic} so important in this field.`}
                  {chapterIndex === 3 && `Here's a visual treemap representation showing the relationships and hierarchies within ${topic}.`}
                  {chapterIndex === 4 && `Let's break down each component in detail, examining how they interconnect and influence each other.`}
                  {chapterIndex === 5 && `See how ${topic} applies to real-world scenarios and everyday situations you might encounter.`}
                  {chapterIndex === 6 && `Through these practical examples, you'll understand how to apply ${topic} in various contexts.`}
                  {chapterIndex === 7 && `Let's recap the key points and ensure you have a solid grasp of ${topic}.`}
                </p>
              </div>
            </div>
            
            {/* Subtitles */}
            <div className="absolute bottom-24 left-0 right-0 px-8">
              <div className="bg-black/80 backdrop-blur-sm rounded-lg p-4 max-w-4xl mx-auto">
                <p className="text-xl">
                  {isPlaying ? `Understanding ${currentChapter?.title} - ${type} explained in ${language}` : 'Video Paused'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div
      ref={videoContainerRef}
      className="relative bg-black rounded-xl overflow-hidden group"
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(isPlaying ? false : true)}
    >
      {/* Video Content Area */}
      <div className="relative w-full aspect-video">
        {!isPlaying && currentTime === 0 ? (
          <img
            src={thumbnail}
            alt="Video thumbnail"
            className="w-full h-full object-cover"
          />
        ) : (
          getVisualContent()
        )}

        {/* Play Button Overlay (when paused) */}
        {!isPlaying && (
          <button
            onClick={togglePlay}
            className="absolute inset-0 flex items-center justify-center bg-black/40 hover:bg-black/50 transition-all cursor-pointer"
          >
            <div className="w-24 h-24 bg-white/90 rounded-full flex items-center justify-center hover:scale-110 transition-transform">
              <Play className="w-12 h-12 text-gray-900 ml-2" />
            </div>
          </button>
        )}

        {/* Chapter Indicator */}
        {currentChapter && (
          <div className={`absolute top-4 left-4 bg-black/60 backdrop-blur-sm px-4 py-2 rounded-lg transition-opacity ${showControls ? 'opacity-100' : 'opacity-0'}`}>
            <p className="text-white text-sm">
              📖 {currentChapter.title}
            </p>
          </div>
        )}

        {/* Video Info */}
        <div className={`absolute top-4 right-4 bg-black/60 backdrop-blur-sm px-4 py-2 rounded-lg transition-opacity ${showControls ? 'opacity-100' : 'opacity-0'}`}>
          <p className="text-white text-sm">
            {language} | {playbackSpeed}x
          </p>
        </div>

        {/* Controls */}
        <div className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 transition-opacity ${showControls ? 'opacity-100' : 'opacity-0'}`}>
          {/* Progress Bar */}
          <div className="mb-4">
            <div
              ref={progressBarRef}
              onClick={handleProgressClick}
              className="h-2 bg-white/30 rounded-full cursor-pointer hover:h-3 transition-all relative group"
            >
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full relative"
                style={{ width: `${progress}%` }}
              >
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              
              {/* Chapter Markers */}
              {chapters.map((chapter, index) => (
                <div
                  key={index}
                  className="absolute top-0 h-full w-0.5 bg-white/50"
                  style={{ left: `${(chapter.startTime / duration) * 100}%` }}
                  title={chapter.title}
                />
              ))}
            </div>
            
            {/* Time Display */}
            <div className="flex justify-between text-white text-sm mt-2">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Control Buttons */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Play/Pause */}
              <button
                onClick={togglePlay}
                className="text-white hover:text-blue-400 transition"
              >
                {isPlaying ? (
                  <Pause className="w-8 h-8" />
                ) : (
                  <Play className="w-8 h-8" />
                )}
              </button>

              {/* Skip Backward */}
              <button
                onClick={skipBackward}
                className="text-white hover:text-blue-400 transition"
              >
                <SkipBack className="w-6 h-6" />
              </button>

              {/* Skip Forward */}
              <button
                onClick={skipForward}
                className="text-white hover:text-blue-400 transition"
              >
                <SkipForward className="w-6 h-6" />
              </button>

              {/* Volume */}
              <div className="flex items-center gap-2">
                <button
                  onClick={toggleMute}
                  className="text-white hover:text-blue-400 transition"
                >
                  {isMuted || volume === 0 ? (
                    <VolumeX className="w-6 h-6" />
                  ) : (
                    <Volume2 className="w-6 h-6" />
                  )}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="w-20 h-1 bg-white/30 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full"
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Settings */}
              <div className="relative">
                <button
                  onClick={() => setShowSettings(!showSettings)}
                  className="text-white hover:text-blue-400 transition"
                >
                  <Settings className="w-6 h-6" />
                </button>
                
                {showSettings && (
                  <div className="absolute bottom-full right-0 mb-2 bg-gray-900 rounded-lg p-3 min-w-[150px]">
                    <p className="text-white text-sm mb-2">Playback Speed</p>
                    <div className="space-y-1">
                      {[0.5, 0.75, 1, 1.25, 1.5, 2].map((speed) => (
                        <button
                          key={speed}
                          onClick={() => {
                            setPlaybackSpeed(speed);
                            setShowSettings(false);
                          }}
                          className={`w-full text-left px-3 py-1 rounded text-sm ${
                            playbackSpeed === speed
                              ? 'bg-blue-600 text-white'
                              : 'text-gray-300 hover:bg-gray-800'
                          }`}
                        >
                          {speed}x
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Fullscreen */}
              <button
                onClick={toggleFullscreen}
                className="text-white hover:text-blue-400 transition"
              >
                <Maximize className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
