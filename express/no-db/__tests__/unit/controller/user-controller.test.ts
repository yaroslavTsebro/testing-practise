import { ErrorCodes } from "../../../src/constant/error-codes";
import { ErrorMessages } from "../../../src/constant/error-messages";
import userController from "../../../src/controller/user-controller";
import UserController from "../../../src/controller/user-controller";
import { User } from "../../../src/entity/db/model/user";
import { CreateUserDto } from "../../../src/entity/dto/create-user-dto";
import { LoginUserDto } from "../../../src/entity/dto/login-user-dto";
import { UpdateUserDto } from "../../../src/entity/dto/update-user-dto";
import { AppError } from "../../../src/entity/error/app-error";
import userService, { TokenResponse } from "../../../src/service/user-service";
import { Response, Request, NextFunction } from "express";
import { JwtPayload } from "jsonwebtoken";

jest.mock("../../../src/service/user-service.ts");
jest.mock("class-transformer");

const mockRequest = (): Request & { user?: JwtPayload } => {
  return {} as Request & { user?: JwtPayload };
};

const mockClearCookie = jest.fn();
const mockEnd = jest.fn();

const mockResponse = (): Response => {
  const res: any = {};
  res.json = jest.fn().mockReturnValue(res);
  res.end = jest.fn().mockReturnValue(res);
  res.cookie = jest.fn().mockReturnValue(res);
  res.clearCookie = jest.fn().mockReturnValue(res);
  return res;
};

const mockNextFunction = (): NextFunction => jest.fn();

