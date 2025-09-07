import 'express';
import { UserExceptPassword } from '../auth/auth.service';

declare global {
  namespace Express {
    interface Request {
      user: UserExceptPassword;
    }
  }
}
