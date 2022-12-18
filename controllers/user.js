import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import User from '../models/user.js';

export const signin = async (req, res) => {
  const { email, password } = req.body;
  try {
    // extensionUser =====
    const extensionUser = await User.findOne({ email });
    if (!extensionUser)
      return res.status(404).json({ message: `User doesn't exis.` });

    // isPasswordCorrect =====
    const isPasswordCorrect = await bcrypt.compare(
      password,
      extensionUser.password
    );
    if (!isPasswordCorrect)
      return res.status(400).json({ message: `Invalid credentials.` });

    // token =====
    const token = jwt.sign(
      { email: extensionUser.email, id: extensionUser._id },
      'test',
      { expiresIn: '1h' }
    ); //!test

    res.status(200).json({ result: extensionUser, token });
  } catch (error) {
    res.status(500).json({ message: `Something went wrong` });
  }
};

export const signup = async (req, res) => {
  const { email, password, confirmPassword, firstName, lastName } = req.body;

  try {
    // extensionUser =====
    const extensionUser = await User.findOne({ email });
    if (extensionUser)
      return res.status(400).json({ message: `User already exists.` });

    if (password !== confirmPassword)
      return res.status(400).json({ message: `Password don't match.` });

    const hashedPassword = await bcrypt.hash(password, 12);

    const result = await User.create({
      email,
      password: hashedPassword,
      name: `${firstName} ${lastName}`,
      firstName,
      lastName,
    });

    // token =====
    const token = jwt.sign({ email: result.email, id: result._id }, 'test', {
      expiresIn: '1h',
    }); //!test

    res.status(200).json({ result, token });
  } catch (error) {
    res.status(500).json({ message: `Something went wrong` });
  }
};
