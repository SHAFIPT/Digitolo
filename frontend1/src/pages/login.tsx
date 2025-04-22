import { useEffect, useState } from 'react';
import '../styles/auth.css';
import { useDispatch, useSelector } from 'react-redux';
import { setUser, setIsUserAuthenticated } from '../store/slice/userSlice';
import toast from 'react-hot-toast';
import { validateLogin } from '../validator/validate';
import { RootState } from '../store/store';
import { loginUser } from '../service/auth';
import { Link, useNavigate } from 'react-router-dom';
import { AxiosError } from 'axios';

export default function Login() {

  const dispatch = useDispatch();
  const isUserAuthenticated = useSelector((state: RootState) => state.user.isUserAuthenticated);
   const navigate = useNavigate();
  
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (isUserAuthenticated && token) {
      // Redirect to homepage if user is authenticated and token exists
      navigate('/');  // Navigates to the homepage
    }
  }, [isUserAuthenticated, navigate]); 
  
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
      navigate('/')
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        setError(err.response?.data?.message || 'Invalid email or password.');
      } else {
        setError('An unexpected error occurred.');
      }
      toast.error('Login failed!');
    } finally {
      setIsLoading(false);
    }
  }

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
            <Link to='/register' className="auth-link">
              Create Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}