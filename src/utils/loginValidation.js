const validate = require("validator");

const loginValidation = (req) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new Error("Email and password are required");
  }

  if (!validate.isEmail(email)) {
    throw new Error("Invalid email format");
  }

  if (!password || password.length < 6) {
    throw new Error("Password must be at least 6 characters long");
  }
};

module.exports = loginValidation;
