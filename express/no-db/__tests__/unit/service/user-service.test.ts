import bcrypt from "bcrypt";
import { ErrorCodes } from "../../../src/constant/error-codes";
import { AppError } from "../../../src/entity/error/app-error";
import JwtService from "../../../src/service/jwt-service";
import userRepository from "../../../src/repository/user-repository";
import UserService from "../../../src/service/user-service";
import { ErrorMessages } from "../../../src/constant/error-messages";

jest.mock('typeorm')
jest.mock("../../../src/repository/user-repository.ts");
jest.mock('../../../src/service/user-service');
jest.mock('../../../src/service/jwt-service');
jest.mock('bcrypt');

describe('UserService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findById', () => {
    it('should retrieve a user by their ID', async () => {
      const mockUser = { id: '123', email: 'test@test.com' };
      (userRepository.findById as jest.Mock).mockResolvedValue(mockUser);

      const result = await UserService.findById('123');
      expect(result).toEqual(mockUser);
    });

    it('should throw an error if user does not exist', async () => {
      (userRepository.findById as jest.Mock).mockResolvedValue(null);
      await expect(UserService.findById('123')).rejects.toThrow(AppError);
      await expect(UserService.findById('123')).rejects.toThrow(ErrorMessages.DONT_HAVE_SUCH_ACC);
    });
  });

  describe('register', () => {
    it('should successfully register a user and return tokens', async () => {
      const mockUserDto = { email: 'test@test.com', password: 'password' };
      (userRepository.findByEmail as jest.Mock).mockResolvedValue(null);
      (bcrypt.genSalt as jest.Mock).mockResolvedValue('salt');
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashed_password');
      (userRepository.create as jest.Mock).mockResolvedValue({ id: '123', email: mockUserDto.email });
      (JwtService.generateTokens as jest.Mock).mockReturnValue({ accessToken: 'access_token' });

      const result = await UserService.register(mockUserDto);
      expect(result).toEqual({ accessToken: 'access_token', user: { id: '123', email: mockUserDto.email } });
    });

    it('should throw error if email is already registered', async () => {
      const mockUserDto = { email: 'test@test.com', password: 'password' };
      (userRepository.findByEmail as jest.Mock).mockResolvedValue(mockUserDto);
      await expect(UserService.register(mockUserDto)).rejects.toThrow(AppError);
      await expect(UserService.register(mockUserDto)).rejects.toThrow(ErrorMessages.ALREADY_HAVE_AN_ACC);
    });
  });

  describe('login', () => {
    it('should authenticate user and return tokens', async () => {
      const mockLoginDto = { email: 'test@test.com', password: 'password' };
      const mockUser = { id: '123', email: mockLoginDto.email, password: 'hashed_password' };
      (userRepository.findByEmail as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.compareSync as jest.Mock).mockReturnValue(true);
      (JwtService.generateTokens as jest.Mock).mockReturnValue({ accessToken: 'access_token' });

      const result = await UserService.login(mockLoginDto);
      expect(result).toEqual({ accessToken: 'access_token', user: { id: '123', email: mockLoginDto.email } });
    });

    it('should throw error if user is not found', async () => {
      const mockLoginDto = { email: 'test@test.com', password: 'password' };
      (userRepository.findByEmail as jest.Mock).mockResolvedValue(null);
      await expect(UserService.login(mockLoginDto)).rejects.toThrow(AppError);
      await expect(UserService.login(mockLoginDto)).rejects.toThrow(ErrorMessages.DONT_HAVE_SUCH_ACC);
    });

    it('should throw error if password is incorrect', async () => {
      const mockLoginDto = { email: 'test@test.com', password: 'wrong_password' };
      const mockUser = { id: '123', email: mockLoginDto.email, password: 'hashed_password' };
      (userRepository.findByEmail as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.compareSync as jest.Mock).mockReturnValue(false);
      await expect(UserService.login(mockLoginDto)).rejects.toThrow(AppError);
      await expect(UserService.login(mockLoginDto)).rejects.toThrow(ErrorMessages.WRONG_PASS);
    });
  });

  describe('update', () => {
    it('should update user details successfully', async () => {
      const mockUpdateDto = { email: 'new_email@test.com' };
      (userRepository.update as jest.Mock).mockResolvedValue(undefined);
      await UserService.update('123', mockUpdateDto);
      expect(userRepository.update).toHaveBeenCalledWith(mockUpdateDto, '123');
    });
  });

  describe('delete', () => {
    it('should delete user successfully', async () => {
      (userRepository.deleteById as jest.Mock).mockResolvedValue(undefined);
      await UserService.delete('123');
      expect(userRepository.deleteById).toHaveBeenCalledWith('123');
    });
  });
});

