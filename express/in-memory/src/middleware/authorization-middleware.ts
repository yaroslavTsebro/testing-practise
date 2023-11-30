import { NextFunction, Request, Response } from "express";
import { AppError } from "../entity/error/app-error";
import { ErrorCodes } from "../constant/error-codes";
import { ErrorMessages } from "../constant/error-messages";
import { JwtPayload } from "jsonwebtoken";
import jwtService from "../service/jwt-service";

export async function authorizationMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const authorizationHeader = req.headers.authorization;
    if (!authorizationHeader || !authorizationHeader.split(" ")[1]) {
      throw new AppError(ErrorCodes.UNAUTHORIZED, ErrorMessages.UNAUTHORIZED);
    }

    const accessToken = authorizationHeader.split(" ")[1];
    const userData = jwtService.validateAccessToken(accessToken);
    console.log(userData);
    if (!userData) {
      throw new AppError(ErrorCodes.UNAUTHORIZED, ErrorMessages.UNAUTHORIZED);
    }

    req.user = userData as JwtPayload;
    next();
  } catch (e) {
    return next(
      new AppError(ErrorCodes.UNAUTHORIZED, ErrorMessages.UNAUTHORIZED)
    );
  }
}
