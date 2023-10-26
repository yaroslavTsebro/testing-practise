import jwt, { JwtPayload } from "jsonwebtoken";
import { config } from "../config/config";
import { TokenPayload } from "../entity/dto/token-payload";

/**
 * JwtService is a class responsible for JWT (JSON Web Token) operations.
 * It provides functionality to generate, validate and manage JWTs.
 */
class JwtService {

  /**
   * Creates a new JwtService instance.
   * 
   * @param {string} [accessExpires=config.server.jwt.expiresInAccess] - The expiration time for access tokens.
   * @param {string} [accessSecret=config.server.jwt.accessSecret] - The secret key for signing access tokens.
   */
  constructor(
    private readonly accessExpires = config.server.jwt.expiresInAccess,
    private readonly accessSecret = config.server.jwt.accessSecret
  ) {}

  /**
   * Generates tokens based on the provided payload.
   * 
   * @param {TokenPayload} token - The token payload to be signed.
   * @returns {{ accessToken: string }} - An object containing the generated access token.
   */
  public generateTokens(token: TokenPayload): {
    accessToken: string;
  } {
    const accessToken = this.generateToken(
      token,
      this.accessSecret,
      this.accessExpires
    );

    return {
      accessToken,
    };
  }

  /**
   * Generates a token based on the provided payload, secret, and expiration time.
   * 
   * @param {TokenPayload} token - The token payload to be signed.
   * @param {string} secret - The secret key for signing the token.
   * @param {string} expirationTime - The expiration time for the token.
   * @returns {string} - The generated JWT token.
   */
  public generateToken(
    token: TokenPayload,
    secret: string,
    expirationTime: string
  ): string {
    return jwt.sign({ ...token }, secret, {
      expiresIn: expirationTime,
    });
  }

  /**
   * Validates an access token and returns its payload if valid.
   * 
   * @param {string} token - The JWT token to validate.
   * @returns {JwtPayload | string | null} - The token payload if valid, or null if invalid.
   */
  public validateAccessToken(token: string): JwtPayload | string | null {
    return this.validateToken(token, this.accessSecret);
  }

  /**
   * Validates a token based on the provided secret and returns its payload if valid.
   * 
   * @private
   * @param {string} token - The JWT token to validate.
   * @param {string} secret - The secret key for verifying the token.
   * @returns {JwtPayload | string | null} - The token payload if valid, or null if invalid.
   */
  private validateToken(
    token: string,
    secret: string
  ): JwtPayload | string | null {
    try {
      return jwt.verify(token, secret);
    } catch (e) {
      return null;
    }
  }
}

export default new JwtService();
