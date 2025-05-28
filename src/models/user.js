const mongoose = require("mongoose");
const validate = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: 2,
      maxLength: 50,
    },
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true, // Normalize case to prevent "John" vs "john" issues
      minlength: 3,
      maxLength: 30,
      validate: {
        validator: function (value) {
          // Optional: Add custom validation for username format
          return /^[a-zA-Z0-9_]+$/.test(value);
        },
        message: "Username can only contain letters, numbers, and underscores",
      },
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate: {
        validator: (value) => validate.isEmail(value),
        message: "Invalid email format",
      },
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    avatar: {
      type: String,
      default:
        "https://cdn.vectorstock.com/i/500p/92/16/default-profile-picture-avatar-user-icon-vector-46389216.jpg",
    },
    bio: {
      type: String,
      maxLength: 500,
      trim: true,
    },
    location: {
      city: String,
      country: String,
    },
    cookingLevel: {
      type: String,
      enum: ["beginner", "intermediate", "advanced", "professional"],
      default: "beginner",
    },
    dietaryRestrictions: {
      type: [String],
      default: [],
      validate: {
        validator: (value) => value.length <= 50,
        message: "Dietary restrictions must not exceed 50 items",
      },
    },
    favoriteFoods: {
      type: [String],
      default: [],
      validate: {
        validator: (value) => value.length <= 50,
        message: "Favorite foods must not exceed 50 items",
      },
    },
    cuisinePreferences: {
      type: [String],
      default: [],
      validate: {
        validator: (value) => value.length <= 50,
        message: "Cuisine preferences must not exceed 50 items",
      },
    },
  },
  {
    timestamps: true,
  }
);

userSchema.methods.getJWT = async function () {
  const user = this;

  const token = jwt.sign(
    { _id: user._id },
    "16d74673bc7728c75ac00ad0633225f4a2a3ea1086216abf04267c8756f1a210",
    {
      expiresIn: "30d",
    }
  );

  return token;
};

userSchema.methods.validatePassword = async function (passwordInputByUser) {
  const user = this;

  const isMatch = await bcrypt.compare(passwordInputByUser, user.password);

  return isMatch;
};

// userSchema.index({ username: 1 });
const User = mongoose.model("User", userSchema);

module.exports = User;
