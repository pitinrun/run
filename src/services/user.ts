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
      _id: 0,
      password: 0,
      createdAt: 0,
      updatedAt: 0,
    }
  );
};
