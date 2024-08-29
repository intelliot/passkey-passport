import React from 'react';
import { Link } from 'react-router-dom';

interface HeaderProps {
  isAuthenticated: boolean;
}

const Header: React.FC<HeaderProps> = ({ isAuthenticated }) => {
  return (
    <header className="bg-primary text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">Passkey Passport</Link>
        <nav>
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" className="ml-4 hover:text-primary-light">Dashboard</Link>
              <Link to="/wallet" className="ml-4 hover:text-primary-light">Wallet</Link>
            </>
          ) : (
            <Link to="/auth" className="ml-4 hover:text-primary-light">Login</Link>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;