import * as bcrypt from 'bcrypt';

export class Encryption {
  static saltRound = 10;

  static hash(plainText: string) {
    return bcrypt.hash(plainText, this.saltRound);
  }

  static isMatch(plainText: string, hash: string) {
    return bcrypt.compare(plainText, hash);
  }
}
