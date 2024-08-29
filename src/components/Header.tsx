import React from 'react';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  return (
    <header className="bg-blue-600 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">Passkey Passport</Link>
        <nav>
          <Link to="/dashboard" className="ml-4">Dashboard</Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;