import { User } from "../typeorm/entities/User.entity";

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}
