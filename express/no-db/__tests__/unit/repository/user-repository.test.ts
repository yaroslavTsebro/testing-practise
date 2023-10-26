import { Repository, getRepository } from "typeorm";
import { User } from "../../../src/entity/db/model/user";
import UserRepository from "../../../src/repository/user-repository";

jest.mock("typeorm");

describe("UserRepository", () => {
  let mockRepository: jest.Mocked<Repository<User>>;

  beforeEach(() => {
    jest.clearAllMocks();
    mockRepository = {
      findOne: jest.fn(),
      softDelete: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
    } as any;

    (getRepository as jest.Mock).mockReturnValue(mockRepository);
  });

  describe("findById", () => {
    it("should find a user by their ID", async () => {
      const mockUser = new User();
      mockUser.id = '123'
      mockRepository.findOne.mockResolvedValue(mockUser);

      const result = await UserRepository.findById(mockUser.id);

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: mockUser.id },
      });
      expect(result).toBe(mockUser);
    });
  });

  describe('findByEmail', () => {
    it('should find a user by their email', async () => {
      const mockUser = new User();
      mockRepository.findOne.mockResolvedValue(mockUser);

      const result = await UserRepository.findByEmail('test@example.com');

      expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { email: 'test@example.com' } });
      expect(result).toBe(mockUser);
    });
  });

  describe('deleteById', () => {
    it('should soft delete a user by ID', async () => {
      await UserRepository.deleteById('123');
      expect(mockRepository.softDelete).toHaveBeenCalledWith('123');
    });
  });

  describe('update', () => {
    it('should update a user by their ID', async () => {
      const dto = { email: 'newnew@gmail.com' };
      await UserRepository.update(dto, '123');

      expect(mockRepository.update).toHaveBeenCalledWith('123', dto);
    });
  });

  describe('create', () => {
    it('should create a user', async () => {
      const dto = { password: 'ferfrfrefdwed32201p,', email: 'john@example.com' };
      const mockUser = new User();
      mockRepository.create.mockReturnValue(mockUser);
      mockRepository.save.mockResolvedValue(mockUser);

      const result = await UserRepository.create(dto);

      expect(mockRepository.create).toHaveBeenCalledWith(dto);
      expect(mockRepository.save).toHaveBeenCalledWith(mockUser);
      expect(result).toBe(mockUser);
    });
  });
});
