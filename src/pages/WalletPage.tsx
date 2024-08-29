import React, { useState } from 'react';
import PasskeyList from '../components/PasskeyList';
import CreatePasskey from '../components/CreatePasskey';
import WalletBalance from '../components/WalletBalance';
import TransactionHistory from '../components/TransactionHistory';

const WalletPage: React.FC = () => {
  const [balance] = useState('1000.00'); // Mock balance

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-6">Your Crypto Wallet</h1>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div className="col-span-2">
          <WalletBalance balance={balance} />
          <TransactionHistory />
        </div>
        <div>
          <PasskeyList />
          <CreatePasskey />
        </div>
      </div>
    </div>
  );
};

export default WalletPage;