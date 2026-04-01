import bcrypt from "bcrypt";

export class Hasher {
  public static hashPassword = async (password: string): Promise<string> => {
    let salt_round: number = Number(process.env.SALT_ROUND);
    let salt: string = await bcrypt.genSalt(salt_round);
    let hashedPassword: string = await bcrypt.hash(password, salt);
    console.log(password);
    return hashedPassword;
  };

  public static verifyPassword = async (
    plaintext: string,
    hashedPassword: string
  ): Promise<boolean> => {
    return bcrypt.compare(plaintext, hashedPassword);
  };
}
