
import { AppDataSource } from '@/data-source';
import { User } from '../entities/User.entity';

export const UserRepository = AppDataSource.getRepository(User).extend({
  async findByEmail(email: string): Promise<User | null> {
    return this.createQueryBuilder('user')
      .where('user.userEmail = :userEmail', { email })
      .addSelect('user.password')
      .getOne();
  },

  async findByIdWithPassword(id: string): Promise<User | null> {
    return this.createQueryBuilder('user')
      .where('user.id = :id', { id })
      .addSelect('user.password')
      .getOne();
  },
});
