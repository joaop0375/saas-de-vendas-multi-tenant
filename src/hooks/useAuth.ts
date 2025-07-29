import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { User, Company, AuthState } from '../types';

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    company: null,
    isAuthenticated: false
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    const getSession = async () => {
      try {
        console.log('🔍 Checking for existing session...');
        
        // Check for stored demo session
        const storedUser = localStorage.getItem('demo_user_session');
        if (storedUser) {
          try {
            const userData = JSON.parse(storedUser);
            console.log('✅ Found stored demo session for:', userData.name);
            setAuthState({
              user: userData,
              company: userData.companies,
              isAuthenticated: true
            });
            setLoading(false);
            return;
          } catch (error) {
            console.error('Error parsing stored session:', error);
            localStorage.removeItem('demo_user_session');
          }
        }

        console.log('🔍 No demo session found, checking Supabase auth...');
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          console.log('✅ Supabase session found for:', session.user.email);
          await loadUserData(session.user.email!);
        } else {
          console.log('❌ No active session found');
          setLoading(false);
        }
      } catch (error) {
        console.error('Error getting session:', error);
        setLoading(false);
      }
    };

    getSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔄 Auth state changed:', event, session?.user?.email);
        if (session?.user) {
          await loadUserData(session.user.email!);
        } else {
          // Don't clear demo sessions on auth state change
          const storedUser = localStorage.getItem('demo_user_session');
          if (!storedUser) {
            console.log('❌ Clearing auth state');
          setAuthState({
            user: null,
            company: null,
            isAuthenticated: false
          });
          }
        }
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const loadUserData = async (userEmail: string) => {
    try {
      console.log('📊 Loading user data for:', userEmail);
      // Get user data
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select(`
          *,
          companies (*)
        `)
        .eq('email', userEmail.toLowerCase())
        .maybeSingle();

      if (userError) {
        console.error('Database query error:', userError);
        throw userError;
      }

      if (userData) {
        console.log('✅ User data loaded successfully:', userData.name);
        setAuthState({
          user: userData,
          company: userData.companies,
          isAuthenticated: true
        });
      } else {
        console.error('No user data found for email:', userEmail);
        setAuthState({
          user: null,
          company: null,
          isAuthenticated: false
        });
      }
    } catch (error) {
      console.error('Error loading user data:', error);
      setAuthState({
        user: null,
        company: null,
        isAuthenticated: false
      });
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      
      console.log('🔐 Starting login process for:', email);
      
      // For demo accounts, use direct database authentication
      const isDemoAccount = ['joao@empresa.com', 'maria@empresa.com', 'pedro@empresa.com'].includes(email.toLowerCase());
      
      if (isDemoAccount && password === '123456') {
        console.log('🎭 Demo account detected, authenticating directly...');
        
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select(`
            *,
            companies (*)
          `)
          .eq('email', email.toLowerCase())
          .maybeSingle();

        if (userError) {
          console.error('Database query error:', userError);
          setLoading(false);
          return false;
        }

        if (!userData) {
          console.error('Demo user not found in database:', email);
          setLoading(false);
          return false;
        }

        console.log('✅ Demo user found:', userData.name);
        
        // Store demo session in localStorage
        localStorage.setItem('demo_user_session', JSON.stringify(userData));
        
        // Set authentication state
        setAuthState({
          user: userData,
          company: userData.companies,
          isAuthenticated: true
        });
        
        console.log('🎉 Login successful for demo user:', userData.name);
        setLoading(false);
        return true;
      }

      // For other accounts, try Supabase Auth
      console.log('🔐 Trying Supabase Auth for:', email);
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.toLowerCase(),
        password
      });

      if (error) {
        console.error('Supabase auth error:', error.message);
        setLoading(false);
        return false;
      }

      if (data.user) {
        console.log('✅ Supabase auth successful');
        await loadUserData(data.user.email!.toLowerCase());
        setLoading(false);
        return true;
      }

      setLoading(false);
      return false;
    } catch (error) {
      console.error('Login error:', error);
      setLoading(false);
      return false;
    }
  };

  const logout = async () => {
    try {
      console.log('🚪 Logging out...');
      // Clear demo session
      localStorage.removeItem('demo_user_session');
      
      await supabase.auth.signOut();
      setAuthState({
        user: null,
        company: null,
        isAuthenticated: false
      });
      
      console.log('✅ Logout successful');
    } catch (error) {
      console.error('Logout error:', error);
      // Even if logout fails, clear local state
      localStorage.removeItem('demo_user_session');
      setAuthState({
        user: null,
        company: null,
        isAuthenticated: false
      });
    }
  };

  return {
    ...authState,
    loading,
    login,
    logout
  };
};