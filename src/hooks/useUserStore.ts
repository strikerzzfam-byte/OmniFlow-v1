import { useState, useEffect } from 'react';
import { UserService } from '@/db/modules';
import { useAuth } from '@/contexts/AuthContext';

const userService = new UserService();

export const useUserStore = () => {
  const { user: firebaseUser } = useAuth();
  const [dbUser, setDbUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (firebaseUser?.email) {
      syncUser();
    } else {
      setDbUser(null);
      setLoading(false);
    }
  }, [firebaseUser]);

  const syncUser = async () => {
    if (!firebaseUser?.email) return;
    
    try {
      let user = await userService.getUserByEmail(firebaseUser.email);
      
      if (user.length === 0) {
        const newUser = await userService.createUser({
          email: firebaseUser.email,
          username: firebaseUser.displayName || firebaseUser.email.split('@')[0],
        });
        user = newUser;
      } else {
        await userService.updateLastLogin(user[0].id);
      }
      
      setDbUser(user[0]);
    } catch (error) {
      console.error('User sync error:', error);
    } finally {
      setLoading(false);
    }
  };

  return { dbUser, loading, syncUser };
};