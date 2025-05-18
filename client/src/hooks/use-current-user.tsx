import { useQuery } from "@tanstack/react-query";
import { User } from "@shared/schema";

export function useCurrentUser() {
  const { data, isLoading, error } = useQuery<User>({
    queryKey: ["/api/auth/me"],
    retry: false,
  });

  // Default user for development purposes
  const defaultUser: User = {
    id: 1,
    name: "John Doe",
    email: "john.doe@example.com",
    role: "Property Owner",
  };

  // If loading or error, return the default user
  // In a production environment, you'd handle this differently
  const user = data || defaultUser;

  return {
    user,
    isLoading,
    error,
  };
}
