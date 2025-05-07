import { encryptFile } from "~/tools/security/encryption/encryptFile";

/**
 * Encrypts a file using AES-GCM and returns a Blob containing IV + ciphertext
 */
export async function encryptFileBinary(
  file: File,
  key: CryptoKey
): Promise<Blob> {
  const { iv, ciphertext } = await encryptFile(file, key);

  const combined = new Uint8Array(iv.length + ciphertext.byteLength);
  combined.set(iv, 0);
  combined.set(new Uint8Array(ciphertext), iv.length);

  return new Blob([combined], { type: "application/octet-stream" });
}
