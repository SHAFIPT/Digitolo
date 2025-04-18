import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import UserRouter from './routes/userRouter';

function App() {
  useEffect(() => {
    // Example: Trigger a toast on mount (optional)
    // toast.success("Welcome to the app!");
  }, []);

  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <Routes>
        <Route path="/*" element={<UserRouter />} />
      </Routes>
    </>
  );
}

export default App;
