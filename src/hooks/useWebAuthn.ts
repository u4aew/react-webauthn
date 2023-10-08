/**
 * Interface for WebAuth configurations.
 *
 * @interface IWebAuth
 * @property {string} rpName - The name of the Relying Party.
 * @property {string} rpId - The Relying Party identifier.
 * @property {PublicKeyCredentialCreationOptions} [credentialOpt] - Optional options for credential creation.
 * @property {PublicKeyCredentialRequestOptions} [assertionOpt] - Optional options for assertion.
 */
export interface IWebAuth {
  rpName: string;
  rpId: string;
  credentialOpt?: PublicKeyCredentialCreationOptions;
  assertionOpt?: PublicKeyCredentialRequestOptions;
}

/**
 * Interface for Assertion Options.
 *
 * @interface IAssertionOpt
 * @property {string} challenge - The challenge for the assertion.
 */
export interface IAssertionOpt {
  challenge: string;
}

/**
 * Interface for Credential Options. Extends IAssertionOpt.
 *
 * @interface ICredentialOpt
 * @property {string} userId - The user ID.
 * @property {string} userName - The username.
 * @property {string} userDisplayName - The display name of the user.
 */
export interface ICredentialOpt extends IAssertionOpt {
  userId: string;
  userName: string;
  userDisplayName: string;
}
/**
 * Custom hook for WebAuthn.
 *
 * @function
 * @param {IWebAuth} params - The parameters for the WebAuthn.
 * @returns {object} - The getCredentials and getAssertion methods.
 */
export function useWebAuthn({
  rpName,
  rpId,
  credentialOpt,
  assertionOpt,
}: IWebAuth) {
  /**
   * Method to get Credentials.
   *
   * @async
   * @function
   * @param {ICredentialOpt} params - The parameters for getting credentials.
   * @returns {Promise<any>} - A Promise that resolves to the credentials.
   */
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
  /**
   * Method to get Assertion.
   *
   * @async
   * @function
   * @param {IAssertionOpt} params - The parameters for getting assertion.
   * @returns {Promise<any>} - A Promise that resolves to the assertion.
   */
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
