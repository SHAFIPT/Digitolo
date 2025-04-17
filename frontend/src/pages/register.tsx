  import { useEffect, useState } from 'react';
  import Link from 'next/link';
  import { useRouter } from 'next/router';
  // import '../styles/auth.css';
  // import '../styles/loading.css';
  import { useAuth } from '@/hooks/useAuth';
  import toast from 'react-hot-toast';
  import { createPet } from '@/service/petService';
import { ValidateRegister } from '@/validator/validate';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';

  export default function Register() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      otp: '',
    });
    const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});
    const [selectedPet, setSelectedPet] = useState(0);
    const [isLoadings, setIsLoading] = useState(false);
    const [petName, setPetName] = useState('');
    const [showPassword, setShowPassword] = useState(false); // State for password visibility
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isClient, setIsClient] = useState(false);

    const isUserAuthenticated = useSelector((state: RootState) => state.user.isUserAuthenticated);
    useEffect(() => {
    setIsClient(true);
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('accessToken');
      if (isUserAuthenticated && token) {
        router.replace('/');
      }
    }
  }, [isUserAuthenticated, router]);
    
    const pets = [
      { id: 1, name: 'Cat', icon: '🐱' },
  ];
      
      const { sendOTP, verifyOTP, register, isLoading, error, setError } = useAuth();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFormData({
        ...formData,
        [name]: value
      });
    };

    const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); // still useful for field-level errors

    if (step === 1) {
      if (formData.password !== formData.confirmPassword) {
        toast.error('Passwords do not match');
        return;
      }
      try {
        await sendOTP(formData.email);
        toast.success('OTP sent successfully!');
        setStep(2);
      } catch (err: any) {
        toast.error(err?.response?.data?.message || 'Failed to send OTP');
      }
    } else if (step === 2) {
      try {
        await verifyOTP(formData.email, formData.otp);
        toast.success('OTP verified!');
        setStep(3);
      } catch (err: any) {
        toast.error(err?.response?.data?.message || 'Invalid OTP');
      }
    } else if (step === 3) {
    if (!petName.trim()) {
      toast.error('Please give your pet a name');
      return;
    }

     const validationErrors = ValidateRegister({
        email: formData.email,
        password: formData.password,
        name: formData.name,
      });

      if (validationErrors) {
        setFieldErrors(validationErrors);
        setIsLoading(false);
        return;
      }

    try {
      // Step 1: Register the user
      const registerResponse = await register(formData.email, formData.password, formData.name);
      toast.success('Registration complete!');

      const userId = registerResponse.data.user._doc._id;  // ✅ extract user ID
      // Step 2: Prepare pet data with userId
      const petData = {
        name: petName,
        petId: pets[selectedPet].id.toString(),
        userId: userId, // ✅ send to backend
      };

      // Call the createPet function
      const data = await createPet(petData);
      console.log('This is the data get in createPet ::', data);

      if (data) {
        toast.success('Pet created successfully!');
        await router.push('/');
      }
    } catch (err: any) {
      toast.error(err?.message || 'Registration failed');
    }
  }
  };

    const resendOTP = async () => {
    try {
      await sendOTP(formData.email);
      toast.success('OTP resent!');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to resend OTP');
    }
  };
    const nextPet = () => {
      setSelectedPet((prev) => (prev + 1) % pets.length);
    };

    const prevPet = () => {
      setSelectedPet((prev) => (prev - 1 + pets.length) % pets.length);
    };

    return (
      <div className="auth-page">
        <div className="auth-container">
          
         {(isLoading || isLoadings) && (
            <div className="loader-container">
              <div className="loader"></div>
            </div>
          )}
                
          <div className="auth-pet-animation">
            <div className="pet-welcome-animation"></div>
            <h2 className="auth-subtitle">Join the pet adventure!</h2>
          </div>
          
          <div className="auth-form-container">
            <div className="auth-header">
              <div className="auth-logo">
                <span className="logo-icon">🐾</span>
                <h1>PetPal</h1>
              </div>
              <p className="auth-tagline">Create your account</p>
            </div>

            {error && <div className="auth-error">{error}</div>}
            
            <div className="step-indicator">
              <div className={`step ${step >= 1 ? 'active' : ''}`}>1</div>
              <div className="step-line"></div>
              <div className={`step ${step >= 2 ? 'active' : ''}`}>2</div>
              <div className="step-line"></div>
              <div className={`step ${step >= 3 ? 'active' : ''}`}>3</div>
            </div>
            
            <form onSubmit={handleSubmit} className="auth-form">
              {step === 1 && (
                <>
                  <div className="form-group">
                    <label htmlFor="name">Full Name</label>
                    <div className="input-wrapper">
                      <span className="input-icon">👤</span>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Enter your name"
                        required
                      />
                      {fieldErrors.name && <p className="error-message">{fieldErrors.name}</p>}
                    </div>
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <div className="input-wrapper">
                      <span className="input-icon">✉️</span>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="your@email.com"
                        required
                      />
                      {fieldErrors.email && <p className="error-message">{fieldErrors.email}</p>}
                    </div>
                  </div>
                  
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <div className="input-wrapper">
                      <span className="input-icon">🔒</span>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        placeholder="Create a strong password"
                        required
                      />
                      <span 
                        className="eye-icon" 
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? '🙈' : '👁️'}
                      </span>
                    </div>
                    {fieldErrors.password && <p className="error-message">{fieldErrors.password}</p>}
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="confirmPassword">Confirm Password</label>
                    <div className="input-wrapper">
                      <span className="input-icon">🔒</span>
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        id="confirmPassword"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        placeholder="Confirm your password"
                        required
                      />
                      <span 
                        className="eye-icon" 
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? '🙈' : '👁️'}
                      </span>
                    </div>
                  </div>
                </>
              )}
              
              {step === 2 && (
                <div className="otp-container">
                  <h3 className="otp-title">Verify Your Email</h3>
                  <p className="otp-subtitle">We've sent a verification code to {formData.email}</p>
                  
                  <div className="form-group">
                    <label htmlFor="otp">Enter Verification Code</label>
                    <div className="input-wrapper">
                      <span className="input-icon">🔢</span>
                      <input
                        type="text"
                        id="otp"
                        name="otp"
                        value={formData.otp}
                        onChange={handleInputChange}
                        placeholder="Enter 6-digit code"
                        required
                      />
                    </div>
                  </div>
                  
                  <button 
                    type="button" 
                    className="resend-otp" 
                    onClick={resendOTP}
                    disabled={isLoading}
                  >
                    Resend Code
                  </button>
                </div>
              )}
              
              {step === 3 && (
                <div className="pet-selection-container">
                  <h3 className="pet-selection-title">Choose Your Pet</h3>
                  <p className="pet-selection-subtitle">Select a pet to be your digital companion</p>
                  
                  <div className="pet-carousel">
                    <button type="button" className="carousel-button prev" onClick={prevPet}>
                      ◀
                    </button>
                    
                    <div className="pet-display">
                      <div className="pet-icon">{pets[selectedPet].icon}</div>
                      <div className="pet-name">{pets[selectedPet].name}</div>
                    </div>
                    
                    <button type="button" className="carousel-button next" onClick={nextPet}>
                      ▶
                    </button>
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="petName">Give your pet a name</label>
                    <div className="input-wrapper">
                      <span className="input-icon">🏷️</span>
                      <input
                        type="text"
                        id="petName"
                        value={petName}
                        onChange={(e) => setPetName(e.target.value)}
                        placeholder="Name your pet"
                        required
                      />
                    </div>
                  </div>
                </div>
              )}
              
              <button 
                type="submit" 
                className={`auth-button ${isLoading ? 'loading' : ''}`}
                disabled={isLoading}
              >
                {isLoading 
                  ? 'Processing...' 
                  : step === 1 
                    ? 'Continue' 
                    : step === 2 
                      ? 'Verify' 
                      : 'Complete Registration'}
              </button>
            </form>
            
            <div className="auth-footer">
              <p>Already have an account?</p>
              <Link href="/login" className="auth-link">
                Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }