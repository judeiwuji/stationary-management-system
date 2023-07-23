import { Roles } from '../models/role';
import UserService from '../services/user.service';

export default async function installer() {
  const userService = new UserService();
  try {
    await userService.findUserBy({ role: Roles.ADMIN });
    return;
  } catch (error) {
    // continue
  }

  await userService.createUser({
    email: 'admin@app.com',
    firstname: 'admin',
    lastname: 'superadmin',
    password: 'admin',
    role: Roles.ADMIN,
  });
}
