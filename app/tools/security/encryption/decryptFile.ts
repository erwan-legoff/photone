export async function decryptFile(
  ciphertext: ArrayBuffer,
  key: CryptoKey,
  iv: Uint8Array
): Promise<Blob> {
  const decryptionAlgorithm: AesGcmParams = {
    name: "AES-GCM",
    iv,
  };
  const decrypted = await crypto.subtle.decrypt(
    decryptionAlgorithm,
    key,
    ciphertext
  );

  return new Blob([decrypted]);
}
