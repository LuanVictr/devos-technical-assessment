import * as jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';

dotenv.config();
const secret = process.env.JWT_SECRET ?? '3N2pX9z5vuBgH6JrLdqRwE8sYcGmD4Tn';

export function generateToken (payload: {_id: string}) {
  return jwt.sign({id: payload._id}, secret , { expiresIn: '7d' });
}

export function validateToken(tokenWithBearer: string): string {
  const token = tokenWithBearer.split(" ")[1];
  try {
      const decoded: any = jwt.verify(token, secret);
      return decoded.id;
  } catch (error) {
      console.error(error);
      throw new Error('Invalid token');
  }
}