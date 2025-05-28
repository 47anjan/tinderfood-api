const validate = require("validator");

const signupValidation = (req) => {
  const {
    username,
    email,
    password,
    avatar,
    cuisinePreferences,
    favoriteFoods,
    dietaryRestrictions,
  } = req.body;

  if (!username || username.length < 3 || username.length > 30) {
    throw new Error("Username must be between 3 and 30 characters long");
  }

  if (!validate.isEmail(email)) {
    throw new Error("Invalid email format");
  }

  if (!password || password.length < 6) {
    throw new Error("Password must be at least 6 characters long");
  }

  if (avatar && validate.isURL(avatar) === false) {
    throw new Error("Avatar must be a valid URL");
  }

  if (cuisinePreferences && cuisinePreferences.length > 50) {
    throw new Error("Cuisine preferences must not exceed 50 items");
  }
  if (favoriteFoods && favoriteFoods.length > 50) {
    throw new Error("Favorite foods must not exceed 50 items");
  }
  if (dietaryRestrictions && dietaryRestrictions.length > 50) {
    throw new Error("Dietary restrictions must not exceed 50 items");
  }
};

module.exports = signupValidation;
