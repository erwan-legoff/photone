export async function encryptFile(
  file: File,
  key: CryptoKey
): Promise<{ iv: Uint8Array; ciphertext: ArrayBuffer }> {
  const iv = crypto.getRandomValues(new Uint8Array(12)); // Make sure that a same file do not have the same encryption

  const buffer = await file.arrayBuffer();
  const encryptionAlgorithm: AesGcmParams = {
    name: "AES-GCM",
    iv: iv,
  };
  const encrypted = await crypto.subtle.encrypt(
    encryptionAlgorithm,
    key,
    buffer
  );

  return { iv, ciphertext: encrypted };
}
