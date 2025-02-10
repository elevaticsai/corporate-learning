import { create } from "zustand";

interface User {
  _id: string;
  username: string;
  email: string;
  role: string;
  company: string;
  isApproved: string;
  isFirstLogin: boolean;
  progress: {
    modules: any[];
  };
}

interface AuthState {
  token: string | null;
  user: User | null;
  isLoading: boolean;
  error: string | null;
  signin: (params: {
    credentials: { email: string; password: string };
    onSuccess: (user: User, token: string) => void;
  }) => Promise<void>;
  signout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user: null,
  isLoading: false,
  error: null,
  signin: async ({ credentials, onSuccess }) => {
    set({ isLoading: true, error: null }); // Start loading
    try {
      const response = await fetch("http://localhost:4000/api/login", {
        method: "POST",
        body: JSON.stringify(credentials),
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        throw new Error("Invalid credentials");
      }

      const data = await response.json();
      // console.log("data is => ",data)
      set({ token: data.token, user: data.user, isLoading: false }); // Store token, user & stop loading

      onSuccess(data.user, data.token);
    } catch (error) {
      // Convert error to string safely
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred";
      set({ isLoading: false, error: errorMessage }); // Stop loading & set error
      console.error("Login failed:", errorMessage);
    }
  },

  signout: () => set({ token: null, user: null, error: null }),
}));
