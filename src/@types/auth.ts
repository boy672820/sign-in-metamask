type User = {
  id: number;
  publicAddress: string;
  nonce: string;
};

export type AuthState = {
  isLoading: boolean;
  error: boolean;
  user: User | null;
  isAuthenticated: boolean;
};

export type AuthRequestData = {
  publicAddress: string;
  signature: string;
};