import { create } from "zustand";

interface AuthState {
  token: string | null;
  isLoading: boolean;
  error: string | null;
  signin: (params: {
    credentials: { email: string; password: string };
    onSuccess: (user: any, token: string) => void;
  }) => Promise<void>;
  signout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  isLoading: false,
  error: null,
  signin: async ({ credentials, onSuccess }) => {
    set({ isLoading: true, error: null }); // Start loading
    try {
      const response = await fetch("https://gaussconnect.com/api/login", {
        method: "POST",
        body: JSON.stringify(credentials),
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        throw new Error("Invalid credentials");
      }

      const data = await response.json();
      set({ token: data.token, isLoading: false }); // Store token & stop loading

      onSuccess(data.user, data.token);
    } catch (error) {
      // Convert error to string safely
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred";
      set({ isLoading: false, error: errorMessage }); // Stop loading & set error
      console.error("Login failed:", errorMessage);
    }
  },

  signout: () => set({ token: null, error: null }),
}));
