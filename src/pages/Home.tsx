import React, { useState } from 'react';
import { deriveAddress } from 'xrpl';

const Home: React.FC = () => {
  const [message, setMessage] = useState('');
  const [signature, setSignature] = useState('');
  const [publicKey, setPublicKey] = useState('');
  const [passkeys, setPasskeys] = useState<string[]>([]);
  const [newPasskeyName, setNewPasskeyName] = useState('');

  const arrayBufferToBase64 = (buffer: ArrayBuffer): string => {
    const bytes = new Uint8Array(buffer);
    return btoa(String.fromCharCode.apply(null, bytes as unknown as number[]));
  };

  const signMessage = async () => {
    if (!message) return;

    try {
      /**
       * Retrieves the public key credentials.
       * @returns {Promise<PublicKeyCredential>} The public key credentials.
       */
      const credentials = await navigator.credentials.get({
        publicKey: {
          challenge: new Uint8Array(32),
          allowCredentials: [],
          userVerification: 'preferred', // Specifies the preferred user verification method.
          // Add the message to sign
          extensions: {
            txAuthSimple: message,
          },
        },
      }) as PublicKeyCredential;

      // Rest of the code...
    } catch (error) {
      console.error('Error during signing:', error);
      alert('Failed to sign the message. Make sure you have a passkey set up.');
    }

    

    try {
      /**
       * Retrieves the public key credentials.
       * @returns {Promise<PublicKeyCredential>} The public key credentials.
       */
      const credentials = await navigator.credentials.get({
        publicKey: {
          challenge: new Uint8Array(32),
          allowCredentials: [],
          userVerification: 'preferred', // Specifies the preferred user verification method.
        },
      }) as PublicKeyCredential;

      const response = credentials.response as AuthenticatorAssertionResponse;
      const signatureBase64 = arrayBufferToBase64(response.signature);

      setSignature(signatureBase64);
      setPublicKey(arrayBufferToBase64(credentials.rawId));
      // Public Key (Credential ID)
      // Example: h0dq9Hebfk83bXPaxE+RNE8rhUc=

    } catch (error) {
      console.error('Error during signing:', error);
      alert('Failed to sign the message. Make sure you have a passkey set up.');
    }
  };

  const createPasskey = async () => {
    if (!newPasskeyName) {
      alert('Please enter a name for the new passkey.');
      return;
    }

    try {
      const publicKeyCredential = await navigator.credentials.create({
        publicKey: {
          challenge: new Uint8Array(32),
          rp: {
            name: "rp", // Passkey Demo
            id: window.location.hostname
          },
          user: {
            id: new Uint8Array(16),
            name: newPasskeyName,
            displayName: newPasskeyName
          },
          pubKeyCredParams: [
            {alg: -8, type: "public-key"} // Ed25519
          ],
          authenticatorSelection: {
            authenticatorAttachment: "platform",
            userVerification: "required"
          },
          // timeout: 60000,
          attestation: "direct"
        }
      }) as PublicKeyCredential;

      const rawId = new Uint8Array(publicKeyCredential.rawId);
      // The rawId read-only property of the PublicKeyCredential interface is an ArrayBuffer object containing the identifier of the credentials.


      // Derive XRPL address
      // deriveAddress(publicKey: string) -> string
      // Derive an XRP Ledger classic address from a hex-encoded public key string.

      // Convert rawId to hex string:
      const newPasskeyId = Array.from(rawId)
        .map(byte => byte.toString(16).padStart(2, '0'))
        .join('');

      // Derive the XRPL address using the new passkey:
      const xrplAddress = deriveAddress(newPasskeyId);

      setPasskeys(prevPasskeys => [...prevPasskeys, `${newPasskeyName}: ${xrplAddress}`]);
      setNewPasskeyName('');
      alert('New passkey created successfully!');
    } catch (error) {
      console.error('Error creating passkey:', error);
      alert('Failed to create a new passkey.');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-primary">Passkey Demo</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
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
          <div className="mb-4">
            <input
              type="text"
              value={newPasskeyName}
              onChange={(e) => setNewPasskeyName(e.target.value)}
              placeholder="Enter passkey name"
              className="border-2 border-gray-300 p-2 rounded w-full mb-2"
            />
            <button 
              onClick={createPasskey}
              className="bg-secondary text-white px-6 py-3 rounded-full hover:bg-secondary-dark transition duration-300"
            >
              Create New Passkey
            </button>
          </div>

          <div className="mt-8">
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
              className="bg-secondary text-white px-6 py-3 rounded-full hover:bg-secondary-dark transition duration-300 disabled:opacity-50"
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
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-4">Wallet</h2>
          <div className="bg-gray-100 p-4 rounded mb-4">
            <h3 className="text-xl font-bold mb-2">Balance</h3>
            <p className="text-2xl font-bold text-gray-600">(not funded)</p>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-2">Transaction History</h3>
            <p className="text-gray-600">No transactions yet.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;