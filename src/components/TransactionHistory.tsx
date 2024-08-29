import React from 'react';

const TransactionHistory: React.FC = () => {
  // Mock transaction data
  const transactions = [
    { id: 1, type: 'Received', amount: '0.05 ETH', date: '2023-05-01' },
    { id: 2, type: 'Sent', amount: '0.02 ETH', date: '2023-04-28' },
  ];

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-2xl font-semibold mb-4">Transaction History</h2>
      <ul>
        {transactions.map((tx) => (
          <li key={tx.id} className="mb-2 p-2 bg-gray-100 rounded flex justify-between">
            <span>{tx.type}</span>
            <span>{tx.amount}</span>
            <span>{tx.date}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TransactionHistory;