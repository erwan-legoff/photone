/**
 * Creates the master key to encrypt photo from the password
 * @param password
 * @param salt
 * @param extractable (optional) - whether the key is extractable
 * @param keyUsages (optional) - usages for the derived key
 */
import { uint8ToArrayBuffer } from "~/tools/security/encryption/arrayBufferUtils";

export async function deriveKeyFromPassword(
  password: string,
  salt: Uint8Array,
  extractable: boolean = true,
  keyUsages: KeyUsage[] = ["encrypt", "decrypt"]
): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  const keyFormat = "raw";
  const algorithmIdentifier: AlgorithmIdentifier = { name: "PBKDF2" };
  const isExtractable = false;

  const keyMaterial = await crypto.subtle.importKey(
    keyFormat,
    encoder.encode(password),
    algorithmIdentifier,
    isExtractable, // We don't need to use the keyMaterial outside this scope
    ["deriveKey"]
  );
  const derivationAlgorithm: Pbkdf2Params = {
    name: "PBKDF2",
    salt: uint8ToArrayBuffer(salt),
    iterations: 250000,
    hash: "SHA-256",
  };
  const encryptionAlgorithm: AesDerivedKeyParams = {
    name: "AES-GCM",
    length: 256,
  };
  const derivedKey = await crypto.subtle.deriveKey(
    derivationAlgorithm,
    keyMaterial,
    encryptionAlgorithm,
    extractable,
    keyUsages
  );

  // Runtime check for extractability (for debugging)
  if (!extractable) {
    console.warn(
      "[deriveKeyFromPassword] Warning: Key is not extractable. Wrapping will fail."
    );
  }

  return derivedKey;
}
