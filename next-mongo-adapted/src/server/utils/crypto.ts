import bcrypt from "bcrypt";
const ROUNDS = 10;
export async function hashPassword(plain: string) { return bcrypt.hash(plain, ROUNDS); }
export async function comparePassword(plain: string, hash: string) {
    return bcrypt.compare(plain, hash); 
}
