import 'server-only';

import { cookies } from 'next/headers';
import {
  ADMIN_SESSION_COOKIE,
  ADMIN_SESSION_TTL_SECONDS,
  createAdminSessionToken,
  verifyAdminSessionToken,
} from './session-token';

export async function hasValidAdminSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
  return Boolean(await verifyAdminSessionToken(token));
}

export async function requireAdmin() {
  if (!(await hasValidAdminSession())) {
    throw new Error('Akses admin tidak sah atau sesi telah berakhir.');
  }
}

export async function createAdminSession() {
  const cookieStore = await cookies();
  const token = await createAdminSessionToken();
  cookieStore.set(ADMIN_SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    priority: 'high',
    maxAge: ADMIN_SESSION_TTL_SECONDS,
    path: '/',
  });
}

export async function deleteAdminSession() {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_SESSION_COOKIE);
}
