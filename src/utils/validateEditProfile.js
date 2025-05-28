const validate = require("validator");

const profileEditPermission = [
  "name",
  "username",
  "bio",
  "location",
  "avatar",
  "cookingLevel",
  "dietaryRestrictions",
  "favoriteFoods",
  "cuisinePreferences",
];

const editCookingLevel = [
  "beginner",
  "intermediate",
  "advanced",
  "professional",
];

const validateEditProfile = (req) => {
  const {
    avatar,
    cuisinePreferences,
    favoriteFoods,
    dietaryRestrictions,
    name,
    username,
    cookingLevel,
  } = req.body;

  const hasEditPermission = Object.keys(req.body).every((key) =>
    profileEditPermission.includes(key)
  );

  if (!hasEditPermission) {
    throw new Error("Profile edit permission denied");
  }

  if (!editCookingLevel.includes(cookingLevel)) {
    throw new Error("Invalid cooking level");
  }

  if (!username || username.length < 3 || username.length > 30) {
    throw new Error("Username must be between 3 and 30 characters long");
  }
  if (!name) {
    throw new Error("Name cant be empty");
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

module.exports = validateEditProfile;
