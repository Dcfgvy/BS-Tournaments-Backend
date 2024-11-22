import { Faker } from "@faker-js/faker";
import { setSeederFactory } from "typeorm-extension";
import { User } from "../entities/User.entity";
import { hashPassword } from "../../utils/bcrypt";
import { appConfig } from "../../utils/appConfigs";

export const UserFactory = setSeederFactory(User, (faker: Faker) => {
  const user = new User();

  user.tag = `#${faker.word.noun(6).toUpperCase() + String(new Date().getMilliseconds())}`;
  user.name = faker.person.fullName();
  user.password = hashPassword(appConfig.DB_SEED_USER_PASSWORD);
  user.balance = faker.number.int({ min: 0, max: 1000});
  user.language = faker.number.int(1) ? 'en' : 'ru';
  user.ip = 'localhost';

  return user;
});