/**
 * Creates the master key to encrypt photo from the password
 * @param password
 * @param salt
 */
export async function deriveKeyFromPassword(
  password: string,
  salt: Uint8Array
): Promise<CryptoKey> {
  const encoder = new TextEncoder()
  const keyFormat = 'raw'
  const algorithmIdentifier: AlgorithmIdentifier = { name: 'PBKDF2' }
  const isExtractable = false
  const keyUsage: KeyUsage[] = ['deriveKey']

  const keyMaterial = await crypto.subtle.importKey(
    keyFormat,
    encoder.encode(password),
    algorithmIdentifier,
    isExtractable,
    keyUsage
  )
}
