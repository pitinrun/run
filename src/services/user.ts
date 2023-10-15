import { User } from '../models/user';
import { connectToDatabase } from '../utils';

connectToDatabase();

export const getUser = (userId: string) => {
  if (!userId) {
    return null;
  }
  return User.findOne(
    { userId },
    {
      password: 0,
      createdAt: 0,
      updatedAt: 0,
    }
  );
};

export const getUserById = (id: string) => {
  if (!id) {
    return null;
  }
  return User.findById(id, {
    password: 0,
  });
};
