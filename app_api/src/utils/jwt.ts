import * as jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';

dotenv.config();
const secret = process.env.JWT_SECRET ?? '3N2pX9z5vuBgH6JrLdqRwE8sYcGmD4Tn';

export function generateToken (payload: {_id: string}) {
  return jwt.sign({id: payload._id}, secret , { expiresIn: '7d' });
}

export function validateToken (tokenWithBearer:string) {
  const token = tokenWithBearer.split(" ")[1];
  return jwt.verify(token, secret, (err, decoded) => {
    if(err) {
      console.error(err);
      throw new Error('Invalid token');
    }
    return decoded;
  }); 
}