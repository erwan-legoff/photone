// Small helpers for ArrayBuffer/Uint8Array conversions used across crypto code
export function uint8ToArrayBuffer(u8: Uint8Array): ArrayBuffer {
  // Return a fresh ArrayBuffer that contains the same bytes.
  // This avoids returning SharedArrayBuffer which TypeScript may include in unions.
  const copy = new Uint8Array(u8.byteLength);
  copy.set(u8.subarray(0));
  return copy.buffer;
}

export function arrayBufferToUint8(ab: ArrayBuffer): Uint8Array {
  return new Uint8Array(ab);
}
