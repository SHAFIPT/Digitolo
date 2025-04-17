import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
// import '../styles/auth.css';
import { useDispatch, useSelector } from 'react-redux';
import { setUser, setIsUserAuthenticated } from '@/store/slice/userSlice';
import toast from 'react-hot-toast';
import { validateLogin } from '@/validator/validate';
import { RootState } from '@/store/store';
import { loginUser } from '@/service/auth';

export default function Login() {
  const router = useRouter();
  const dispatch = useDispatch();
  const isUserAuthenticated = useSelector((state: RootState) => state.user.isUserAuthenticated);
  
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (isUserAuthenticated && token) {
      router.replace('/'); // redirect to home or dashboard
    }
  }, [isUserAuthenticated, router]);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});


  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const validationErrors = validateLogin({ email, password });

    if (validationErrors) {
      setFieldErrors(validationErrors);
      setIsLoading(false);
      return;
    }
    
    try {
      const response = await loginUser(email, password);
      const { accessToken, user } = response.data;

      if (accessToken) {
        localStorage.setItem('accessToken', accessToken);
      }

      // Update Redux store
      dispatch(setUser(user));
      dispatch(setIsUserAuthenticated(true));

      toast.success('Login successful!');
      router.push('/');
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Invalid email or password.');
      toast.error('Login failed!');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-pet-animation">
          <div className="pet-welcome-animation"></div>
          <h2 className="auth-subtitle">Welcome back to your virtual pet!</h2>
        </div>

        <div className="auth-form-container">
          <div className="auth-header">
            <div className="auth-logo">
              <span className="logo-icon">🐾</span>
              <h1>PetPal</h1>
            </div>
            <p className="auth-tagline">Your digital companion awaits!</p>
          </div>

          {error && <div className="auth-error">{error}</div>}

          <form onSubmit={handleLogin} className="auth-form">
            {/* Rest of the form remains the same */}
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <div className="input-wrapper">
                <span className="input-icon">✉️</span>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                />
                {fieldErrors.email && <p className="error-message">{fieldErrors.email}</p>}
              </div>
            </div>

            <div className="form-group">
              <div className="password-header">
                <label htmlFor="password">Password</label>
                <Link href="/forgot-password" className="forgot-password">
                  Forgot Password?
                </Link>
              </div>
              <div className="input-wrapper">
                <span className="input-icon">🔒</span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                />
                <span
                  className="eye-icon"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "🙈" : "👁️"}
                </span>
              </div>
              {fieldErrors.password && <p className="error-message">{fieldErrors.password}</p>}
            </div>

            <button
              type="submit"
              className={`auth-button ${isLoading ? "loading" : ""}`}
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Login"}
            </button>
          </form>

          <div className="auth-footer">
            <p>Don't have an account?</p>
            <Link href="/register" className="auth-link">
              Create Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}