import { NextFunction, Request, Response } from "express";
import jwtService from "../../../src/service/jwt-service";
import { authorizationMiddleware } from "../../../src/middleware/authorization-middleware";
import { AppError } from "../../../src/entity/error/app-error";
import { ErrorCodes } from "../../../src/constant/error-codes";
import { ErrorMessages } from "../../../src/constant/error-messages";
import { User } from "../../../src/entity/db/model/user";

jest.mock("../../../src/service/jwt-service", () => ({
  __esModule: true,
  default: {
    validateAccessToken: jest.fn(),
  },
}));


describe("Authorisation middleware", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: jest.MockedFunction<NextFunction>;

  beforeEach(() => {
    req = {};
    res = {};
    next = jest.fn();
  });

  it("should call next if authorization header is present and valid", () => {
    //Arrange
    const authToken = "validAccessToken"
    const authHeader = "Bearer " + authToken;
    req.headers = { authorization: authHeader };
    (jwtService.validateAccessToken as jest.Mock).mockReturnValue({} as User);

    //Act
    authorizationMiddleware(req as Request, res as Response, next);

    //Assert
    expect(next).toHaveBeenCalled();
    expect(jwtService.validateAccessToken).toHaveBeenCalledWith(authToken);
  });

  it("should return UNAUTHORIZED error if authorization header is missing", () => {
    //Act
    authorizationMiddleware(req as Request, res as Response, next);

    //Assert
    expect(next).toHaveBeenCalledWith(
      new AppError(ErrorCodes.UNAUTHORIZED, ErrorMessages.UNAUTHORIZED)
    );
  });

  it("should return UNAUTHORIZED error if accessToken is invalid", () => {
    //Arrange
    const authToken = "invalidAccessToken";
    const authHeader = "Bearer " + authToken;
    req.headers = { authorization: authHeader };
    (jwtService.validateAccessToken as jest.Mock).mockReturnValue(null);

    //Act
    authorizationMiddleware(req as Request, res as Response, next);

    //Assert
    expect(jwtService.validateAccessToken).toHaveBeenCalledWith(authToken);
    expect(next).toHaveBeenCalledWith(
      new AppError(ErrorCodes.UNAUTHORIZED, ErrorMessages.UNAUTHORIZED)
    );
  });
});
