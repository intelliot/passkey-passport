export async function createPasskey(username: string) {
  const challenge = new Uint8Array(32);
  crypto.getRandomValues(challenge);

  const createCredentialOptions: CredentialCreationOptions = {
    publicKey: {
      challenge,
      rp: {
        name: "Passkey Passport",
        id: window.location.hostname,
      },
      user: {
        id: Uint8Array.from(username, c => c.charCodeAt(0)),
        name: username,
        displayName: username,
      },
      pubKeyCredParams: [{ alg: -7, type: "public-key" }],
      authenticatorSelection: {
        authenticatorAttachment: "platform",
        userVerification: "required",
      },
    },
  };

  const credential = await navigator.credentials.create(createCredentialOptions);
  return credential;
}

export async function getPasskey(username: string) {
  const challenge = new Uint8Array(32);
  crypto.getRandomValues(challenge);

  const getCredentialOptions: CredentialRequestOptions = {
    publicKey: {
      challenge,
      rpId: window.location.hostname,
      userVerification: "required",
      allowCredentials: [],
    },
  };

  const credential = await navigator.credentials.get(getCredentialOptions);
  return credential;
}