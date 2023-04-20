import Feedback from "../models/feedback";
import User, { UserCreationAttributes } from "../models/user";
import { hash, genSalt } from "bcryptjs";

export default class UserService {
  async createUser(data: UserCreationAttributes) {
    const feedback = new Feedback<User>();
    try {
      const emailExists = await User.findOne({ where: { email: data.email } });

      if (emailExists) {
        feedback.success = false;
        feedback.message = "Email already exists";
        return feedback;
      }

      const salt = await genSalt(10);
      const password = await hash(data.password, salt);
      const user = await User.create({
        firstname: data.firstname,
        lastname: data.lastname,
        email: data.email,
        role: data.role,
        password,
      });

      feedback.data = user;
    } catch (error) {
      feedback.success = false;
      feedback.message = "We were unable to process your request";
      console.log(error);
    }
    return feedback;
  }

  getUsers() {}
  updateUser() {}
  deleteUser() {}
}
