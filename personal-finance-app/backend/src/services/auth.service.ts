import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user.model';

export const register = async (name: string, password: string) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({ name, password: hashedPassword });
  return await user.save();
};

export const login = async (name: string, password: string) => {
  const user = await User.findOne({ name });
  if (!user) throw new Error('User not found');

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error('Invalid credentials');

  const token = jwt.sign({ id: user._id, name: user.name }, process.env.JWT_SECRET || 'default_secret', {
    expiresIn: '1h',
  });

  return { token, user };
};
