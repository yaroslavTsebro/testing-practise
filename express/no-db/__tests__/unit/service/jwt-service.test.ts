import jwt, { JwtPayload } from "jsonwebtoken";
import JwtService from '../../../src/service/jwt-service';
import { TokenPayload } from "../../../src/entity/dto/token-payload";
import { config } from "../../../src/config/config";

jest.mock('jsonwebtoken');
jest.mock('../config/config', () => ({
  server: {
    jwt: {
      expiresInAccess: '1h',  
      accessSecret: 'mockSecret'
    }
  }
}));

describe('JwtService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('generateTokens', () => {
    it('should generate access token based on provided payload', () => {
      const mockPayload: TokenPayload = { id: '12345', email: "ffrf@gmail.com" };
      const mockToken = 'mocked.jwt.token';
      (jwt.sign as jest.Mock).mockReturnValue(mockToken);

      const result = JwtService.generateTokens(mockPayload);

      expect(jwt.sign).toHaveBeenCalledWith(
        { ...mockPayload },
        config.server.jwt.accessSecret,
        { expiresIn: config.server.jwt.expiresInAccess }
      );
      expect(result.accessToken).toEqual(mockToken);
    });
  });

  describe('generateToken', () => {
    it('should generate a token based on provided payload, secret, and expiration', () => {
      const mockPayload: TokenPayload = { id: '12345', email: "ffrf@gmail.com" };
      const mockSecret = 'mockSecret';
      const mockExpiration = '1h';
      const mockToken = 'mocked.jwt.token';
      (jwt.sign as jest.Mock).mockReturnValue(mockToken);

      const result = JwtService.generateToken(mockPayload, mockSecret, mockExpiration);

      expect(jwt.sign).toHaveBeenCalledWith(
        { ...mockPayload },
        mockSecret,
        { expiresIn: mockExpiration }
      );
      expect(result).toEqual(mockToken);
    });
  });

  describe('validateAccessToken', () => {
    it('should validate access token and return its payload', () => {
      const mockToken = 'mocked.jwt.token';
      const mockPayload: JwtPayload = { id: '12345', email: "ffrf@gmail.com" , iat: 123456, exp: 654321 };
      (jwt.verify as jest.Mock).mockReturnValue(mockPayload);

      const result = JwtService.validateAccessToken(mockToken);

      expect(jwt.verify).toHaveBeenCalledWith(mockToken, config.server.jwt.accessSecret);
      expect(result).toEqual(mockPayload);
    });

    it('should return null if token validation fails', () => {
      const mockToken = 'mocked.jwt.token';
      (jwt.verify as jest.Mock).mockImplementation(() => {
        throw new Error('Token invalid');
      });

      const result = JwtService.validateAccessToken(mockToken);

      expect(jwt.verify).toHaveBeenCalledWith(mockToken, config.server.jwt.accessSecret);
      expect(result).toBeNull();
    });
  });
});
