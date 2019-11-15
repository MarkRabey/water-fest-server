import User from '../models/User';
import { verifyJwt } from '../utils/verifyJwt';

export default async (request, response, next) => {
  try {
    const { data, token } = await verifyJwt(request);
    const user = await User.findOne({ _id: data._id, 'tokens.token': token });
    if (!user) {
      throw new Error();
    }
    request.user = user;
    request.token = token;
    next();
  } catch (error) {
    console.log(error);
    response.status(403).json({
      error: 'Not authorized to access this resource',
    });
  }
}