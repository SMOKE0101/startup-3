import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { User } from "@shared/schema";

interface UserAvatarProps {
  user: User;
  size?: "sm" | "md" | "lg";
}

export function UserAvatar({ user, size = "md" }: UserAvatarProps) {
  // Function to get initials from the name
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const sizeClasses = {
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-12 h-12 text-base",
  };

  return (
    <div className="flex items-center gap-3">
      <Avatar className={`bg-primary-100 text-primary-600 ${sizeClasses[size]}`}>
        <AvatarFallback className="font-medium">
          {getInitials(user.name)}
        </AvatarFallback>
      </Avatar>
      {size === "md" && (
        <div>
          <h3 className="font-medium text-sm">{user.name}</h3>
          <p className="text-xs text-neutral-500">{user.role}</p>
        </div>
      )}
    </div>
  );
}
