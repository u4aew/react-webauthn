import { useWebAuthn } from './useWebAuthn';

describe('useWebAuthn', () => {
  const mockCreate = jest.fn();
  const mockGet = jest.fn();

  beforeAll(() => {
    Object.defineProperty(navigator, 'credentials', {
      value: {
        create: mockCreate,
        get: mockGet,
      },
    });
  });

  beforeEach(() => {
    mockCreate.mockClear();
    mockGet.mockClear();
  });

  it('should create credentials with correct parameters', async () => {
    const { getCredential } = useWebAuthn({
      rpName: 'Test RP',
      rpId: 'test.example.com',
    });

    mockCreate.mockResolvedValue({ id: 'credential-id' });

    const result = await getCredential({
      userId: '123',
      userName: 'testuser',
      userDisplayName: 'Test User',
      challenge: 'test-challenge',
    });

    expect(mockCreate).toHaveBeenCalledWith({
      publicKey: expect.objectContaining({
        rp: { name: 'Test RP', id: 'test.example.com' },
        user: {
          id: new Uint8Array([49, 50, 51]), // '123' in char codes
          name: 'testuser',
          displayName: 'Test User',
        },
        challenge: new Uint8Array([
          116, 101, 115, 116, 45, 99, 104, 97, 108, 108, 101, 110, 103, 101,
        ]),
      }),
    });
    expect(result).toEqual({ id: 'credential-id' });
  });

  it('should get assertion with correct parameters', async () => {
    const { getAssertion } = useWebAuthn({
      rpName: 'Test RP',
      rpId: 'test.example.com',
    });

    mockGet.mockResolvedValue({ id: 'assertion-id' });

    const result = await getAssertion({
      challenge: 'test-challenge',
    });

    expect(mockGet).toHaveBeenCalledWith({
      publicKey: expect.objectContaining({
        challenge: new Uint8Array([
          116, 101, 115, 116, 45, 99, 104, 97, 108, 108, 101, 110, 103, 101,
        ]),
        rpId: 'test.example.com',
      }),
    });
    expect(result).toEqual({ id: 'assertion-id' });
  });
});
