import React from 'react';

const PasskeyList: React.FC = () => {
  // Mock data for passkeys
  const passkeys = [
    { id: 1, name: 'Personal Email', createdAt: '2023-04-15' },
    { id: 2, name: 'Work Account', createdAt: '2023-04-16' },
  ];

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-2xl font-semibold mb-4">Your Passkeys</h2>
      <ul>
        {passkeys.map((passkey) => (
          <li key={passkey.id} className="mb-2 p-2 bg-gray-100 rounded">
            <span className="font-medium">{passkey.name}</span>
            <span className="text-sm text-gray-500 ml-2">Created: {passkey.createdAt}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PasskeyList;