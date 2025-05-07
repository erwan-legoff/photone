import { decryptFile } from "~/tools/security/encryption/decryptFile";

/**
 * Reads a file encrypted with AES-GCM (iv + ciphertext) and returns the decrypted File
 */
export async function decryptFileBinary(
  file: File,
  key: CryptoKey
): Promise<File> {
  const fullBuffer = await file.arrayBuffer();

  const ivLength = 12; // standard length for AES-GCM
  const iv = new Uint8Array(fullBuffer.slice(0, ivLength));
  const ciphertext = fullBuffer.slice(ivLength);

  const decryptedBlob = await decryptFile(ciphertext, key, iv);

  // Remove .encrypted.json or fallback to original file name
  const originalName = "123456";

  return new File([decryptedBlob], originalName);
}
