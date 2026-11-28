import crypto from 'crypto';

const SCRYPT_PREFIX = 'scrypt$';
const KEY_LEN = 64;

/**
 * Hash a plaintext password using per-user random salt and Node crypto.scryptSync.
 */
export function hashPassword(plain: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const derived = crypto.scryptSync(plain, salt, KEY_LEN).toString('hex');
  return `${SCRYPT_PREFIX}${salt}$${derived}`;
}

/**
 * Verify a plaintext password against a stored scrypt hash (or legacy plaintext with timing-safe comparison).
 */
export function verifyPassword(plain: string, stored: string): boolean {
  if (!plain || !stored) return false;

  if (stored.startsWith(SCRYPT_PREFIX)) {
    const parts = stored.split('$');
    if (parts.length !== 3) return false;
    const [, salt, hexHash] = parts;
    const expectedBuf = Buffer.from(hexHash, 'hex');
    const actualBuf = crypto.scryptSync(plain, salt, expectedBuf.length);
    if (expectedBuf.length !== actualBuf.length) return false;
    return crypto.timingSafeEqual(expectedBuf, actualBuf);
  }

  // Legacy plaintext fallback using constant-time comparison
  const a = Buffer.from(plain, 'utf8');
  const b = Buffer.from(stored, 'utf8');
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

export function isHashedPassword(stored: string): boolean {
  return stored.startsWith(SCRYPT_PREFIX);
}
