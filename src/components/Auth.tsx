import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface AuthProps {
  setIsAuthenticated: (value: boolean) => void;
}

const Auth: React.FC<AuthProps> = ({ setIsAuthenticated }) => {
  const [isSignUp, setIsSignUp] = useState(true);
  const [walletName, setWalletName] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically handle the authentication logic
    console.log(isSignUp ? 'Signing up' : 'Signing in', walletName);
    setIsAuthenticated(true);
    navigate('/dashboard');
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
      <div className="p-8">
        <h2 className="text-2xl font-bold text-center mb-4">
          {isSignUp ? 'Create Your Wallet' : 'Access Your Wallet'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="walletName" className="block text-sm font-medium text-gray-700">
              Wallet Name
            </label>
            <input
              type="text"
              id="walletName"
              value={walletName}
              onChange={(e) => setWalletName(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {isSignUp ? 'Create Wallet' : 'Access Wallet'}
          </button>
        </form>
        <div className="mt-4 text-center">
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-sm text-indigo-600 hover:text-indigo-500"
          >
            {isSignUp ? 'Already have a wallet? Sign in' : 'Need a wallet? Sign up'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;