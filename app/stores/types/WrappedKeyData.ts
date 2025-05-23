export interface WrappedKeyData {
  wrappedKey: ArrayBuffer;
  pinSalt: Uint8Array;
  iv: Uint8Array;
}
