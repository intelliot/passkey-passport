'use client';

import { useState } from 'react';

export default function Home() {
  const [message, setMessage] = useState('');
  const [signature, setSignature] = useState('');
  const [publicKey, setPublicKey] = useState('');
  const [balance] = useState('1000.00'); // Mock balance
  const [passkeys, setPasskeys] = useState<string[]>([]);

  const signMessage = async () => {
    if (!message) return;

    try {
      const credentials = await navigator.credentials.get({
        publicKey: {
          challenge: new Uint8Array(32),
          allowCredentials: [],
          userVerification: 'preferred',
        },
      }) as PublicKeyCredential;

      const rawSignature = new Uint8Array(credentials.response.signature);
      const signatureBase64 = btoa(String.fromCharCode.apply(null, rawSignature));

      setSignature(signatureBase64);
      setPublicKey(btoa(String.fromCharCode.apply(null, new Uint8Array(credentials.rawId))));
    } catch (error) {
      console.error('Error during signing:', error);
      alert('Failed to sign the message. Make sure you have a passkey set up.');
    }
  };

  const createPasskey = async () => {
    try {
      const publicKeyCredential = await navigator.credentials.create({
        publicKey: {
          challenge: new Uint8Array(32),
          rp: {
            name: "Passkey Demo",
            id: window.location.hostname
          },
          user: {
            id: new Uint8Array(16),
            name: "demo@example.com",
            displayName: "Demo User"
          },
          pubKeyCredParams: [{alg: -7, type: "public-key"}],
          authenticatorSelection: {
            authenticatorAttachment: "platform",
            userVerification: "required"
          },
          timeout: 60000,
          attestation: "direct"
        }
      }) as PublicKeyCredential;

      const newPasskeyId = btoa(String.fromCharCode.apply(null, new Uint8Array(publicKeyCredential.rawId)));
      setPasskeys(prevPasskeys => [...prevPasskeys, newPasskeyId]);
      alert('New passkey created successfully!');
    } catch (error) {
      console.error('Error creating passkey:', error);
      alert('Failed to create a new passkey.');
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <div className="max-w-5xl w-full font-mono text-sm">
        <h1 className="text-4xl font-bold mb-8">Passkey Demo</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-bold mb-4">Sign Message</h2>
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Enter message to sign"
              className="border-2 border-gray-300 p-2 rounded w-full mb-4"
            />
            <button
              onClick={signMessage}
              disabled={!message}
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
            >
              Sign Message
            </button>

            {signature && (
              <div className="mt-4">
                <h3 className="text-xl font-bold mb-2">Signature</h3>
                <p className="break-all text-xs">{signature}</p>
              </div>
            )}

            {publicKey && (
              <div className="mt-4">
                <h3 className="text-xl font-bold mb-2">Public Key (Credential ID)</h3>
                <p className="break-all text-xs">{publicKey}</p>
              </div>
            )}
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-4">Wallet</h2>
            <div className="bg-gray-100 p-4 rounded mb-4">
              <h3 className="text-xl font-bold mb-2">Balance</h3>
              <p className="text-2xl font-bold text-green-600">${balance}</p>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-2">Transaction History</h3>
              <p className="text-gray-600">No transactions yet.</p>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Your Passkeys</h2>
          {passkeys.length === 0 ? (
            <p className="text-gray-600 mb-4">No passkeys created yet.</p>
          ) : (
            <ul className="list-disc pl-5 mb-4">
              {passkeys.map((passkey, index) => (
                <li key={index} className="text-xs break-all mb-2">{passkey}</li>
              ))}
            </ul>
          )}
          <button 
            onClick={createPasskey}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Create New Passkey
          </button>
        </div>
      </div>
    </main>
  );
}