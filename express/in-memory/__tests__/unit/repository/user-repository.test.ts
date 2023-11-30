import { faker } from "@faker-js/faker";
import userRepository from "../../../src/repository/user-repository";
import connectToDB from "../__helpers__/setup-db";
import { createConnection } from "typeorm";
import { User } from "../../../src/entity/db/model/user";

describe("UserRepository", () => {

  // beforeAll( async () => {
    
  // });


  // describe("findById", () => {
  //   it("should find a user by their ID", async () => {
  //     const mockUser = new User();
  //     mockUser.id = "123";
  //     mockRepository.findOne.mockResolvedValue(mockUser);

  //     const result = await UserRepository.findById(mockUser.id);

  //     expect(mockRepository.findOne).toHaveBeenCalledWith({
  //       where: { id: mockUser.id },
  //     });
  //     expect(result).toBe(mockUser);
  //   });
  // });

  // describe("findByEmail", () => {
  //   it("should find a user by their email", async () => {
  //     const mockUser = new User();
  //     mockUser.email = "test@example.com";
  //     mockRepository.findOne.mockResolvedValue(mockUser);

  //     const result = await UserRepository.findByEmail("test@example.com");

  //     expect(mockRepository.findOne).toHaveBeenCalledWith({
  //       where: { email: "test@example.com" },
  //     });
  //     expect(result).toBe(mockUser);
  //   });
  // });

  // describe("deleteById", () => {
  //   it("should soft delete a user by ID", async () => {
  //     await UserRepository.deleteById("123");
  //     expect(mockRepository.softDelete).toHaveBeenCalledWith("123");
  //   });
  // });

  // describe("update", () => {
  //   it("should update a user by their ID", async () => {
  //     const dto = { email: "newnew@gmail.com" };
  //     await UserRepository.update(dto, "123");

  //     expect(mockRepository.update).toHaveBeenCalledWith("123", dto);
  //   });
  // });

  describe("create", () => {
    it("should create a user", async () => {
      //Arrange
      await createConnection({
        type: "better-sqlite3",
        database: ":memory:",
        entities: [User],
        logging: true,
        synchronize: true,
      });
      const dto = {
        password: faker.internet.password(),
        email: faker.internet.email(),
      };

      //Act
      const user = await userRepository.create(dto);

      //Assert
      expect(user.email).toEqual(dto.email);
      expect(user.password).toEqual(dto.password);
    });
  });
});
