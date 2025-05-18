import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserAvatar } from "@/components/ui/user-avatar";
import { Message } from "@shared/schema";
import { format, formatDistanceToNow } from "date-fns";
import { ChevronRight } from "lucide-react";

interface MessageWidgetProps {
  messages: Message[];
}

export function MessageWidget({ messages }: MessageWidgetProps) {
  // Format message timestamp
  const formatMessageTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const today = new Date();
    
    // If it's today, show time
    if (date.toDateString() === today.toDateString()) {
      return `Today, ${format(date, 'h:mm a')}`;
    }
    
    // If it's yesterday
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    if (date.toDateString() === yesterday.toDateString()) {
      return `Yesterday, ${format(date, 'h:mm a')}`;
    }
    
    // Otherwise show full date
    return format(date, 'MMM d, yyyy, h:mm a');
  };

  return (
    <Card className="bg-white overflow-hidden">
      <CardHeader className="p-6 border-b border-neutral-200">
        <CardTitle className="text-lg font-heading font-semibold text-neutral-900">Recent Messages</CardTitle>
      </CardHeader>
      
      <CardContent className="p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div key={message.id} className="flex items-start p-2 rounded-lg hover:bg-neutral-50">
              <UserAvatar
                user={{
                  id: message.senderId,
                  name: message.senderName,
                  role: message.senderRole
                }}
                size="sm"
              />
              <div className="ml-3">
                <p className="text-sm font-medium text-neutral-900">{message.senderName}</p>
                <p className="text-xs text-neutral-500">{message.propertyName}, Unit {message.unitNumber}</p>
                <p className="text-sm text-neutral-700 mt-1">{message.content}</p>
                <p className="text-xs text-neutral-500 mt-1">{formatMessageTime(message.timestamp)}</p>
              </div>
            </div>
          ))}
          
          <div className="pt-2">
            <a href="#messages" className="inline-flex items-center text-primary-600 hover:text-primary-700 text-sm font-medium">
              View all messages <ChevronRight className="ml-1 h-4 w-4" />
            </a>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
