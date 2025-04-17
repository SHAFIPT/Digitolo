import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { registerUser, sendRegistrationOTP, verifyRegistrationOTP, userLogout } from '@/service/auth';
import { useDispatch } from 'react-redux';
import { setIsUserAuthenticated, setUser } from '@/store/slice/userSlice';

type User = {
  _id: string;
  name: string;
  email: string;
  role: string;
  isBlocked: boolean;
  createdAt: string;
  updatedAt: string;
};

export const useAuth = () => {
  const [user, setUsers] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dispatch = useDispatch();
  const [isBrowser, setIsBrowser] = useState(false);
  
  // Set isBrowser to true when component mounts on client
  useEffect(() => {
    setIsBrowser(true);
  }, []);

  const sendOTP = async (email: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await sendRegistrationOTP(email);
      toast.success('OTP sent to your email');
      return response.data;
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to send OTP');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOTP = async (email: string, otp: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await verifyRegistrationOTP(email, otp);
      return response.data;
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Invalid OTP');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await registerUser(email, password, name);
      if (response.status === 201) {
        console.log('This is the response get in frontend ::', response);
        const userDoc = response.data.data.user._doc;
        const user = {
          _id: userDoc._id,
          name: userDoc.name,
          email: userDoc.email,
          role: userDoc.role,
          isBlocked: userDoc.isBlocked,
          createdAt: userDoc.createdAt,
          updatedAt: userDoc.updatedAt,
        };
        setUsers(user);
        dispatch(setUser(user));
        dispatch(setIsUserAuthenticated(true));

        if (response.data.data?.accessToken && isBrowser) {
          localStorage.setItem('accessToken', response.data.data.accessToken);
        }
      }

      return response.data;
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Registration failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      const response = await userLogout();
      setUsers(null); // clear user on logout
      if (isBrowser) {
        toast.success('Logged out successfully');
      }
      return response;
    } catch (error) {
      if (isBrowser) {
        toast.error('Logout failed');
      }
      throw error;
    }
  };

  return {
    sendOTP,
    verifyOTP,
    register,
    logout,
    user,
    isLoading,
    error,
    setError,
    isBrowser,
  };
};