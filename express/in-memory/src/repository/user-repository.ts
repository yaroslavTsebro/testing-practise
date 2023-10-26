import { getRepository, Repository } from 'typeorm';
import { User } from '../entity/db/model/user';
import { CreateUserDto } from '../entity/dto/create-user-dto';
import { UpdateUserDto } from '../entity/dto/update-user-dto';

/**
 * Repository class for handling operations related to the User entity.
 */
class UserRepository {
  private userRepository: Repository<User>;

  /**
   * Constructor initializes the user repository.
   */
  constructor() {
    this.userRepository = getRepository(User);
  }

  /**
   * Finds a user by their ID.
   * 
   * @param {string} id - The ID of the user to find.
   * @returns {Promise<User|null>} - The user if found, otherwise null.
   */
  public async findById(id: string): Promise<User | null> {
    try {
      return await this.userRepository.findOne({ where: { id: id } });
    } catch (e) {
      console.error('Occurred in user repository', e);
      throw e;
    }
  }

  /**
   * Finds a user by their email address.
   * 
   * @param {string} email - The email address of the user to find.
   * @returns {Promise<User|null>} - The user if found, otherwise null.
   */
  public async findByEmail(email: string): Promise<User | null> {
    try {
      return await this.userRepository.findOne({ where: { email: email } });
    } catch (e) {
      console.error('Error occurred in user repository', e);
      throw e;
    }
  }

  /**
   * Soft deletes a user by their ID.
   * 
   * @param {string} id - The ID of the user to delete.
   * @returns {Promise<void>}
   */
  public async deleteById(id: string): Promise<void> {
    try {
      await this.userRepository.softDelete(id);
    } catch (e) {
      console.error('Occurred in user repository', e);
      throw e;
    }
  }

  /**
   * Creates a new user.
   * 
   * @param {CreateUserDto} dto - Data transfer object containing user creation data.
   * @returns {Promise<User>} - The created user entity.
   */
  public async create(dto: CreateUserDto): Promise<User> {
    try {
      const user = this.userRepository.create(dto);
      return await this.userRepository.save(user);
    } catch (e) {
      console.error('Occurred in user repository', e);
      throw e;
    }
  }

  /**
   * Updates an existing user.
   * 
   * @param {UpdateUserDto} dto - Data transfer object containing user update data.
   * @param {string} id - The ID of the user to update.
   * @returns {Promise<void>}
   */
  public async update(dto: UpdateUserDto, id: string): Promise<void> {
    try {
      await this.userRepository.update(id, dto);
    } catch (e) {
      console.error('Occurred in user repository', e);
      throw e;
    }
  }
}

export default new UserRepository();
