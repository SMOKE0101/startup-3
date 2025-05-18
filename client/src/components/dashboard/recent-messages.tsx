import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageCircle, ChevronRight, Users } from "lucide-react";
import { type Message } from "@/lib/types";
import { formatDistanceToNow } from "date-fns";
import { useAuth } from "@/context/auth-context";
import { cn } from "@/lib/utils";

// Array of avatar colors for different senders
const AVATAR_COLORS = [
  "bg-primary-100 text-primary-600",
  "bg-secondary-100 text-secondary-600",
  "bg-amber-100 text-amber-600",
  "bg-emerald-100 text-emerald-600",
  "bg-rose-100 text-rose-600",
  "bg-purple-100 text-purple-600"
];

interface RecentMessagesProps {
  className?: string;
}

export function RecentMessages({ className }: RecentMessagesProps) {
  const { user } = useAuth();

  const { data: messages, isLoading, error } = useQuery<Message[]>({
    queryKey: ["/api/messages", { receiverId: user?.id }],
    enabled: !!user?.id,
  });

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const timeString = date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
    return `${formatDistanceToNow(date, { addSuffix: true })}, ${timeString}`;
  };

  // Get a consistent color for each sender
  const getSenderAvatarColor = (senderId: number) => {
    return AVATAR_COLORS[senderId % AVATAR_COLORS.length];
  };

  return (
    <Card className={className}>
      <CardHeader className="p-6 border-b border-neutral-200">
        <CardTitle className="text-lg font-heading font-semibold text-neutral-900 flex items-center">
          <MessageCircle className="mr-2 h-5 w-5 text-secondary-500" />
          Recent Messages
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-4">
        {isLoading ? (
          <div className="py-2 text-center">
            <p>Loading messages...</p>
          </div>
        ) : error ? (
          <div className="py-2 text-center">
            <p className="text-danger-500">Failed to load messages</p>
          </div>
        ) : messages?.length === 0 ? (
          <div className="py-2 text-center">
            <p>No recent messages found.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages?.slice(0, 3).map((message) => (
              <div 
                key={message.id} 
                className="flex items-start p-2 rounded-lg hover:bg-neutral-50"
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${getSenderAvatarColor(message.senderId)}`}>
                  <span className="text-xs font-medium">
                    {message.senderId > 0 ? `S${message.senderId}` : user?.name?.charAt(0) || "U"}
                  </span>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-neutral-900">Sender {message.senderId}</p>
                  <p className="text-xs text-neutral-500">Property ID: {message.id % 3 + 1}</p>
                  <p className="text-sm text-neutral-700 mt-1">{message.content}</p>
                  <p className="text-xs text-neutral-500 mt-1">{formatTime(message.createdAt)}</p>
                </div>
              </div>
            ))}
            
            <div className="pt-2">
              <Link href="/messages" className="inline-flex items-center text-primary-600 hover:text-primary-700 text-sm font-medium">
                View all messages <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
