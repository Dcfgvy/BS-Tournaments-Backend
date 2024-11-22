import { User } from "../database/entities/User.entity";

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}
