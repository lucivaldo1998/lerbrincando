import { cookies } from 'next/headers';

const COOKIE = 'lb_admin';

export function isAdminTokenValid(token?: string | null) {
  if (!token) return false;
  const expected = process.env.ADMIN_TOKEN || '';
  if (!expected) return false;
  // constant-time compare
  if (token.length !== expected.length) return false;
  let diff = 0;
  for (let i = 0; i < expected.length; i++) diff |= expected.charCodeAt(i) ^ token.charCodeAt(i);
  return diff === 0;
}

export function readAdminCookie() {
  return cookies().get(COOKIE)?.value || null;
}

export function isAdminAuthed() {
  return isAdminTokenValid(readAdminCookie());
}

export const ADMIN_COOKIE_NAME = COOKIE;
