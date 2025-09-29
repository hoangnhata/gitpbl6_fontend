import { useAuth } from "./useAuth";

export const useAdmin = () => {
  const { user } = useAuth();

  const isAdmin = user?.roles?.includes("ADMIN");

  return {
    isAdmin,
    user,
  };
};

