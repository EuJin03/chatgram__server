import bcrypt from "bcryptjs";
import { UserInputError } from "apollo-server";

import User from "../../model/User.js";
import generateToken from "../../utils/generateToken.js";
import {
  validateRegisterInput,
  validateLoginInput,
} from "../../utils/validators.js";

export default {
  Mutation: {
    login: async (_, { username, password }, context, info) => {
      const { errors, valid } = validateLoginInput(username, password);

      if (!valid) {
        throw new UserInputError("Errors", { errors });
      }

      const user = await User.findOne({ username });

      if (!user) {
        errors.general = "User not found";
        throw new UserInputError("User not found", { errors });
      }

      const match = await bcrypt.compare(password, user.password);

      if (!match) {
        errors.general = "Username or password is incorrect";
        throw new UserInputError("Username or password is incorrect", {
          errors,
        });
      }

      const token = generateToken(user);

      return {
        ...user._doc,
        id: user._id,
        token,
      };
    },
    register: async (
      _,
      { registerInput: { username, email, gender, password, confirmPassword } },
      context,
      info
    ) => {
      // TODO: Validate user data
      const { valid, errors } = validateRegisterInput(
        username,
        email,
        gender,
        password,
        confirmPassword
      );
      if (!valid) {
        throw new UserInputError("Errors", { errors });
      }

      // TODO: Make sure user does not already exist
      const userExist = await User.findOne({ username });
      const emailExist = await User.findOne({ email });

      if (userExist) {
        throw new UserInputError("Username is already taken", {
          errors: {
            username: "This username is already taken",
          },
        });
      }

      if (emailExist) {
        throw new UserInputError("Email is already taken", {
          errors: {
            email: "This email is already taken",
          },
        });
      }

      // TODO: hash password and create auth token
      password = await bcrypt.hash(password, 12);

      const newUser = new User({
        email,
        username,
        gender,
        password,
      });

      const res = await newUser.save();

      const token = generateToken(res);

      return {
        ...res._doc,
        id: res._id,
        token,
      };
    },
  },
};
