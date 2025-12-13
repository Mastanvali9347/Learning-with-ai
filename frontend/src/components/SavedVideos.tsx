import { Play, Download, Share2, Trash2, Video as VideoIcon } from 'lucide-react';

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

interface SavedVideosProps {
  videos: SavedVideo[];
  onPlayVideo: (videoId: string) => void;
  onDeleteVideo: (videoId: string) => void;
  onDownloadVideo: (videoId: string) => void;
  onShareVideo: (videoId: string) => void;
}

export function SavedVideos({ 
  videos, 
  onPlayVideo, 
  onDeleteVideo, 
  onDownloadVideo, 
  onShareVideo 
}: SavedVideosProps) {
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  if (videos.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-20 rounded-full bg-accent flex items-center justify-center mb-4">
          <VideoIcon className="w-10 h-10 text-muted-foreground" />
        </div>
        <h3 className="text-foreground mb-2">No Saved Videos</h3>
        <p className="text-muted-foreground max-w-md">
          Videos you generate and save will appear here. Create your first learning video to get started!
        </p>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto bg-background">
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-foreground mb-2">Saved Videos</h1>
          <p className="text-muted-foreground">
            Your library of generated learning videos ({videos.length})
          </p>
        </div>

        {/* Video Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((video) => (
            <div
              key={video.id}
              className="bg-card border border-border rounded-lg overflow-hidden hover:border-primary transition-colors group"
            >
              {/* Thumbnail */}
              <div className="relative aspect-video bg-muted">
                <img
                  src={video.thumbnail}
                  alt={video.topic}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button
                    onClick={() => onPlayVideo(video.id)}
                    className="w-16 h-16 rounded-full bg-white text-primary flex items-center justify-center hover:scale-110 transition-transform"
                  >
                    <Play className="w-8 h-8 ml-1" />
                  </button>
                </div>
                <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/80 rounded text-xs text-white">
                  {video.duration}
                </div>
              </div>

              {/* Video Info */}
              <div className="p-4 space-y-3">
                <div>
                  <h3 className="text-card-foreground mb-1 line-clamp-2">{video.topic}</h3>
                  <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                    <span>{video.type}</span>
                    <span>•</span>
                    <span>{video.language}</span>
                  </div>
                  <div className="text-xs text-muted-foreground mt-2">
                    Saved {formatDate(video.savedDate)}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={() => onPlayVideo(video.id)}
                    className="flex-1 px-3 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition text-sm flex items-center justify-center gap-2"
                  >
                    <Play className="w-4 h-4" />
                    Play
                  </button>
                  <button
                    onClick={() => onDownloadVideo(video.id)}
                    className="p-2 border border-border rounded-md hover:bg-accent transition"
                    title="Download"
                  >
                    <Download className="w-4 h-4 text-foreground" />
                  </button>
                  <button
                    onClick={() => onShareVideo(video.id)}
                    className="p-2 border border-border rounded-md hover:bg-accent transition"
                    title="Share"
                  >
                    <Share2 className="w-4 h-4 text-foreground" />
                  </button>
                  <button
                    onClick={() => onDeleteVideo(video.id)}
                    className="p-2 border border-border rounded-md hover:bg-destructive/10 hover:text-destructive transition"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
