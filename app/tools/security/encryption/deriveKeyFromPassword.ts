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

  const keyMaterial = await crypto.subtle.importKey(
    keyFormat,
    encoder.encode(password),
    algorithmIdentifier,
    isExtractable,
    ['deriveKey']
  )
  const derivationAlgorithm: Pbkdf2Params = {
    name: 'PBKBF2',
    salt: salt,
    iterations: 250000,
    hash: 'SHA-256',
  }
  const encryptionAlgorithm: AesDerivedKeyParams = {
    name: 'AES-GCM',
    length: 256,
  }
  return crypto.subtle.deriveKey(
    derivationAlgorithm,
    keyMaterial,
    encryptionAlgorithm,
    true,
    ['encrypt', 'decrypt']
  )
}
