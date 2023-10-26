import { NextFunction, Request, Response } from "express";
import { config } from "../config/config";
import userService from "../service/user-service";
import { plainToInstance } from "class-transformer";
import { CreateUserDto } from "../entity/dto/create-user-dto";
import { LoginUserDto } from "../entity/dto/login-user-dto";
import { UpdateUserDto } from "../entity/dto/update-user-dto";

/**
 * The UserController class manages user-related operations,
 * such as registration, login, update, and deletion of user profiles.
 */
class UserController {
  /**
   * Fetches and returns the data for the currently authenticated user.
   *
   * @async
   * @param {Request} req - The Express request object.
   * @param {Response} res - The Express response object.
   * @param {NextFunction} next - Express next middleware function.
   * @throws Will forward the error to the next middleware if fetching fails.
   */
  async findSelf(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.user.id;
      const user = await userService.findById(id);
      res.json(user).end();
    } catch (e) {
      console.error("Occurred during findById");
      next(e);
    }
  }

  /**
   * Handles user registration. Converts the request body to a DTO,
   * registers the user, and sets the accessToken in the response cookie.
   *
   * @async
   * @param {Request} req - The Express request object with user registration data.
   * @param {Response} res - The Express response object.
   * @param {NextFunction} next - Express next middleware function.
   * @throws Will forward the error to the next middleware if registration fails.
   */
  async registration(req: Request, res: Response, next: NextFunction) {
    try {
      const dto = plainToInstance(CreateUserDto, req.body);
      const data = await userService.register(dto);
      UserController.addAccessTokenToCookie(res, data.accessToken);

      res.json(data).end();
    } catch (e) {
      console.error("Occurred during registration");
      next(e);
    }
  }

  /**
   * Authenticates a user. Converts the request body to a DTO,
   * logs in the user, and sets the accessToken in the response cookie.
   *
   * @async
   * @param {Request} req - The Express request object with user login data.
   * @param {Response} res - The Express response object.
   * @param {NextFunction} next - Express next middleware function.
   * @throws Will forward the error to the next middleware if login fails.
   */
  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const dto = plainToInstance(LoginUserDto, req.body);
      const data = await userService.login(dto);
      UserController.addAccessTokenToCookie(res, data.accessToken);

      res.json(data).end();
    } catch (e) {
      console.error("Occurred during login");
      next(e);
    }
  }

  /**
   * Logs out a user by clearing the accessToken cookie.
   *
   * @async
   * @param {Request} req - The Express request object.
   * @param {Response} res - The Express response object.
   * @param {NextFunction} next - Express next middleware function.
   * @throws Will forward the error to the next middleware if logout fails.
   */
  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      res.clearCookie("accessToken");
      return res.end();
    } catch (e) {
      console.error("Occurred during logout");
      next(e);
    }
  }

  /**
   * Updates user data for the currently authenticated user.
   * Converts the request body to a DTO and updates the user's information.
   *
   * @async
   * @param {Request} req - The Express request object with user update data.
   * @param {Response} res - The Express response object.
   * @param {NextFunction} next - Express next middleware function.
   * @throws Will forward the error to the next middleware if update fails.
   */
  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.user.id;
      const dto = plainToInstance(UpdateUserDto, req.body);
      await userService.update(id, dto);

      res.end();
    } catch (e) {
      console.error("Occurred during login");
      next(e);
    }
  }

  /**
   * Deletes the currently authenticated user's profile.
   *
   * @async
   * @param {Request} req - The Express request object.
   * @param {Response} res - The Express response object.
   * @param {NextFunction} next - Express next middleware function.
   * @throws Will forward the error to the next middleware if deletion fails.
   */
  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.user.id;
      await userService.delete(id);

      res.end();
    } catch (e) {
      console.error("Occurred during login");
      next(e);
    }
  }

  /**
   * Adds the accessToken to the response cookie.
   *
   * @param {Response} res - The Express response object.
   * @param {string} token - The access token to be added to the cookie.
   */
  private static addAccessTokenToCookie(res: Response, token: string) {
    res.cookie("accessToken", token, {
      maxAge: config.server.jwt.expiresInRefreshCookie,
      httpOnly: true,
    });
    console.info("Refresh token was added to the cookie");
  }
}

export default new UserController();
