import { hashAdminPassword } from '../src/lib/auth/password.js';

const password = process.argv[2];
if (!password) {
  console.error('Penggunaan: npm run admin:hash-password -- "password-kuat"');
  process.exitCode = 1;
} else {
  console.log(await hashAdminPassword(password));
}
