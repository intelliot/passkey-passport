import React, { useState } from 'react';
import { deriveAddress } from 'xrpl';

// Use a CBOR decoding library compatible with TypeScript
import * as cbor from 'cbor-web'; // or any other CBOR library

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

      // const signatureBase64 = arrayBufferToBase64(response.signature);
      // setSignature(signatureBase64);

      // setSignature in hex format
      const signatureHex = Array.from(new Uint8Array(response.signature))
        .map(byte => byte.toString(16).padStart(2, '0'))
        .join('');
      setSignature(signatureHex);

      // setPublicKey(arrayBufferToBase64(credentials.rawId));
      // Public Key (Credential ID)
      // Example: h0dq9Hebfk83bXPaxE+RNE8rhUc=

      // setPublicKey in hex format
      const publicKeyHex = Array.from(new Uint8Array(credentials.rawId))
        .map(byte => byte.toString(16).padStart(2, '0'))
        .join('');
      setPublicKey(publicKeyHex);

    } catch (error) {
      console.error('Error during signing:', error);
      alert('Failed to sign the message. Make sure you have a passkey set up.');
    }
  };

  const verifySignature = async () => {
    const signatureBuffer = new Uint8Array(signature.match(/.{2}/g)!.map(byte => parseInt(byte, 16)).flat());
    const messageBuffer = new TextEncoder().encode(message);

    const publicKeyBuffer = new Uint8Array(publicKey.match(/.{2}/g)!.map(byte => parseInt(byte, 16)).flat());
    const importedKey = await window.crypto.subtle.importKey(
      'raw',
      publicKeyBuffer,
      {
        // name: 'Ed25519',
      },
      false,
      ['verify'],
    );

    // Verify the signature
    // To use Ed25519, pass an object of the form { "name": "Ed25519" }.
    const isSignatureValid = await window.crypto.subtle.verify(
      // Use Ed25519
      {
        // name: 'Ed25519',
      },
      importedKey,
      signatureBuffer,
      messageBuffer,
    );

    // Log to console.
    console.log(`The signature is ${isSignatureValid ? 'valid' : 'invalid'}.`);

    alert(`The signature is ${isSignatureValid ? 'valid' : 'invalid'}.`);
  }



  const createPasskey = async () => {
    if (!newPasskeyName) {
      alert('Please enter a name for the new passkey.');
      return;
    }

    // Use static challenge (typically provided by the server)
    const challenge = Uint8Array.from([
      0x1f, 0x2e, 0x3d, 0x4c, 0x5b, 0x6a, 0x79, 0x88,
      0x97, 0xa6, 0xb5, 0xc4, 0xd3, 0xe2, 0xf1, 0x00,
    ]);

    // Use static user ID (should be unique per user)
    const userId = Uint8Array.from([
      0x01, 0x23, 0x45, 0x67, 0x89, 0xab, 0xcd, 0xef,
    ]);

    // Define the public key options for credential creation
    const publicKeyOptions: PublicKeyCredentialCreationOptions = {
      challenge: challenge.buffer,
      rp: {
        name: 'Example Relying Party',
        id: window.location.hostname, // Use your domain name
      },
      user: {
        id: userId.buffer,
        name: 'user@example.com',
        displayName: 'Example User',
      },
      pubKeyCredParams: [
        { type: 'public-key', alg: -8 }, // Ed25519 (EdDSA)
      ],
      attestation: 'direct', // Request attestation to get attestationObject
      timeout: 60000, // Timeout in milliseconds
      authenticatorSelection: {
        authenticatorAttachment: 'platform', // 'platform' or 'cross-platform'
        requireResidentKey: false,
        userVerification: 'preferred', // 'required', 'preferred', or 'discouraged'
      },
    };
    
    try {
      const credential = await navigator.credentials.create({ publicKey: publicKeyOptions }) as PublicKeyCredential;
      
      // await navigator.credentials.create({
      //   publicKey: {
      //     challenge: new Uint8Array(32),
      //     rp: {
      //       name: "rp", // Passkey Demo
      //       id: window.location.hostname
      //     },
      //     user: {
      //       id: new Uint8Array(16),
      //       name: newPasskeyName,
      //       displayName: newPasskeyName
      //     },
      //     pubKeyCredParams: [
      //       // {alg: -7, type: "public-key"}, // ES256
      //       // {alg: -257, type: "public-key"}, // RS256
      //       {alg: -8, type: "public-key"} // Ed25519
      //     ],
      //     // authenticatorSelection: {
      //     //   authenticatorAttachment: "platform",
      //     //   userVerification: "required"
      //     // },
      //     // timeout: 60000,
      //     // attestation: "direct"
      //   }
      // }) as PublicKeyCredential;

      // const attestationObject = credential.response.attestationObject;

      const attestationResponse = credential.response as AuthenticatorAttestationResponse;
      const attestationObject = attestationResponse.attestationObject;

      const decodedAttestation = cbor.decodeFirstSync(attestationObject);
      const authData = new Uint8Array(decodedAttestation.authData);

      const { credentialPublicKeyBytes } = parseAuthData(authData);

      // Decode the credentialPublicKeyBytes to get the COSE key
      const credentialPublicKey = cbor.decodeFirstSync(credentialPublicKeyBytes.buffer);

      const kty = credentialPublicKey.get(1);   // Key Type
      const alg = credentialPublicKey.get(3);   // Algorithm
      const crv = credentialPublicKey.get(-1);  // Curve
      
      if (kty === 1 && alg === -8 && crv === 6) {
        console.log('The key is an Ed25519 key.');
      } else {
        console.log('The key is not an Ed25519 key.');
      }
      // Log all values for debugging
      console.log('kty:', kty);
      console.log('alg:', alg);
      console.log('crv:', crv);
      console.log('credentialPublicKey:', credential);

      // const rawId = new Uint8Array(credential.rawId);
      // The rawId read-only property of the PublicKeyCredential interface is an ArrayBuffer object containing the identifier of the credentials.


      // Derive XRPL address
      // deriveAddress(publicKey: string) -> string
      // Derive an XRP Ledger classic address from a hex-encoded public key string.

      // Convert rawId to hex string:
      // const newPasskeyId = Array.from(rawId)
      //   .map(byte => byte.toString(16).padStart(2, '0'))
      //   .join('');

      // // Derive the XRPL address using the new passkey:
      // const xrplAddress = deriveAddress(newPasskeyId);

      // setPasskeys(prevPasskeys => [...prevPasskeys, `${newPasskeyName}: ${xrplAddress}`]);
      // setNewPasskeyName('');
      alert('New passkey created successfully!');

      // For demo purposes, log the credential
      console.log('Credential created:', credential);
    } catch (error) {
      console.error('Error creating credential:', error);
    }
  };

  // Function to parse authData and extract credentialPublicKeyBytes
  function parseAuthData(authData: Uint8Array): { credentialPublicKeyBytes: Uint8Array } {
    let pointer = 0;

    // Skip RP ID Hash (32 bytes)
    pointer += 32;

    // Flags (1 byte)
    const flags = authData[pointer];
    pointer += 1;

    // Sign Count (4 bytes)
    pointer += 4;

    // Check if Attested Credential Data is present
    const attestedCredentialDataPresent = (flags & 0x40) !== 0;
    if (attestedCredentialDataPresent) {
      // AAGUID (16 bytes)
      pointer += 16;

      // Credential ID Length (2 bytes)
      const credIdLen = (authData[pointer] << 8) + authData[pointer + 1];
      pointer += 2;

      // Credential ID (credIdLen bytes)
      pointer += credIdLen;

      // The remaining bytes are the Credential Public Key
      const credentialPublicKeyBytes = authData.slice(pointer);

      return { credentialPublicKeyBytes };
    } else {
      throw new Error('Attested Credential Data not present in authData.');
    }
  }


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

          <h2 className="text-2xl font-bold mb-4">Verify Signature</h2>
          <div>
            <h3 className="text-xl font-bold mb-2">Public Key (Credential ID)</h3>
            <input
              type="text"
              value={publicKey}
              onChange={(e) => setPublicKey(e.target.value)}
              placeholder="Enter public key in hex"
              className="border-2 border-gray-300 p-2 rounded w-full mb-4"
            />
          </div>
          <div>
            <h3 className="text-xl font-bold mb-2">Signature</h3>
            <input
              type="text"
              value={signature}
              onChange={(e) => setSignature(e.target.value)}
              placeholder="Enter signature in hex"
              className="border-2 border-gray-300 p-2 rounded w-full mb-4"
            />
          </div>
          <div>
            <h3 className="text-xl font-bold mb-2">Message</h3>
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Enter message"
              className="border-2 border-gray-300 p-2 rounded w-full mb-4"
            />
          </div>
          <button
            onClick={() => verifySignature()}
            className="bg-secondary text-white px-6 py-3 rounded-full hover:bg-secondary-dark transition duration-300"
          >
            Verify Signature
          </button>

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