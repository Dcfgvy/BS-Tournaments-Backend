import { genSaltSync, hashSync, compareSync} from 'bcrypt';
export function hashPassword(password: string): string {
  const salt = genSaltSync(12);
  const hashedPassword = hashSync(password, salt);
  return hashedPassword;
}

export function comparePasswords(password: string, hash: string): boolean {
  const result = compareSync(password, hash);
  return result;
}