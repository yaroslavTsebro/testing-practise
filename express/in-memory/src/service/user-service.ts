import { ErrorCodes } from "../constant/error-codes";
import { ErrorMessages } from "../constant/error-messages";
import { User } from "../entity/db/model/user";
import { CreateUserDto } from "../entity/dto/create-user-dto";
import { TokenPayload } from "../entity/dto/token-payload";
import { AppError } from "../entity/error/app-error";
import userRepository from "../repository/user-repository";
import { ServiceHelper } from "../utils/service-helper";
import JwtService from "../service/jwt-service";
import bcrypt from "bcrypt";
import { LoginUserDto } from "../entity/dto/login-user-dto";
import { UpdateUserDto } from "../entity/dto/update-user-dto";

export type TokenResponse = Promise<{
  accessToken: string;
  user: TokenPayload;
}>;

/**
 * Service class for handling user operations.
 * @extends {ServiceHelper}
 */
class UserService extends ServiceHelper {
  
  /**
   * Retrieves a user by their ID.
   * @param {string} id - User ID.
   * @returns {Promise<User>} - Retrieved user.
   * @throws {AppError} - If user doesn't exist.
   */
  async findById(id: string): Promise<User> {
    try {
      UserService.validateId(id);
      const user = await userRepository.findById(id);
      if (user) {
        return user;
      }
      throw new AppError(
        ErrorCodes.DONT_HAVE_SUCH_ACC,
        ErrorMessages.DONT_HAVE_SUCH_ACC
      );
    } catch (e) {
      console.error("Occurred in user service", id);
      throw e;
    }
  }

  /**
   * Registers a new user and returns generated access tokens.
   * @param {CreateUserDto} dto - Data transfer object for user creation.
   * @returns {Promise<TokenResponse>} - Generated access tokens.
   * @throws {AppError} - If user already exists or any other error.
   */
  async register(dto: CreateUserDto): Promise<TokenResponse> {
    try {
      UserService.validateDto(dto);
      const user = await userRepository.findByEmail(dto.email);
      if (user) {
        throw new AppError(
          ErrorCodes.ALREADY_HAVE_AN_ACC,
          ErrorMessages.ALREADY_HAVE_AN_ACC
        );
      }
      const salt = await bcrypt.genSalt();
      dto.password = await bcrypt.hash(dto.password, salt);

      const createdUser = await userRepository.create(dto);

      const tokenPayload = new TokenPayload(createdUser.id, createdUser.email);

      const tokens = JwtService.generateTokens(tokenPayload);
      return { ...tokens, user: tokenPayload };
    } catch (e) {
      console.error("Occurred in user service", dto);
      throw e;
    }
  }

  /**
   * Authenticates the user and returns generated access tokens.
   * @param {LoginUserDto} dto - Data transfer object for user login.
   * @returns {TokenResponse} - Generated access tokens and user token payload.
   * @throws {AppError} - If user doesn't exist or password is incorrect.
   */
  async login(dto: LoginUserDto): TokenResponse {
    try {
      UserService.validateDto(dto);

      const currentUser = await userRepository.findByEmail(dto.email);
      if (!currentUser) {
        throw new AppError(
          ErrorCodes.DONT_HAVE_SUCH_ACC,
          ErrorMessages.DONT_HAVE_SUCH_ACC
        );
      }

      const result = bcrypt.compareSync(dto.password, currentUser.password);
      if (!result) {
        throw new AppError(ErrorCodes.WRONG_PASS, ErrorMessages.WRONG_PASS);
      }

      const tokenPayload = new TokenPayload(currentUser.id, currentUser.email);
      const tokens = JwtService.generateTokens(tokenPayload);

      return { ...tokens, user: tokenPayload };
    } catch (e) {
      console.error("Occurred in user service", dto);
      throw e;
    }
  }

  /**
   * Updates the user details.
   * @param {string} id - User ID.
   * @param {UpdateUserDto} dto - Data transfer object containing updated user details.
   * @returns {Promise<void>}
   * @throws {AppError} - On validation errors or update failure.
   */
  async update(id: string, dto: UpdateUserDto): Promise<void> {
    try {
      UserService.validateId(id);
      UserService.validateDto(dto);

      return await userRepository.update(dto, id);
    } catch (e) {
      console.error("Occurred in user service", dto);
      throw e;
    }
  }

  /**
   * Deletes a user by their ID.
   * @param {string} id - User ID.
   * @returns {Promise<void>}
   * @throws {AppError} - On validation errors or deletion failure.
   */
  async delete(id: string): Promise<void> {
    try {
      UserService.validateId(id);

      return await userRepository.deleteById(id);
    } catch (e) {
      console.error("Occurred in user service", id);
      throw e;
    }
  }
}

export default new UserService();

