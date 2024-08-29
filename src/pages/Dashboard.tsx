import React from 'react';
import PasskeyList from '../components/PasskeyList';
import CreatePasskey from '../components/CreatePasskey';

const Dashboard: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Your Passkey Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <PasskeyList />
        <CreatePasskey />
      </div>
    </div>
  );
};

export default Dashboard;