import React from 'react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-4">Welcome to Passkey Passport</h1>
      <p className="mb-4">Secure your digital identity with passkeys - the future of authentication.</p>
      <Link to="/dashboard" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
        Get Started
      </Link>
    </div>
  );
};

export default Home;