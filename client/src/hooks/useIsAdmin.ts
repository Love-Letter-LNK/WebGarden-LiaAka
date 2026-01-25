import { useAuth } from "@/context/AuthContext";

/**
 * Simple hook to check if current user is admin
 * Returns { isAdmin, isLoading }
 */
export const useIsAdmin = () => {
  const { isAdmin, isLoading } = useAuth();

  return {
    data: isAdmin,
    isLoading,
    // For compatibility with react-query style usage
    isError: false,
    error: null,
  };
};
