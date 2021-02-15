import { addErrorLoggingToSchema } from "apollo-server";

export const validateRegisterInput = (
  username,
  email,
  gender,
  password,
  confirmPassword
) => {
  const errors = {};

  if (username.trim() === "" || username.length < 6) {
    errors.username = "Username must contain at least 6 characters";
  }

  if (email.trim() === "") {
    errors.email = "Email must not be empty";
  } else {
    const regEx = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

    if (!email.match(regEx)) {
      errors.email = "Email must be a valid email address";
    }
  }

  if (gender.trim() === "") {
    errors.gender = "Gender must not be empty";
  }

  if (password === "" || password.length < 8) {
    errors.password = "Password must contain at least 8 characters";
  } else if (password !== confirmPassword) {
    errors.confirmPassword = "Password do not match";
  }

  return {
    errors,
    valid: Object.keys(errors).length < 1,
  };
};

export const validateLoginInput = (username, password) => {
  const errors = {};
  if (username.trim() === "") {
    errors.username = "Username must not be empty";
  }

  if (password.trim() === "") {
    errors.password = "Password must not be empty";
  }

  return {
    errors,
    valid: Object.keys(errors).length < 1,
  };
};
