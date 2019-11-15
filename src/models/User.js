import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import findOrCreate from 'find-or-create';

dotenv.config({ silent: process.env.NODE_ENV === 'production' });

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    validate: value => {
      if (!validator.isEmail(value)) {
        throw new Error({ error: 'Invalid email address' });
      }
    }
  },
  userId: String,
  password: {
    type: String,
    required: true,
    minlength: 7,
  },
  tokens: [{
    token: {
      type: String,
      required: true,
    }
  }],
});

UserSchema.pre('save', async function (next) {
  const user = this;
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

UserSchema.methods.generateAuthToken = async function() {
  const user = this;
  const token = jwt.sign(
    { _id: user._id },
    process.env.SECRET,
    {
      expiresIn: 2592000 // 30 days in seconds
    });
  user.tokens = user.tokens.concat({ token });
  await user.save();
  return token;
}

UserSchema.statics.findOrCreate = findOrCreate;

UserSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error({ error: 'Invalid login credentials' });
  }
  const isPasswordMatch = await bcrypt.compare(password, user.password);
  if (!isPasswordMatch) {
    throw new Error({ error: 'Invalid login credentials' });
  }
  return user;
}

const User = mongoose.model('user', UserSchema);

export default User;