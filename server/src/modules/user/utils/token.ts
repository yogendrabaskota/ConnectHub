import jwt, { SignOptions } from "jsonwebtoken";

/**
 * Generate a JWT token
 * @param payload - The data to include in the token
 * @param secret - The secret key used to sign the token
 * @param expiresIn - Token expiration time (e.g., '1h', '7d')
 * @returns A signed JWT string
 */
const jwtToken = (
  payload: object,
  secret: string,
  expiresIn: string | number = "1h"
): string => {
  const options: any = {
    expiresIn: expiresIn as SignOptions["expiresIn"],
  };
  return jwt.sign(payload, secret, options);
};

export default jwtToken;
