import React from 'react';

interface WalletBalanceProps {
  balance: string;
}

const WalletBalance: React.FC<WalletBalanceProps> = ({ balance }) => {
  return (
    <div className="bg-white shadow rounded-lg p-6 mb-6">
      <h2 className="text-2xl font-semibold mb-4 text-primary">Wallet Balance</h2>
      <p className="text-4xl font-bold text-secondary">${balance} USD</p>
    </div>
  );
};

export default WalletBalance;