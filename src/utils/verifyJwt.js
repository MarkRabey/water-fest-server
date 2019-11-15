import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config({ silent: process.env.NODE_ENV === 'production' });

export const verifyJwt = request => {
  const authHeader = request.header('Authorization');
  const token = authHeader ? authHeader.replace('Bearer ', '') : '';
  console.log(authHeader);
  return new Promise((resolve, reject) => {
    jwt.verify(token, process.env.SECRET, (error, decoded) => {
      if (error) reject('401: User is not authenticated')
      resolve({ data: decoded, token });
    })
  })
}