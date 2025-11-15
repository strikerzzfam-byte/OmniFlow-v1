import { createContext, useContext, useState, ReactNode } from 'react';
import { useAuth } from './AuthContext';

interface AvatarContextType {
  avatarUrl: string;
  setAvatarUrl: (url: string) => void;
}

const AvatarContext = createContext<AvatarContextType | undefined>(undefined);

export const useAvatar = () => {
  const context = useContext(AvatarContext);
  if (!context) {
    throw new Error('useAvatar must be used within an AvatarProvider');
  }
  return context;
};

export const AvatarProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [avatarUrl, setAvatarUrl] = useState(user?.photoURL || '');

  return (
    <AvatarContext.Provider value={{ avatarUrl, setAvatarUrl }}>
      {children}
    </AvatarContext.Provider>
  );
};