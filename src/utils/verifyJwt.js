import jwt from 'jsonwebtoken';

export const verifyJwt = request => {
  const authHeader = request.header('Authorization');
  const token = authHeader ? authHeader.replace('Bearer ', '') : '';
  console.log(authHeader);
  return new Promise((resolve, reject) => {
    jwt.verify(token, 'secret', (error, decoded) => {
      if (error) reject('401: User is not authenticated')
      resolve({ data: decoded, token });
    })
  })
}