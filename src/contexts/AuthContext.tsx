import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { normalizePhoneNumber } from '@/utils/phoneUtils';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  signUp: (email: string, password: string, fullName: string, phone: string, country: string) => Promise<{ data: { user: User | null; session: Session | null; } | null; error: any }>;
  signIn: (emailOrPhone: string, password: string, isPhone?: boolean) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  verifyOTP: (phone: string, token: string) => Promise<{ error: any }>;
  sendOTP: (phone: string) => Promise<{ error: any }>;
  loading: boolean;
  isTestMode: boolean;
  toggleTestMode: () => void;
  resetPassword: (email: string) => Promise<{ error: any }>;
  connectionError: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isTestMode, setIsTestMode] = useState(import.meta.env.DEV);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  useEffect(() => {
    let retryCount = 0;
    const maxRetries = 3;
    const retryDelay = 1000; // 1 second

    const setupAuth = async () => {
      try {
        // Set up auth state listener first
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          (event, session) => {
            console.log('Auth state changed:', event, session);
            setSession(session);
            setUser(session?.user ?? null);
            setLoading(false);
            setConnectionError(null);
          }
        );

        // Then check for existing session
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          throw error;
        }
        
        console.log('Initial session check:', session);
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
        setConnectionError(null);

        return () => subscription.unsubscribe();
      } catch (error: any) {
        console.error('Auth setup error:', error);
        setConnectionError(error.message || 'Failed to connect to authentication service');
        setLoading(false);

        if (retryCount < maxRetries) {
          retryCount++;
          console.log(`Retrying auth setup (attempt ${retryCount} of ${maxRetries})...`);
          setTimeout(setupAuth, retryDelay);
        }
      }
    };

    setupAuth();
  }, []);

  const signUp = async (email: string, password: string, fullName: string, phone: string, country: string) => {
    try {
      setConnectionError(null);
      const redirectUrl = `${window.location.origin}/`;
      console.log('Signing up with:', { email, fullName, phone, country });
      
      const normalizedPhone = phone ? normalizePhoneNumber(phone, country as any) : undefined;
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            full_name: fullName,
            phone_number: normalizedPhone
          }
        }
      });
      
      if (error) {
        setConnectionError(error.message);
      }
      
      console.log('Signup result:', { data, error });
      return { data, error };
    } catch (error: any) {
      console.error('Signup error:', error);
      setConnectionError(error.message || 'Failed to connect to authentication service');
      return { data: null, error };
    }
  };

  const signIn = async (emailOrPhone: string, password: string, isPhone = false) => {
    try {
      setConnectionError(null);
      console.log('Signing in with:', isPhone ? 'phone' : 'email', emailOrPhone);
      
      if (isPhone) {
        // For phone sign in, first send OTP
        const normalizedPhone = normalizePhoneNumber(emailOrPhone);
        return await sendOTP(normalizedPhone);
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: emailOrPhone,
          password,
        });
        
        if (error) {
          setConnectionError(error.message);
        }
        
        console.log('Signin result:', { error });
        return { error };
      }
    } catch (error: any) {
      console.error('Signin error:', error);
      setConnectionError(error.message || 'Failed to connect to authentication service');
      return { error };
    }
  };

  const sendOTP = async (phone: string) => {
    if (isTestMode) {
      console.log(`[TEST MODE] OTP requested for ${phone}. Use 123456 as OTP.`);
      return { error: null };
    }

    try {
      setConnectionError(null);
      console.log('Sending OTP to:', phone);
      const { data, error } = await supabase.auth.signInWithOtp({
        phone: phone,
        options: {
          shouldCreateUser: true,
          channel: 'sms'
        }
      });
      
      console.log('OTP send response:', { data, error });
      
      if (error) {
        console.error('Send OTP error:', error);
        setConnectionError(error.message || 'Failed to send OTP');
        return { 
          error: {
            message: error.message || 'Failed to send OTP. Please make sure phone authentication is enabled in your Supabase project.'
          }
        };
      }
      
      return { error: null };
    } catch (error: any) {
      console.error('Send OTP catch error:', error);
      setConnectionError(error.message || 'Failed to connect to authentication service');
      return { 
        error: {
          message: 'Failed to send OTP. Please check your phone number and try again.'
        }
      };
    }
  };

  const verifyOTP = async (phone: string, token: string) => {
    if (isTestMode) {
      if (token === '123456') {
        console.log(`[TEST MODE] OTP verified for ${phone}.`);
        return { error: null };
      } else {
        console.log(`[TEST MODE] Invalid OTP for ${phone}.`);
        return { error: { message: 'Invalid OTP (test mode)' } };
      }
    }

    try {
      setConnectionError(null);
      console.log('Verifying OTP for:', phone);
      const { data, error } = await supabase.auth.verifyOtp({
        phone: normalizePhoneNumber(phone),
        token: token,
        type: 'sms'
      });
      
      console.log('OTP verification response:', { data, error });
      
      if (error) {
        console.error('Verify OTP error:', error);
        setConnectionError(error.message || 'Failed to verify OTP');
        return { 
          error: {
            message: error.message || 'Invalid OTP. Please try again.'
          }
        };
      }
      
      return { error: null };
    } catch (error: any) {
      console.error('Verify OTP catch error:', error);
      setConnectionError(error.message || 'Failed to connect to authentication service');
      return { 
        error: {
          message: 'Failed to verify OTP. Please try again.'
        }
      };
    }
  };

  const signOut = async () => {
    try {
      setConnectionError(null);
      console.log('Signing out');
      await supabase.auth.signOut();
    } catch (error: any) {
      console.error('Signout error:', error);
      setConnectionError(error.message || 'Failed to connect to authentication service');
    }
  };

  const toggleTestMode = () => setIsTestMode(prev => !prev);

  const resetPassword = async (email: string) => {
    try {
      setConnectionError(null);
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + '/auth/reset',
      });
      
      if (error) {
        setConnectionError(error.message);
      }
      
      return { error };
    } catch (error: any) {
      console.error('Reset password error:', error);
      setConnectionError(error.message || 'Failed to connect to authentication service');
      return { error };
    }
  };

  const value = {
    user,
    session,
    signUp,
    signIn,
    signOut,
    verifyOTP,
    sendOTP,
    loading,
    isTestMode,
    toggleTestMode,
    resetPassword,
    connectionError
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