describe("UserController", () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  describe("findSelf", () => {
    it("should fetch user by ID", async () => {
      // Arrange
      const req = mockRequest();
      req.user = { id: "123" };
      const res = mockResponse();
      const next = mockNextFunction();

      (userService.findById as jest.Mock).mockResolvedValue({
        id: "123",
        name: "John",
      });

      // Act
      await UserController.findSelf(req, res, next);

      // Assert
      expect(userService.findById).toHaveBeenCalledWith("123");
      expect(res.json).toHaveBeenCalledWith({ id: "123", name: "John" });
    });

    it("should handle errors in findSelf", async () => {
      // Arrange
      const req = mockRequest();
      req.user = { id: "123" };
      const res = mockResponse();
      const next = mockNextFunction();

      const mockError = new AppError(
        ErrorCodes.DONT_HAVE_SUCH_ACC,
        ErrorMessages.DONT_HAVE_SUCH_ACC
      );

      (userService.findById as jest.Mock).mockRejectedValue(mockError);

      // Act
      await UserController.findSelf(req, res, next);

      // Assert
      expect(next).toHaveBeenCalledWith(mockError);
    });
  });

  describe("registration", () => {
    it("should register user by data", async () => {
      // Arrange
      const req = mockRequest();
      const dto = {
        password: "defrferfre",
        email: "frferf@gmail.com",
      } as CreateUserDto;
      req.body = dto;
      const res = mockResponse();
      const next = mockNextFunction();

      const expectedRegisterResponse = {
        accessToken: "token",
        user: {
          id: "uuid",
          email: "frferf@gmail.com",
        },
      };
      (userService.register as jest.Mock).mockResolvedValue(
        expectedRegisterResponse
      );

      // Act
      await UserController.registration(req, res, next);

      // Assert
      expect(userService.register).toHaveBeenCalledWith(dto);
      expect(res.json).toHaveBeenCalledWith(expectedRegisterResponse);
    });

    it("should handle errors in register, non-valid email", async () => {
      // Arrange
      const req = mockRequest();
      const dto = {
        password: "defrferfre",
        email: "frferf",
      } as CreateUserDto;
      req.body = dto;
      const res = mockResponse();
      const next = mockNextFunction();

      const expectedRegisterResponse = new AppError(
        ErrorCodes.VALIDATION_ERROR,
        ErrorMessages.VALIDATION_ERROR
      );
      (userService.register as jest.Mock).mockResolvedValue(
        expectedRegisterResponse
      );

      // Act
      await UserController.registration(req, res, next);

      // Assert
      expect(next).toHaveBeenCalledWith(expectedRegisterResponse);
    });
    it("should handle errors in register, already have an account", async () => {
      // Arrange
      const req = mockRequest();
      const dto = {
        password: "defrferfre",
        email: "frferf@gmail.com",
      } as CreateUserDto;
      req.body = dto;
      const res = mockResponse();
      const next = mockNextFunction();

      const expectedRegisterResponse = new AppError(
        ErrorCodes.ALREADY_HAVE_AN_ACC,
        ErrorMessages.ALREADY_HAVE_AN_ACC
      );
      (userService.register as jest.Mock).mockResolvedValue(
        expectedRegisterResponse
      );

      // Act
      await UserController.registration(req, res, next);

      // Assert
      expect(next).toHaveBeenCalledWith(expectedRegisterResponse);
    });
  });

  describe("logout", () => {
    it("should remove entered cookie name", async () => {
      // Arrange
      const response = mockResponse();
      const next = mockNextFunction();

      // Act
      await userController.logout(mockRequest(), response, next);

      // Assert
      expect(response.clearCookie).toHaveBeenCalledWith("accessToken");
      expect(response.end).toHaveBeenCalled();
      expect(next).not.toHaveBeenCalled();
    });
    it("should remove entered cookie name", async () => {
      // Arrange
      const response = mockResponse();
      const next = mockNextFunction();
      mockClearCookie.mockImplementationOnce(() => {
        throw new Error("Clear cookie error");
      });

      // Act
      await userController.logout(mockRequest(), response, next);

      // Assert
      expect(next).toHaveBeenCalledWith(new Error("Clear cookie error"));
    });
  });

  describe("delete", () => {
    it("should delete user", async () => {
      // Arrange
      const id = "uuid";
      const req = mockRequest();
      req.user = { id: id };
      const res = mockResponse();
      const next = mockNextFunction();
      (userService.delete as jest.Mock).mockResolvedValue(undefined);

      // Act
      await userController.delete(req, res, next);

      // Assert
      expect(userService.delete).toBeCalledWith(id);
      expect(res.end).toBeCalled();
      expect(next).not.toBeCalled();
    });
    it("should throw validation error", async () => {
      // Arrange
      const id = 123;
      const req = mockRequest();
      req.user = { id: id };
      const res = mockResponse();
      const next = mockNextFunction();
      const deleteResponse = new AppError(
        ErrorCodes.VALIDATION_ERROR,
        ErrorMessages.VALIDATION_ERROR,
        []
      );
      (userService.delete as jest.Mock).mockResolvedValue(deleteResponse);

      // Act
      await userController.delete(req, res, next);

      // Assert
      expect(userService.delete).toBeCalledWith(id);
      expect(res.end).not.toBeCalled();
      expect(next).toBeCalledWith(deleteResponse);
    });
  });

  describe("login", () => {
    it("should login user", async () => {
      // Arrange
      const req = mockRequest();
      const res = mockResponse();
      const next = mockNextFunction();
      const dto = {
        password: "defrferfre",
        email: "frferf@gmail.com",
      } as LoginUserDto;
      req.body = dto;

      const expectedRegisterResponse = {
        accessToken: "token",
        user: {
          id: "uuid",
          email: "frferf@gmail.com",
        },
      };
      (userService.login as jest.Mock).mockResolvedValue(
        expectedRegisterResponse
      );

      // Act
      await UserController.login(req, res, next);

      // Assert
      expect(userService.login).toHaveBeenCalledWith(dto);
      expect(res.json).toHaveBeenCalledWith(expectedRegisterResponse);
    });
    it("should handle errors in register, non-valid email", async () => {
      // Arrange
      const req = mockRequest();
      const dto = {
        password: "defrferfre",
        email: "frferf",
      } as LoginUserDto;
      req.body = dto;
      const res = mockResponse();
      const next = mockNextFunction();

      const expectedRegisterResponse = new AppError(
        ErrorCodes.VALIDATION_ERROR,
        ErrorMessages.VALIDATION_ERROR
      );
      (userService.login as jest.Mock).mockResolvedValue(
        expectedRegisterResponse
      );

      // Act
      await UserController.login(req, res, next);

      // Assert
      expect(next).toHaveBeenCalledWith(expectedRegisterResponse);
    });
    it("should handle errors in register, dont have an account", async () => {
      // Arrange
      const req = mockRequest();
      const dto = {
        password: "defrferfre",
        email: "frferf@gmail.com",
      } as CreateUserDto;
      req.body = dto;
      const res = mockResponse();
      const next = mockNextFunction();

      const expectedRegisterResponse = new AppError(
        ErrorCodes.DONT_HAVE_SUCH_ACC,
        ErrorMessages.DONT_HAVE_SUCH_ACC
      );
      (userService.login as jest.Mock).mockResolvedValue(
        expectedRegisterResponse
      );

      // Act
      await UserController.login(req, res, next);

      // Assert
      expect(next).toHaveBeenCalledWith(expectedRegisterResponse);
    });
  });

  describe("update", () => {
    it("should update user", async () => {
      // Arrange
      const user = new User();
      user.id = 'uuid';
      user.email = 'frferf@gmail.com';

      const req = mockRequest();
      req.user = {id: user.id};
      const res = mockResponse();
      const next = mockNextFunction();
      const dto = {
        email: "newnew@gmail.com",
      } as UpdateUserDto;
      req.body = dto;

      const expectedRegisterResponse = new User();
      expectedRegisterResponse.id = user.id;
      expectedRegisterResponse.id = 'newnew@gmail.com';

      (userService.update as jest.Mock).mockResolvedValue(
        expectedRegisterResponse
      );

      // Act
      await UserController.update(req, res, next);

      // Assert
      expect(userService.update).toHaveBeenCalledWith(dto);
      expect(res.json).toHaveBeenCalledWith(expectedRegisterResponse);
    });
    it("should handle errors in register, non-valid email", async () => {
      // Arrange
      const user = new User();
      user.id = 'uuid';
      user.email = 'frferf@gmail.com';
      const req = mockRequest();
      req.user = {id: user.id};
      const res = mockResponse();
      const next = mockNextFunction();
      const dto = {
        email: "newnew",
      } as UpdateUserDto;
      req.body = dto;

      const expectedRegisterResponse = new AppError(
        ErrorCodes.VALIDATION_ERROR,
        ErrorMessages.VALIDATION_ERROR
      );
      (userService.update as jest.Mock).mockResolvedValue(
        expectedRegisterResponse
      );

      // Act
      await UserController.login(req, res, next);

      // Assert
      expect(next).toHaveBeenCalledWith(expectedRegisterResponse);
    });
  });
});
