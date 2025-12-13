import { Clock, MessageSquare, Trash2 } from 'lucide-react';

interface ChatHistoryItem {
  id: string;
  topic: string;
  type: string;
  language: string;
  timestamp: Date;
  messageCount: number;
}

interface ChatHistoryProps {
  chats: ChatHistoryItem[];
  onSelectChat: (chatId: string) => void;
  onDeleteChat: (chatId: string) => void;
}

export function ChatHistory({ chats, onSelectChat, onDeleteChat }: ChatHistoryProps) {
  const formatDate = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const groupChatsByDate = () => {
    const groups: { [key: string]: ChatHistoryItem[] } = {
      Today: [],
      Yesterday: [],
      'This Week': [],
      'This Month': [],
      Older: [],
    };

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);
    const monthAgo = new Date(today);
    monthAgo.setMonth(monthAgo.getMonth() - 1);

    chats.forEach((chat) => {
      const chatDate = new Date(chat.timestamp);
      const chatDayStart = new Date(chatDate.getFullYear(), chatDate.getMonth(), chatDate.getDate());

      if (chatDayStart.getTime() === today.getTime()) {
        groups.Today.push(chat);
      } else if (chatDayStart.getTime() === yesterday.getTime()) {
        groups.Yesterday.push(chat);
      } else if (chatDate >= weekAgo) {
        groups['This Week'].push(chat);
      } else if (chatDate >= monthAgo) {
        groups['This Month'].push(chat);
      } else {
        groups.Older.push(chat);
      }
    });

    return groups;
  };

  const groupedChats = groupChatsByDate();

  if (chats.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-20 rounded-full bg-accent flex items-center justify-center mb-4">
          <MessageSquare className="w-10 h-10 text-muted-foreground" />
        </div>
        <h3 className="text-foreground mb-2">No Chat History</h3>
        <p className="text-muted-foreground max-w-md">
          Your conversation history will appear here. Start a new chat to begin learning!
        </p>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto bg-background">
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-foreground mb-2">Your Chats</h1>
          <p className="text-muted-foreground">View and manage your learning conversations</p>
        </div>

        {/* Grouped Chat List */}
        {Object.entries(groupedChats).map(([groupName, groupChats]) => {
          if (groupChats.length === 0) return null;

          return (
            <div key={groupName} className="space-y-3">
              <h3 className="text-muted-foreground px-2">{groupName}</h3>
              <div className="space-y-2">
                {groupChats.map((chat) => (
                  <div
                    key={chat.id}
                    className="bg-card border border-border rounded-lg hover:border-primary transition-colors group"
                  >
                    <button
                      onClick={() => onSelectChat(chat.id)}
                      className="w-full p-4 text-left"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                          <MessageSquare className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-card-foreground mb-1 truncate">{chat.topic}</h3>
                          <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                            <span className="inline-flex items-center gap-1">
                              {chat.type}
                            </span>
                            <span>•</span>
                            <span>{chat.language}</span>
                            <span>•</span>
                            <span className="inline-flex items-center gap-1">
                              <MessageSquare className="w-3 h-3" />
                              {chat.messageCount} messages
                            </span>
                          </div>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground mt-2">
                            <Clock className="w-3 h-3" />
                            {formatDate(chat.timestamp)}
                          </div>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteChat(chat.id);
                          }}
                          className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition opacity-0 group-hover:opacity-100"
                          aria-label="Delete chat"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
