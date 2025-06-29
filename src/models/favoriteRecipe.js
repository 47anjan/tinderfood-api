const mongoose = require("mongoose");
const validate = require("validator");

const favoriteRecipeSchema = new mongoose.Schema(
  {
    id: {
      type: mongoose.Schema.Types.String,
      required: true,
    },
    title: {
      type: mongoose.Schema.Types.String,
    },
    image: {
      type: mongoose.Schema.Types.String,
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
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("FavoriteRecipe", favoriteRecipeSchema);
