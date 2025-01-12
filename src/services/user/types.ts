export interface UserProfile {
  id: string;
  displayName: string;
  email: string;
  phone: string;
  farmName: string;
  createdAt: Date;
  updatedAt: Date;
  settings?: {
    theme: 'light' | 'dark';
    notifications: boolean;
  };
}

export interface ProfileUpdateData {
  displayName?: string;
  phone?: string;
  farmName?: string;
  settings?: {
    theme?: 'light' | 'dark';
    notifications?: boolean;
  };
}