export interface IWebAuth {
  rpName: string;
  rpId: string;
  credentialOpt?: PublicKeyCredentialCreationOptions;
  assertionOpt?: PublicKeyCredentialRequestOptions;
}

export interface IAssertionOpt {
  challenge: string;
}

export interface ICredentialOpt extends IAssertionOpt {
  userId: string;
  userName: string;
  userDisplayName: string;
}

export function useWebAuthn({
  rpName,
  rpId,
  credentialOpt,
  assertionOpt,
}: IWebAuth) {
  const getCredential = async ({
    userId,
    userName,
    userDisplayName,
    challenge,
  }: ICredentialOpt) => {
    const publicKeyCredentialCreationOptions = {
      rp: {
        name: rpName,
        id: rpId,
      },
      user: {
        id: Uint8Array.from(userId, (c) => c.charCodeAt(0)),
        name: userName,
        displayName: userDisplayName,
      },
      challenge: Uint8Array.from(challenge, (c) => c.charCodeAt(0)),
      pubKeyCredParams: [
        {
          type: 'public-key',
          alg: -7,
        },
        {
          type: 'public-key',
          alg: -257,
        },
      ],
      timeout: 60000,
      excludeCredentials: [],
      authenticatorSelection: {
        residentKey: 'preferred',
        requireResidentKey: false,
        userVerification: 'required',
      },
      attestation: 'none',
      extensions: {
        credProps: true,
      },
      ...credentialOpt,
    } as PublicKeyCredentialCreationOptions;
    return await navigator.credentials.create({
      publicKey: publicKeyCredentialCreationOptions,
    });
  };

  const getAssertion = async ({ challenge }: IAssertionOpt) => {
    const publicKeyCredentialRequestOptions = {
      challenge: Uint8Array.from(challenge, (c) => c.charCodeAt(0)),
      allowCredentials: [],
      rpId: rpId,
      timeout: 60000,
      userVerification: 'required',
      ...assertionOpt,
    } as PublicKeyCredentialRequestOptions;
    return await navigator.credentials.get({
      publicKey: publicKeyCredentialRequestOptions,
    });
  };
  return { getCredential, getAssertion } as const;
}
