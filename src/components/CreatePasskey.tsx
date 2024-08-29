import React, { useState } from 'react';
import { createPasskey } from '../utils/passkey';

const CreatePasskey: React.FC = () => {
  const [passkeyName, setPasskeyName] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const credential = await createPasskey(passkeyName);
      console.log('Passkey created:', credential);
      // Handle successful creation (e.g., save to state or backend)
    } catch (error) {
      console.error('Error creating passkey:', error);
      // Handle error (e.g., show error message to user)
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-6 mt-6">
      <h2 className="text-2xl font-semibold mb-4 text-primary">Create New Wallet Passkey</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="passkeyName" className="block text-sm font-medium text-gray-700">
            Passkey Name
          </label>
          <input
            type="text"
            id="passkeyName"
            value={passkeyName}
            onChange={(e) => setPasskeyName(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-secondary text-white px-4 py-2 rounded-full hover:bg-secondary-dark transition duration-300"
        >
          Create Wallet Passkey
        </button>
      </form>
    </div>
  );
};

export default CreatePasskey;