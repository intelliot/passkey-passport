import React from 'react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-4 text-primary">Welcome to Passkey Passport</h1>
      <p className="mb-4 text-text-light">Secure your digital identity with passkeys - the future of authentication.</p>
      <Link to="/dashboard" className="bg-secondary text-white px-6 py-3 rounded-full hover:bg-secondary-dark transition duration-300">
        Get Started
      </Link>
    </div>
  );
};

export default Home;