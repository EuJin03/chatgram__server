import jwt from "jsonwebtoken";

const generateToken = user => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      username: user.username,
      gender: user.gender,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "15d",
    }
  );
};

export default generateToken;
