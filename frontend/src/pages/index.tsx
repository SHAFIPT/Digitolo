import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import PetDisplay from "../components/PetDisplay";
import Controls from "../components/Controls";
import { PetProvider } from "../features/pet/PetContext";
import '../styles/Home.css';
import { useAuth } from '@/hooks/useAuth';
import { useDispatch, useSelector } from 'react-redux';
import { resetUser } from '@/store/slice/userSlice';
import { persistor, RootState } from '@/store/store';

export default function Home() {
  const user = useSelector((state: RootState) => state.user.user)
  console.log('thsi si the suer ::',user)
  const { logout } = useAuth()
  const router = useRouter();
  const [username, setUsername] = useState('');
  const dispatch = useDispatch()

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      router.push('/login');
    } else {
      setUsername(user?.name);
    }
  }, [router]);

  const handleLogout = async () => {
  try {
    const response = await logout();

    if (response && response.status === 200) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('username');
      dispatch(resetUser());
      persistor.purge();
      router.push('/login');
    } else {
      console.error('Logout failed:', response?.statusText || 'Unknown error');
    }
  } catch (error) {
    console.error('Logout error:', error);
  }
};

  return (
    <PetProvider>
      <main className="pet-app-container">
        <div className="pet-app-header header-with-profile">
          <h1>🐾 Virtual Pet Companion</h1>

          <div className="profile-section">
            <div className="user-info">
              <img src="/avathar.jpg" alt="User" className="user-avatar" />
              <span className="user-name">{username}</span>
            </div>
            <button className="logout-button" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>

        <div className="pet-dashboard">
          <div className="pet-display-section">
            <PetDisplay />
          </div>

          <div className="pet-controls-section">
            <h2>Care Actions</h2>
            <Controls />
            <div className="pet-tips">
              <p>Keep all stats above 30% for a happy pet.</p>
              <p>Train regularly to help your pet evolve!</p>
            </div>
          </div>
        </div>

        <div className="pet-app-footer">
          <p>Take good care of your virtual friend!</p>
        </div>
      </main>
    </PetProvider>
  );
}
