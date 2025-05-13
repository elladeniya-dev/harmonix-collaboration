import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';

const Login = () => {
  const { setUser } = useUser();
  const navigate = useNavigate();

  const handleSuccess = async (credentialResponse) => {
    try {
      const token = credentialResponse?.credential;
      if (!token) throw new Error('No credential received from Google');

      const res = await axios.post(
        'http://localhost:8080/api/auth/login',
        token,
        {
          headers: {
            'Content-Type': 'text/plain', // Sending raw token as plain text
          },
          withCredentials: true, // Needed to receive cookie from backend
        }
      );

      setUser(res.data); // User object from backend
      navigate('/job'); // Redirect after login
    } catch (error) {
      console.error('Login error:', error);
      alert(
        error.response?.status === 403
          ? 'Invalid Google token or unauthorized domain'
          : 'Login failed. Please try again.'
      );
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-600 to-purple-600">
      <div className="bg-white p-10 rounded-xl shadow-lg max-w-sm w-full text-center">
        <h1 className="text-2xl font-bold mb-6 text-indigo-700">Login with Google</h1>

        <GoogleLogin
          onSuccess={handleSuccess}
          onError={() => alert('Google login failed')}
          useOneTap // Optional: Google One Tap login
        />

        <p className="text-gray-600 mt-6 text-sm">
          First time? You’ll be auto-registered ✨
        </p>
      </div>
    </div>
  );
};

export default Login;
