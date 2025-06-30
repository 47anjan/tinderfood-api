const mongoose = require("mongoose");

const favoriteRecipeSchema = new mongoose.Schema(
  {
    id: {
      type: mongoose.Schema.Types.String,
    },
    title: {
      type: mongoose.Schema.Types.String,
    },
    image: {
      type: mongoose.Schema.Types.String,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

favoriteRecipeSchema.index({ userId: 1, id: 1 });

module.exports = mongoose.model("FavoriteRecipe", favoriteRecipeSchema);
