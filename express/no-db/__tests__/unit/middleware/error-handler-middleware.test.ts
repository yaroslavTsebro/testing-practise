import { NextFunction, Request, Response } from "express";
import jwtService from "../../../src/service/jwt-service";
import { errorHandlerMiddleware } from "../../../src/middleware/error-handler-middleware";
import { AppError } from "../../../src/entity/error/app-error";
import { ErrorCodes } from "../../../src/constant/error-codes";
import { ErrorMessages } from "../../../src/constant/error-messages";
import { User } from "../../../src/entity/db/model/user";

describe("ErrorHandling middleware", () => {
  let err: Error;
  let req: Partial<Request>;
  let res: jest.Mocked<Partial<Response>>;
  let next: jest.MockedFunction<NextFunction>;

  beforeEach(() => {
    err = new Error("Test Error");
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  it("should handle AppError and send the correct response", () => {
    //Arrange
    const appError = new AppError(
      ErrorCodes.BAD_REQUEST,
      ErrorMessages.BAD_REQUEST, 
      []
    );

    //Act
    errorHandlerMiddleware(appError, req as Request, res as Response, next);

    //Assert
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      code: ErrorCodes.BAD_REQUEST,
      message: ErrorMessages.BAD_REQUEST,
      errorStack: [],
    });
  });

  it("should handle non-AppError and send a generic server error response", () => {
    //Act
    errorHandlerMiddleware(err, req as Request, res as Response, next);

    //Assert
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      code: ErrorCodes.SERVER_ERROR,
      message: ErrorMessages.SERVER_ERROR,
      errorStack: [],
    });
  });
});
