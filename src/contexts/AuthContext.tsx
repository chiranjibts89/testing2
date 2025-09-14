import React, { createContext, useContext, useState, useEffect } from 'react';

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  type: 'student' | 'teacher';
  grade?: string;
  school?: string;
  state?: string;
  subject?: string;
  createdAt: string;
}

interface AuthContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signUp: (userData: Omit<User, 'id' | 'createdAt'>) => Promise<{ success: boolean; message: string }>;
  signIn: (email: string, password: string, userType: 'student' | 'teacher') => Promise<{ success: boolean; message: string }>;
  signOut: () => void;
  updateProfile: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session on app load
    const initializeAuth = () => {
      try {
        const savedUser = localStorage.getItem('prismworlds_current_user');
        const sessionUser = sessionStorage.getItem('prismworlds_session_user');
        
        if (savedUser) {
          const user = JSON.parse(savedUser);
          setCurrentUser(user);
          console.log('🔐 Auth: Restored user session from localStorage:', {
            userId: user.id,
            name: user.name,
            email: user.email,
            type: user.type,
            timestamp: new Date().toISOString()
          });
        } else if (sessionUser) {
          const user = JSON.parse(sessionUser);
          setCurrentUser(user);
          console.log('🔐 Auth: Restored user session from sessionStorage:', {
            userId: user.id,
            name: user.name,
            email: user.email,
            type: user.type,
            timestamp: new Date().toISOString()
          });
        }
      } catch (error) {
        console.error('🔐 Auth Error: Failed to restore user session:', error);
        // Clear corrupted data
        localStorage.removeItem('prismworlds_current_user');
        sessionStorage.removeItem('prismworlds_session_user');
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const signUp = async (userData: Omit<User, 'id' | 'createdAt'>): Promise<{ success: boolean; message: string }> => {
    try {
      console.log('🔐 Auth: Sign up attempt started:', {
        name: userData.name,
        email: userData.email,
        type: userData.type,
        school: userData.school,
        state: userData.state,
        grade: userData.grade,
        subject: userData.subject,
        timestamp: new Date().toISOString()
      });

      // Validate required fields
      if (!userData.name || !userData.email || !userData.password) {
        const errorMsg = 'Name, email, and password are required';
        console.log('🔐 Auth: Sign up validation failed:', errorMsg);
        return { success: false, message: errorMsg };
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(userData.email)) {
        const errorMsg = 'Please enter a valid email address';
        console.log('🔐 Auth: Sign up email validation failed:', errorMsg);
        return { success: false, message: errorMsg };
      }

      // Validate password strength
      if (userData.password.length < 6) {
        const errorMsg = 'Password must be at least 6 characters long';
        console.log('🔐 Auth: Sign up password validation failed:', errorMsg);
        return { success: false, message: errorMsg };
      }

      // Get existing users
      const existingUsers = JSON.parse(localStorage.getItem('prismworlds_users') || '[]');
      
      // Check if user already exists
      const userExists = existingUsers.find((user: User) => 
        user.email.toLowerCase() === userData.email.toLowerCase()
      );
      
      if (userExists) {
        const errorMsg = 'An account with this email already exists';
        console.log('🔐 Auth: Sign up failed - user exists:', {
          email: userData.email,
          timestamp: new Date().toISOString()
        });
        return { success: false, message: errorMsg };
      }

      // Create new user
      const newUser: User = {
        ...userData,
        id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        createdAt: new Date().toISOString()
      };

      // Save to users list
      const updatedUsers = [...existingUsers, newUser];
      localStorage.setItem('prismworlds_users', JSON.stringify(updatedUsers));

      // Set as current user
      setCurrentUser(newUser);
      localStorage.setItem('prismworlds_current_user', JSON.stringify(newUser));
      sessionStorage.setItem('prismworlds_session_user', JSON.stringify(newUser));

      console.log('🔐 Auth: Sign up successful:', {
        userId: newUser.id,
        name: newUser.name,
        email: newUser.email,
        type: newUser.type,
        totalUsers: updatedUsers.length,
        timestamp: new Date().toISOString()
      });

      return { success: true, message: 'Account created successfully!' };

    } catch (error) {
      console.error('🔐 Auth Error: Sign up failed:', error);
      return { success: false, message: 'Failed to create account. Please try again.' };
    }
  };

  const signIn = async (email: string, password: string, userType: 'student' | 'teacher'): Promise<{ success: boolean; message: string }> => {
    try {
      console.log('🔐 Auth: Sign in attempt started:', {
        email,
        userType,
        timestamp: new Date().toISOString()
      });

      // Validate input
      if (!email || !password) {
        const errorMsg = 'Email and password are required';
        console.log('🔐 Auth: Sign in validation failed:', errorMsg);
        return { success: false, message: errorMsg };
      }

      // Get existing users
      const existingUsers = JSON.parse(localStorage.getItem('prismworlds_users') || '[]');
      
      // Find user by email and type
      const user = existingUsers.find((u: User) => 
        u.email.toLowerCase() === email.toLowerCase() && 
        u.type === userType
      );

      if (!user) {
        const errorMsg = `No ${userType} account found with this email`;
        console.log('🔐 Auth: Sign in failed - user not found:', {
          email,
          userType,
          timestamp: new Date().toISOString()
        });
        return { success: false, message: errorMsg };
      }

      // Verify password
      if (user.password !== password) {
        const errorMsg = 'Invalid password';
        console.log('🔐 Auth: Sign in failed - invalid password:', {
          userId: user.id,
          email: user.email,
          timestamp: new Date().toISOString()
        });
        return { success: false, message: errorMsg };
      }

      // Set as current user
      setCurrentUser(user);
      localStorage.setItem('prismworlds_current_user', JSON.stringify(user));
      sessionStorage.setItem('prismworlds_session_user', JSON.stringify(user));

      console.log('🔐 Auth: Sign in successful:', {
        userId: user.id,
        name: user.name,
        email: user.email,
        type: user.type,
        timestamp: new Date().toISOString()
      });

      return { success: true, message: 'Signed in successfully!' };

    } catch (error) {
      console.error('🔐 Auth Error: Sign in failed:', error);
      return { success: false, message: 'Failed to sign in. Please try again.' };
    }
  };

  const signOut = () => {
    try {
      console.log('🔐 Auth: Sign out initiated:', {
        userId: currentUser?.id,
        name: currentUser?.name,
        email: currentUser?.email,
        timestamp: new Date().toISOString()
      });

      setCurrentUser(null);
      localStorage.removeItem('prismworlds_current_user');
      sessionStorage.removeItem('prismworlds_session_user');

      console.log('🔐 Auth: Sign out completed successfully');
    } catch (error) {
      console.error('🔐 Auth Error: Sign out failed:', error);
    }
  };

  const updateProfile = (updates: Partial<User>) => {
    if (!currentUser) return;

    try {
      console.log('🔐 Auth: Profile update initiated:', {
        userId: currentUser.id,
        updates: Object.keys(updates),
        timestamp: new Date().toISOString()
      });

      const updatedUser = { ...currentUser, ...updates };
      
      // Update current user
      setCurrentUser(updatedUser);
      localStorage.setItem('prismworlds_current_user', JSON.stringify(updatedUser));
      sessionStorage.setItem('prismworlds_session_user', JSON.stringify(updatedUser));

      // Update in users list
      const existingUsers = JSON.parse(localStorage.getItem('prismworlds_users') || '[]');
      const updatedUsers = existingUsers.map((user: User) => 
        user.id === currentUser.id ? updatedUser : user
      );
      localStorage.setItem('prismworlds_users', JSON.stringify(updatedUsers));

      console.log('🔐 Auth: Profile update successful:', {
        userId: updatedUser.id,
        name: updatedUser.name,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('🔐 Auth Error: Profile update failed:', error);
    }
  };

  const value: AuthContextType = {
    currentUser,
    isAuthenticated: !!currentUser,
    isLoading,
    signUp,
    signIn,
    signOut,
    updateProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};