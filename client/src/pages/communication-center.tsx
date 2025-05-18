import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/context/auth-context";
import { Sidebar } from "@/components/layout/sidebar";
import { TenantSidebar } from "@/components/tenant/tenant-sidebar";
import { Header } from "@/components/layout/header";
import { TenantHeader } from "@/components/tenant/tenant-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  MessageSquare, 
  Send, 
  Plus, 
  Users, 
  UserPlus,
  Bell,
  Search,
  Calendar,
  Building,
  Home,
  Megaphone,
  Filter,
  FileText,
  MoreVertical,
  Phone,
  Video,
  Image,
  Paperclip,
  ChevronRight,
  ChevronLeft,
  Trash,
  Info,
  Mail,
  UserCircle
} from "lucide-react";
import { format, isToday, isYesterday, subDays } from "date-fns";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { cn } from "@/lib/utils";
import { UserRole } from "@/lib/types";

// Types for communication system
interface User {
  id: number;
  name: string;
  avatar?: string;
  role: UserRole;
  online: boolean;
  lastActive?: string;
}

interface Message {
  id: number;
  senderId: number;
  recipientId?: number;
  groupId?: number;
  content: string;
  timestamp: string;
  isRead: boolean;
  attachments?: Attachment[];
}

interface Attachment {
  id: number;
  type: 'image' | 'document' | 'other';
  name: string;
  url: string;
  size?: number;
}

interface Group {
  id: number;
  name: string;
  type: 'property' | 'community' | 'announcement';
  icon?: string;
  description?: string;
  members: number[];
  createdAt: string;
  lastActivity?: string;
  propertyId?: number;
}

interface ConversationInfo {
  id: number;
  type: 'direct' | 'group';
  name: string;
  avatar?: string;
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount: number;
  online?: boolean;
  members?: User[];
  description?: string;
}

// Form schema for new message
const messageFormSchema = z.object({
  content: z.string().min(1, "Message cannot be empty"),
});

// Form schema for new group
const groupFormSchema = z.object({
  name: z.string().min(3, "Group name must be at least 3 characters"),
  type: z.enum(["property", "community", "announcement"]),
  description: z.string().optional(),
  members: z.array(z.number()).min(1, "Select at least one member"),
});

export default function CommunicationCenter() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("messages");
  const [selectedConversation, setSelectedConversation] = useState<ConversationInfo | null>(null);
  const [messageInput, setMessageInput] = useState("");
  const [conversations, setConversations] = useState<ConversationInfo[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [showNewGroupDialog, setShowNewGroupDialog] = useState(false);
  const [showNewMessageDialog, setShowNewMessageDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  
  // Determine if user is tenant or landlord
  const isTenant = user?.role === UserRole.TENANT;
  const isLandlord = user?.role === UserRole.LANDLORD || user?.role === UserRole.PROPERTY_MANAGER;
  
  // Form for new message
  const messageForm = useForm<z.infer<typeof messageFormSchema>>({
    resolver: zodResolver(messageFormSchema),
    defaultValues: {
      content: "",
    },
  });
  
  // Form for new group
  const groupForm = useForm<z.infer<typeof groupFormSchema>>({
    resolver: zodResolver(groupFormSchema),
    defaultValues: {
      name: "",
      type: "community",
      description: "",
      members: [],
    },
  });

  // Mock data - this would come from API in a real app
  useEffect(() => {
    // Generate mock users
    const mockUsers: User[] = [
      {
        id: 1,
        name: "John Smith",
        role: UserRole.LANDLORD,
        online: true,
        avatar: "https://randomuser.me/api/portraits/men/1.jpg"
      },
      {
        id: 2,
        name: "Sarah Johnson",
        role: UserRole.TENANT,
        online: true,
        avatar: "https://randomuser.me/api/portraits/women/2.jpg"
      },
      {
        id: 3,
        name: "Michael Brown",
        role: UserRole.TENANT,
        online: false,
        lastActive: "2023-05-15T14:30:00",
        avatar: "https://randomuser.me/api/portraits/men/3.jpg"
      },
      {
        id: 4,
        name: "Emily Davis",
        role: UserRole.PROPERTY_MANAGER,
        online: true,
        avatar: "https://randomuser.me/api/portraits/women/4.jpg"
      },
      {
        id: 5,
        name: "David Wilson",
        role: UserRole.TENANT,
        online: false,
        lastActive: "2023-05-16T09:15:00",
        avatar: "https://randomuser.me/api/portraits/men/5.jpg"
      }
    ];
    
    // Generate mock groups
    const mockGroups: Group[] = [
      {
        id: 101,
        name: "Westside Apartments",
        type: "property",
        description: "All residents of Westside Apartments",
        members: [1, 2, 3, 4, 5],
        createdAt: "2023-01-01T00:00:00",
        lastActivity: "2023-05-16T11:30:00",
        propertyId: 1
      },
      {
        id: 102,
        name: "Community Events",
        type: "community",
        description: "Discussions about upcoming community events",
        members: [1, 2, 3, 4, 5],
        createdAt: "2023-02-15T00:00:00",
        lastActivity: "2023-05-15T16:45:00"
      },
      {
        id: 103,
        name: "Important Announcements",
        type: "announcement",
        description: "Official announcements from management",
        members: [1, 2, 3, 4, 5],
        createdAt: "2023-01-10T00:00:00",
        lastActivity: "2023-05-14T10:20:00"
      },
      {
        id: 104,
        name: "Maintenance Updates",
        type: "property",
        description: "Updates about ongoing maintenance work",
        members: [1, 2, 3, 4, 5],
        createdAt: "2023-03-05T00:00:00",
        lastActivity: "2023-05-16T08:15:00",
        propertyId: 1
      }
    ];
    
    // Generate mock messages
    const generateMockMessages = () => {
      const messages: Message[] = [];
      const now = new Date();
      
      // For each group, generate some messages
      mockGroups.forEach(group => {
        const messageCount = 3 + Math.floor(Math.random() * 5); // 3-7 messages per group
        
        for (let i = 0; i < messageCount; i++) {
          const daysAgo = Math.floor(Math.random() * 5);
          const hoursAgo = Math.floor(Math.random() * 24);
          const minutesAgo = Math.floor(Math.random() * 60);
          
          const messageTime = new Date(now);
          messageTime.setDate(messageTime.getDate() - daysAgo);
          messageTime.setHours(messageTime.getHours() - hoursAgo);
          messageTime.setMinutes(messageTime.getMinutes() - minutesAgo);
          
          const senderId = mockUsers[Math.floor(Math.random() * mockUsers.length)].id;
          
          messages.push({
            id: messages.length + 1,
            senderId,
            groupId: group.id,
            content: `This is a message in the ${group.name} group. Message #${i + 1}.`,
            timestamp: messageTime.toISOString(),
            isRead: Math.random() > 0.3 // 70% chance of being read
          });
        }
      });
      
      // Generate direct messages between users
      mockUsers.forEach(sender => {
        mockUsers.forEach(recipient => {
          if (sender.id !== recipient.id) {
            const messageCount = Math.floor(Math.random() * 5); // 0-4 messages between each pair
            
            for (let i = 0; i < messageCount; i++) {
              const daysAgo = Math.floor(Math.random() * 7);
              const hoursAgo = Math.floor(Math.random() * 24);
              const minutesAgo = Math.floor(Math.random() * 60);
              
              const messageTime = new Date(now);
              messageTime.setDate(messageTime.getDate() - daysAgo);
              messageTime.setHours(messageTime.getHours() - hoursAgo);
              messageTime.setMinutes(messageTime.getMinutes() - minutesAgo);
              
              messages.push({
                id: messages.length + 1,
                senderId: sender.id,
                recipientId: recipient.id,
                content: `Hi ${recipient.name}, this is a direct message from ${sender.name}. Message #${i + 1}.`,
                timestamp: messageTime.toISOString(),
                isRead: Math.random() > 0.3 // 70% chance of being read
              });
            }
          }
        });
      });
      
      // Sort by timestamp
      return messages.sort((a, b) => {
        return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
      });
    };
    
    const mockMessages = generateMockMessages();
    
    // Generate conversations from direct messages and groups
    const mockConversations: ConversationInfo[] = [];
    
    // Add direct message conversations
    mockUsers.forEach(otherUser => {
      if (otherUser.id !== user?.id) {
        const directMessages = mockMessages.filter(
          m => (m.senderId === user?.id && m.recipientId === otherUser.id) || 
               (m.senderId === otherUser.id && m.recipientId === user?.id)
        );
        
        if (directMessages.length > 0) {
          const lastMessage = directMessages.sort((a, b) => 
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
          )[0];
          
          const unreadCount = directMessages.filter(
            m => m.senderId === otherUser.id && !m.isRead
          ).length;
          
          mockConversations.push({
            id: otherUser.id,
            type: 'direct',
            name: otherUser.name,
            avatar: otherUser.avatar,
            lastMessage: lastMessage.content,
            lastMessageTime: lastMessage.timestamp,
            unreadCount,
            online: otherUser.online
          });
        }
      }
    });
    
    // Add group conversations
    mockGroups.forEach(group => {
      const groupMessages = mockMessages.filter(m => m.groupId === group.id);
      
      if (groupMessages.length > 0) {
        const lastMessage = groupMessages.sort((a, b) => 
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        )[0];
        
        const unreadCount = groupMessages.filter(
          m => m.senderId !== user?.id && !m.isRead
        ).length;
        
        mockConversations.push({
          id: group.id,
          type: 'group',
          name: group.name,
          lastMessage: lastMessage.content,
          lastMessageTime: lastMessage.timestamp,
          unreadCount,
          description: group.description
        });
      }
    });
    
    // Sort conversations by last message time
    mockConversations.sort((a, b) => {
      if (!a.lastMessageTime) return 1;
      if (!b.lastMessageTime) return -1;
      return new Date(b.lastMessageTime).getTime() - new Date(a.lastMessageTime).getTime();
    });
    
    setUsers(mockUsers);
    setGroups(mockGroups);
    setMessages(mockMessages);
    setConversations(mockConversations);
    
    // Select first conversation by default
    if (mockConversations.length > 0 && !selectedConversation) {
      setSelectedConversation(mockConversations[0]);
    }
  }, [user?.id]);
  
  // Filter conversations by search query
  const filteredConversations = conversations.filter(conversation => {
    return conversation.name.toLowerCase().includes(searchQuery.toLowerCase());
  });
  
  // Get messages for selected conversation
  const getConversationMessages = () => {
    if (!selectedConversation) return [];
    
    if (selectedConversation.type === 'direct') {
      return messages
        .filter(
          m => (m.senderId === user?.id && m.recipientId === selectedConversation.id) || 
               (m.senderId === selectedConversation.id && m.recipientId === user?.id)
        )
        .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    } else {
      return messages
        .filter(m => m.groupId === selectedConversation.id)
        .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    }
  };
  
  const conversationMessages = getConversationMessages();
  
  // Get user by ID
  const getUserById = (id: number) => {
    return users.find(u => u.id === id);
  };
  
  // Get group by ID
  const getGroupById = (id: number) => {
    return groups.find(g => g.id === id);
  };
  
  // Format timestamp
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    
    if (isToday(date)) {
      return format(date, "h:mm a");
    } else if (isYesterday(date)) {
      return "Yesterday";
    } else {
      return format(date, "MMM d");
    }
  };
  
  // Format message time
  const formatMessageTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return format(date, "h:mm a");
  };
  
  // Group messages by date
  const groupMessagesByDate = (messages: Message[]) => {
    const grouped: { [key: string]: Message[] } = {};
    
    messages.forEach(message => {
      const date = new Date(message.timestamp);
      let dateStr: string;
      
      if (isToday(date)) {
        dateStr = "Today";
      } else if (isYesterday(date)) {
        dateStr = "Yesterday";
      } else {
        dateStr = format(date, "MMMM d, yyyy");
      }
      
      if (!grouped[dateStr]) {
        grouped[dateStr] = [];
      }
      
      grouped[dateStr].push(message);
    });
    
    return grouped;
  };
  
  const groupedMessages = groupMessagesByDate(conversationMessages);
  
  // Handle send message
  const handleSendMessage = (values: z.infer<typeof messageFormSchema>) => {
    if (!selectedConversation) return;
    
    // Create new message
    const newMessage: Message = {
      id: messages.length + 1,
      senderId: user?.id || 0,
      content: values.content,
      timestamp: new Date().toISOString(),
      isRead: false
    };
    
    if (selectedConversation.type === 'direct') {
      newMessage.recipientId = selectedConversation.id;
    } else {
      newMessage.groupId = selectedConversation.id;
    }
    
    // Add message to list
    setMessages([...messages, newMessage]);
    
    // Update conversation last message
    const updatedConversations = conversations.map(conv => {
      if (conv.id === selectedConversation.id && conv.type === selectedConversation.type) {
        return {
          ...conv,
          lastMessage: values.content,
          lastMessageTime: newMessage.timestamp,
          unreadCount: 0
        };
      }
      return conv;
    });
    
    setConversations(updatedConversations);
    
    // Reset form
    messageForm.reset();
  };
  
  // Handle create group
  const handleCreateGroup = (values: z.infer<typeof groupFormSchema>) => {
    // Create new group
    const newGroupId = Math.max(...groups.map(g => g.id), 0) + 1;
    
    const newGroup: Group = {
      id: newGroupId,
      name: values.name,
      type: values.type,
      description: values.description,
      members: [...values.members, user?.id || 0], // Include current user
      createdAt: new Date().toISOString()
    };
    
    // Add group to list
    setGroups([...groups, newGroup]);
    
    // Add to conversations
    const newConversation: ConversationInfo = {
      id: newGroupId,
      type: 'group',
      name: values.name,
      description: values.description,
      unreadCount: 0
    };
    
    setConversations([...conversations, newConversation]);
    
    // Reset form and close dialog
    groupForm.reset();
    setShowNewGroupDialog(false);
    
    // Select the new conversation
    setSelectedConversation(newConversation);
  };
  
  // Handle new direct message
  const handleNewDirectMessage = (recipientId: number) => {
    const recipient = getUserById(recipientId);
    if (!recipient) return;
    
    // Check if conversation already exists
    const existingConversation = conversations.find(
      c => c.type === 'direct' && c.id === recipientId
    );
    
    if (existingConversation) {
      setSelectedConversation(existingConversation);
    } else {
      // Create new conversation
      const newConversation: ConversationInfo = {
        id: recipientId,
        type: 'direct',
        name: recipient.name,
        avatar: recipient.avatar,
        unreadCount: 0,
        online: recipient.online
      };
      
      setConversations([...conversations, newConversation]);
      setSelectedConversation(newConversation);
    }
    
    setShowNewMessageDialog(false);
  };
  
  // Get conversation title
  const getConversationTitle = () => {
    if (!selectedConversation) return "";
    
    if (selectedConversation.type === 'direct') {
      const otherUser = getUserById(selectedConversation.id);
      return otherUser?.name || selectedConversation.name;
    } else {
      const group = getGroupById(selectedConversation.id);
      if (group) {
        return group.name;
      }
      return selectedConversation.name;
    }
  };
  
  // Get avatar for a user or group
  const getAvatar = (conversation: ConversationInfo) => {
    if (conversation.type === 'direct') {
      const otherUser = getUserById(conversation.id);
      return otherUser?.avatar;
    } else {
      const group = getGroupById(conversation.id);
      return group?.icon;
    }
  };
  
  // Get conversation subtitle
  const getConversationSubtitle = () => {
    if (!selectedConversation) return "";
    
    if (selectedConversation.type === 'direct') {
      const otherUser = getUserById(selectedConversation.id);
      return otherUser?.online ? "Online" : otherUser?.lastActive ? 
        `Last active ${formatTimestamp(otherUser.lastActive)}` : "Offline";
    } else {
      const group = getGroupById(selectedConversation.id);
      return group?.description || `${group?.members.length || 0} members`;
    }
  };
  
  // Get conversation members
  const getConversationMembers = () => {
    if (!selectedConversation) return [];
    
    if (selectedConversation.type === 'direct') {
      const otherUser = getUserById(selectedConversation.id);
      return otherUser ? [otherUser] : [];
    } else {
      const group = getGroupById(selectedConversation.id);
      if (group) {
        return group.members.map(id => getUserById(id)).filter((u): u is User => !!u);
      }
      return [];
    }
  };
  
  const conversationMembers = getConversationMembers();
  
  return (
    <div className="flex h-screen overflow-hidden">
      <div className="hidden md:block">
        {isTenant ? <TenantSidebar /> : <Sidebar />}
      </div>

      <main className="flex-1 flex flex-col overflow-hidden bg-white">
        {isTenant ? <TenantHeader /> : <Header />}

        <div className="flex-1 flex overflow-hidden">
          {/* Left Sidebar - Conversations List */}
          <div className="w-80 border-r border-neutral-200 flex flex-col">
            <div className="p-4 border-b border-neutral-200">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-neutral-900">Messages</h2>
                <div className="flex gap-2">
                  <Dialog open={showNewMessageDialog} onOpenChange={setShowNewMessageDialog}>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MessageSquare className="h-5 w-5" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>New Message</DialogTitle>
                        <DialogDescription>
                          Select a user to start a new conversation.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="py-4">
                        <div className="mb-4">
                          <Input 
                            placeholder="Search users..." 
                            className="w-full"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                          />
                        </div>
                        <div className="space-y-2 max-h-[300px] overflow-y-auto">
                          {users
                            .filter(u => u.id !== user?.id && u.name.toLowerCase().includes(searchQuery.toLowerCase()))
                            .map(u => (
                              <div 
                                key={u.id}
                                className="flex items-center p-2 rounded-md hover:bg-neutral-100 cursor-pointer"
                                onClick={() => handleNewDirectMessage(u.id)}
                              >
                                <Avatar className="h-10 w-10 mr-3">
                                  {u.avatar ? (
                                    <AvatarImage src={u.avatar} />
                                  ) : (
                                    <AvatarFallback>{u.name.charAt(0)}</AvatarFallback>
                                  )}
                                </Avatar>
                                <div className="flex-1">
                                  <div className="font-medium text-sm">{u.name}</div>
                                  <div className="text-xs text-neutral-500">{u.role}</div>
                                </div>
                                <div className="w-2 h-2 rounded-full bg-neutral-300">
                                  {u.online && <div className="w-2 h-2 rounded-full bg-emerald-500"></div>}
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                  
                  <Dialog open={showNewGroupDialog} onOpenChange={setShowNewGroupDialog}>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <UserPlus className="h-5 w-5" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px]">
                      <DialogHeader>
                        <DialogTitle>Create New Group</DialogTitle>
                        <DialogDescription>
                          Fill out the details to create a new group conversation.
                        </DialogDescription>
                      </DialogHeader>
                      <Form {...groupForm}>
                        <form onSubmit={groupForm.handleSubmit(handleCreateGroup)} className="space-y-4 pt-4">
                          <FormField
                            control={groupForm.control}
                            name="name"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Group Name</FormLabel>
                                <FormControl>
                                  <Input placeholder="e.g. Apartment 301 Residents" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={groupForm.control}
                            name="type"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Group Type</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select type" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="property">Property Group</SelectItem>
                                    <SelectItem value="community">Community Group</SelectItem>
                                    <SelectItem value="announcement">Announcements</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={groupForm.control}
                            name="description"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Description (Optional)</FormLabel>
                                <FormControl>
                                  <Textarea 
                                    placeholder="Add a description for this group"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={groupForm.control}
                            name="members"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Members</FormLabel>
                                <div className="mb-2">
                                  <Input 
                                    placeholder="Search users..." 
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                  />
                                </div>
                                <div className="border rounded-md p-2 max-h-[200px] overflow-y-auto">
                                  {users
                                    .filter(u => u.id !== user?.id && u.name.toLowerCase().includes(searchQuery.toLowerCase()))
                                    .map(u => (
                                      <div 
                                        key={u.id}
                                        className="flex items-center py-2 px-3 hover:bg-neutral-50 rounded-md"
                                      >
                                        <input
                                          type="checkbox"
                                          id={`user-${u.id}`}
                                          value={u.id}
                                          checked={field.value.includes(u.id)}
                                          onChange={(e) => {
                                            const value = Number(e.target.value);
                                            if (e.target.checked) {
                                              field.onChange([...field.value, value]);
                                            } else {
                                              field.onChange(field.value.filter(v => v !== value));
                                            }
                                          }}
                                          className="h-4 w-4 mr-3 rounded"
                                        />
                                        <label htmlFor={`user-${u.id}`} className="flex items-center flex-1 cursor-pointer">
                                          <Avatar className="h-6 w-6 mr-2">
                                            {u.avatar ? (
                                              <AvatarImage src={u.avatar} />
                                            ) : (
                                              <AvatarFallback>{u.name.charAt(0)}</AvatarFallback>
                                            )}
                                          </Avatar>
                                          <span className="text-sm">{u.name}</span>
                                        </label>
                                        <Badge className="text-xs">{u.role}</Badge>
                                      </div>
                                    ))}
                                </div>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <DialogFooter>
                            <Button type="submit">Create Group</Button>
                          </DialogFooter>
                        </form>
                      </Form>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
              
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-400" />
                <Input
                  className="pl-9 bg-neutral-50 border-neutral-200"
                  placeholder="Search messages"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            
            <Tabs defaultValue="all" className="flex-1 flex flex-col">
              <div className="px-2 border-b border-neutral-200">
                <TabsList className="w-full h-10 p-0 bg-transparent">
                  <TabsTrigger value="all" className="flex-1 h-10 rounded-none border-b-2 border-transparent data-[state=active]:border-primary-600 data-[state=active]:shadow-none">
                    All
                  </TabsTrigger>
                  <TabsTrigger value="direct" className="flex-1 h-10 rounded-none border-b-2 border-transparent data-[state=active]:border-primary-600 data-[state=active]:shadow-none">
                    Direct
                  </TabsTrigger>
                  <TabsTrigger value="groups" className="flex-1 h-10 rounded-none border-b-2 border-transparent data-[state=active]:border-primary-600 data-[state=active]:shadow-none">
                    Groups
                  </TabsTrigger>
                </TabsList>
              </div>
              
              <TabsContent value="all" className="flex-1 overflow-y-auto p-0 m-0">
                <ScrollArea className="h-full">
                  <div className="p-2 space-y-1">
                    {filteredConversations.map(conversation => (
                      <div
                        key={`${conversation.type}-${conversation.id}`}
                        className={cn(
                          "p-2 rounded-md cursor-pointer",
                          selectedConversation?.id === conversation.id && selectedConversation?.type === conversation.type
                            ? "bg-primary-50"
                            : "hover:bg-neutral-50"
                        )}
                        onClick={() => setSelectedConversation(conversation)}
                      >
                        <div className="flex items-center">
                          <div className="relative">
                            <Avatar className="h-10 w-10 mr-3">
                              {conversation.avatar || conversation.type === 'group' ? (
                                <AvatarImage src={conversation.avatar || "https://ui-avatars.com/api/?name=" + encodeURIComponent(conversation.name)} />
                              ) : (
                                <AvatarFallback>
                                  {conversation.type === 'direct' ? 
                                    conversation.name.charAt(0) : 
                                    conversation.name.split(' ').map(n => n[0]).join('')}
                                </AvatarFallback>
                              )}
                            </Avatar>
                            {conversation.type === 'direct' && conversation.online && (
                              <span className="absolute bottom-0 right-2 h-3 w-3 rounded-full bg-emerald-500 border-2 border-white"></span>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-center">
                              <p className="font-medium text-sm truncate">{conversation.name}</p>
                              {conversation.lastMessageTime && (
                                <span className="text-xs text-neutral-500">
                                  {formatTimestamp(conversation.lastMessageTime)}
                                </span>
                              )}
                            </div>
                            <div className="flex justify-between items-center">
                              <p className="text-xs text-neutral-500 truncate">
                                {conversation.lastMessage || "No messages yet"}
                              </p>
                              {conversation.unreadCount > 0 && (
                                <span className="ml-2 bg-primary-600 text-white text-xs px-2 py-0.5 rounded-full">
                                  {conversation.unreadCount}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </TabsContent>
              
              <TabsContent value="direct" className="flex-1 overflow-y-auto p-0 m-0">
                <ScrollArea className="h-full">
                  <div className="p-2 space-y-1">
                    {filteredConversations
                      .filter(conversation => conversation.type === 'direct')
                      .map(conversation => (
                        <div
                          key={`direct-${conversation.id}`}
                          className={cn(
                            "p-2 rounded-md cursor-pointer",
                            selectedConversation?.id === conversation.id && selectedConversation?.type === conversation.type
                              ? "bg-primary-50"
                              : "hover:bg-neutral-50"
                          )}
                          onClick={() => setSelectedConversation(conversation)}
                        >
                          <div className="flex items-center">
                            <div className="relative">
                              <Avatar className="h-10 w-10 mr-3">
                                {conversation.avatar ? (
                                  <AvatarImage src={conversation.avatar} />
                                ) : (
                                  <AvatarFallback>{conversation.name.charAt(0)}</AvatarFallback>
                                )}
                              </Avatar>
                              {conversation.online && (
                                <span className="absolute bottom-0 right-2 h-3 w-3 rounded-full bg-emerald-500 border-2 border-white"></span>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex justify-between items-center">
                                <p className="font-medium text-sm truncate">{conversation.name}</p>
                                {conversation.lastMessageTime && (
                                  <span className="text-xs text-neutral-500">
                                    {formatTimestamp(conversation.lastMessageTime)}
                                  </span>
                                )}
                              </div>
                              <div className="flex justify-between items-center">
                                <p className="text-xs text-neutral-500 truncate">
                                  {conversation.lastMessage || "No messages yet"}
                                </p>
                                {conversation.unreadCount > 0 && (
                                  <span className="ml-2 bg-primary-600 text-white text-xs px-2 py-0.5 rounded-full">
                                    {conversation.unreadCount}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </ScrollArea>
              </TabsContent>
              
              <TabsContent value="groups" className="flex-1 overflow-y-auto p-0 m-0">
                <ScrollArea className="h-full">
                  <div className="p-2 space-y-1">
                    {filteredConversations
                      .filter(conversation => conversation.type === 'group')
                      .map(conversation => {
                        const group = getGroupById(conversation.id);
                        
                        return (
                          <div
                            key={`group-${conversation.id}`}
                            className={cn(
                              "p-2 rounded-md cursor-pointer",
                              selectedConversation?.id === conversation.id && selectedConversation?.type === conversation.type
                                ? "bg-primary-50"
                                : "hover:bg-neutral-50"
                            )}
                            onClick={() => setSelectedConversation(conversation)}
                          >
                            <div className="flex items-center">
                              <div className="h-10 w-10 mr-3 rounded-md bg-primary-100 flex items-center justify-center">
                                {group?.type === 'announcement' ? (
                                  <Megaphone className="h-5 w-5 text-primary-600" />
                                ) : group?.type === 'property' ? (
                                  <Building className="h-5 w-5 text-primary-600" />
                                ) : (
                                  <Users className="h-5 w-5 text-primary-600" />
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-center">
                                  <p className="font-medium text-sm truncate">{conversation.name}</p>
                                  {conversation.lastMessageTime && (
                                    <span className="text-xs text-neutral-500">
                                      {formatTimestamp(conversation.lastMessageTime)}
                                    </span>
                                  )}
                                </div>
                                <div className="flex justify-between items-center">
                                  <p className="text-xs text-neutral-500 truncate">
                                    {conversation.lastMessage || "No messages yet"}
                                  </p>
                                  {conversation.unreadCount > 0 && (
                                    <span className="ml-2 bg-primary-600 text-white text-xs px-2 py-0.5 rounded-full">
                                      {conversation.unreadCount}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </div>
          
          {/* Main Content - Messages */}
          <div className={cn(
            "flex-1 flex flex-col transition-all duration-300",
            isDetailsOpen ? "mr-72" : ""
          )}>
            {selectedConversation ? (
              <>
                {/* Conversation Header */}
                <div className="border-b border-neutral-200 p-4 flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="relative">
                      <Avatar className="h-10 w-10 mr-3">
                        {selectedConversation.type === 'direct' ? (
                          selectedConversation.avatar ? (
                            <AvatarImage src={selectedConversation.avatar} />
                          ) : (
                            <AvatarFallback>{selectedConversation.name.charAt(0)}</AvatarFallback>
                          )
                        ) : (
                          <AvatarFallback className="bg-primary-100 text-primary-600">
                            {selectedConversation.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        )}
                      </Avatar>
                      {selectedConversation.type === 'direct' && selectedConversation.online && (
                        <span className="absolute bottom-0 right-2 h-3 w-3 rounded-full bg-emerald-500 border-2 border-white"></span>
                      )}
                    </div>
                    <div>
                      <h3 className="font-medium text-md">{getConversationTitle()}</h3>
                      <p className="text-xs text-neutral-500">{getConversationSubtitle()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {selectedConversation.type === 'direct' && (
                      <>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Phone className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Video className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8"
                      onClick={() => setIsDetailsOpen(!isDetailsOpen)}
                    >
                      <Info className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                {/* Messages */}
                <ScrollArea className="flex-1">
                  <div className="p-4 space-y-6">
                    {Object.entries(groupedMessages).map(([date, messages]) => (
                      <div key={date}>
                        <div className="relative flex items-center py-2">
                          <div className="flex-grow border-t border-neutral-200"></div>
                          <span className="flex-shrink mx-4 text-xs text-neutral-500">{date}</span>
                          <div className="flex-grow border-t border-neutral-200"></div>
                        </div>
                        
                        <div className="space-y-4">
                          {messages.map(message => {
                            const sender = getUserById(message.senderId);
                            const isCurrentUser = message.senderId === user?.id;
                            
                            return (
                              <div 
                                key={message.id} 
                                className={cn("flex", isCurrentUser ? "justify-end" : "justify-start")}
                              >
                                <div className="flex max-w-[70%]">
                                  {!isCurrentUser && (
                                    <Avatar className="h-8 w-8 mr-2 mt-1">
                                      {sender?.avatar ? (
                                        <AvatarImage src={sender.avatar} />
                                      ) : (
                                        <AvatarFallback>{sender?.name.charAt(0) || '?'}</AvatarFallback>
                                      )}
                                    </Avatar>
                                  )}
                                  
                                  <div>
                                    {!isCurrentUser && (
                                      <p className="text-xs text-neutral-500 mb-1">
                                        {sender?.name || "Unknown User"}
                                      </p>
                                    )}
                                    
                                    <div className={cn(
                                      "p-3 rounded-lg inline-block",
                                      isCurrentUser 
                                        ? "bg-primary-600 text-white rounded-tr-none" 
                                        : "bg-neutral-100 text-neutral-900 rounded-tl-none"
                                    )}>
                                      <p className="text-sm">{message.content}</p>
                                    </div>
                                    
                                    <p className="text-xs text-neutral-500 mt-1">
                                      {formatMessageTime(message.timestamp)}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                    
                    {conversationMessages.length === 0 && (
                      <div className="flex flex-col items-center justify-center py-12">
                        <MessageSquare className="h-12 w-12 text-neutral-300 mb-4" />
                        <p className="text-neutral-500">No messages yet</p>
                        <p className="text-sm text-neutral-400 mt-1">Send a message to start the conversation</p>
                      </div>
                    )}
                  </div>
                </ScrollArea>
                
                {/* Message Input */}
                <div className="p-4 border-t border-neutral-200">
                  <Form {...messageForm}>
                    <form 
                      onSubmit={messageForm.handleSubmit(handleSendMessage)} 
                      className="flex items-center gap-2"
                    >
                      <Button type="button" variant="ghost" size="icon" className="h-9 w-9">
                        <Paperclip className="h-5 w-5 text-neutral-500" />
                      </Button>
                      <Button type="button" variant="ghost" size="icon" className="h-9 w-9">
                        <Image className="h-5 w-5 text-neutral-500" />
                      </Button>
                      
                      <FormField
                        control={messageForm.control}
                        name="content"
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormControl>
                              <Input 
                                placeholder="Type a message..." 
                                className="border-neutral-200"
                                {...field}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      
                      <Button type="submit" size="icon" className="h-9 w-9">
                        <Send className="h-5 w-5" />
                      </Button>
                    </form>
                  </Form>
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-8">
                <MessageSquare className="h-16 w-16 text-neutral-300 mb-6" />
                <h3 className="text-xl font-medium text-neutral-900 mb-2">No Conversation Selected</h3>
                <p className="text-neutral-500 text-center max-w-md mb-6">
                  Select a conversation from the sidebar or start a new one to begin messaging.
                </p>
                <div className="flex gap-4">
                  <Button 
                    variant="outline" 
                    onClick={() => setShowNewMessageDialog(true)}
                    className="gap-2"
                  >
                    <MessageSquare className="h-4 w-4" />
                    <span>New Message</span>
                  </Button>
                  <Button 
                    onClick={() => setShowNewGroupDialog(true)}
                    className="gap-2"
                  >
                    <UserPlus className="h-4 w-4" />
                    <span>Create Group</span>
                  </Button>
                </div>
              </div>
            )}
          </div>
          
          {/* Right Sidebar - Conversation Details */}
          {isDetailsOpen && selectedConversation && (
            <div className="w-72 border-l border-neutral-200 flex flex-col">
              <div className="p-4 border-b border-neutral-200 flex justify-between items-center">
                <h3 className="font-medium">Details</h3>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8"
                  onClick={() => setIsDetailsOpen(false)}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
              
              <ScrollArea className="flex-1">
                <div className="p-4">
                  <div className="flex flex-col items-center mb-6">
                    <Avatar className="h-20 w-20 mb-4">
                      {selectedConversation.type === 'direct' ? (
                        selectedConversation.avatar ? (
                          <AvatarImage src={selectedConversation.avatar} />
                        ) : (
                          <AvatarFallback className="text-lg">{selectedConversation.name.charAt(0)}</AvatarFallback>
                        )
                      ) : (
                        <AvatarFallback className="bg-primary-100 text-primary-600 text-lg">
                          {selectedConversation.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <h3 className="font-medium">{getConversationTitle()}</h3>
                    <p className="text-sm text-neutral-500 mt-1">{getConversationSubtitle()}</p>
                    
                    {selectedConversation.type === 'direct' && (
                      <div className="flex gap-2 mt-4">
                        <Button variant="outline" size="sm" className="gap-1">
                          <Mail className="h-4 w-4" />
                          <span>Email</span>
                        </Button>
                        <Button variant="outline" size="sm" className="gap-1">
                          <Phone className="h-4 w-4" />
                          <span>Call</span>
                        </Button>
                      </div>
                    )}
                  </div>
                  
                  {selectedConversation.type === 'group' && (
                    <>
                      <div className="mb-6">
                        <h4 className="text-sm font-medium mb-2">About</h4>
                        <p className="text-sm text-neutral-600">
                          {selectedConversation.description || "No description available."}
                        </p>
                      </div>
                      
                      <div className="mb-6">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="text-sm font-medium">Members ({conversationMembers.length})</h4>
                          {isLandlord && (
                            <Button variant="ghost" size="sm" className="h-7 px-2 text-xs">
                              <UserPlus className="h-3 w-3 mr-1" />
                              <span>Add</span>
                            </Button>
                          )}
                        </div>
                        
                        <div className="space-y-2">
                          {conversationMembers.map(member => (
                            <div key={member.id} className="flex items-center p-2 rounded-md hover:bg-neutral-50">
                              <Avatar className="h-8 w-8 mr-2">
                                {member.avatar ? (
                                  <AvatarImage src={member.avatar} />
                                ) : (
                                  <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                                )}
                              </Avatar>
                              <div className="flex-1">
                                <p className="text-sm font-medium">{member.name}</p>
                                <p className="text-xs text-neutral-500">{member.role}</p>
                              </div>
                              <div className="w-2 h-2 rounded-full">
                                {member.online && <div className="w-2 h-2 rounded-full bg-emerald-500"></div>}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                  
                  {selectedConversation.type === 'direct' && (
                    <div className="mb-6">
                      <h4 className="text-sm font-medium mb-2">Contact Info</h4>
                      <div className="space-y-3">
                        <div className="flex items-center">
                          <UserCircle className="h-4 w-4 text-neutral-500 mr-2" />
                          <p className="text-sm">{getUserById(selectedConversation.id)?.role || "Unknown"}</p>
                        </div>
                        <div className="flex items-center">
                          <Mail className="h-4 w-4 text-neutral-500 mr-2" />
                          <p className="text-sm">user@example.com</p>
                        </div>
                        <div className="flex items-center">
                          <Phone className="h-4 w-4 text-neutral-500 mr-2" />
                          <p className="text-sm">(123) 456-7890</p>
                        </div>
                        <div className="flex items-center">
                          <Home className="h-4 w-4 text-neutral-500 mr-2" />
                          <p className="text-sm">Unit 304, Westside Apartments</p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div className="pt-4 border-t border-neutral-100">
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start text-rose-600 hover:text-rose-700 hover:bg-rose-50"
                    >
                      <Trash className="h-4 w-4 mr-2" />
                      <span>{selectedConversation.type === 'direct' ? "Delete Conversation" : "Leave Group"}</span>
                    </Button>
                  </div>
                </div>
              </ScrollArea>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}