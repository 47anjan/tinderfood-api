const express = require("express");
const { authorized } = require("../middleware/auth");
const favoriteRecipeValidation = require("../utils/favoriteRecipeValidation");
const FavoriteRecipe = require("../models/favoriteRecipe");

const router = express.Router();

router.post("/favorite/recipe/add", authorized, async (req, res) => {
  try {
    favoriteRecipeValidation(req);

    const { title, image, id } = req.body;
    const loggedInUser = res.user;

    const existRecipe = await FavoriteRecipe.findOne({
      id,
      userId: loggedInUser._id,
    });

    if (existRecipe) {
      res.status(401).send({ message: "Recipe is already exist on the list" });
    }

    const data = await FavoriteRecipe({
      id,
      title,
      image,
      userId: loggedInUser._id,
    });

    await data.save();

    res.send(data);
  } catch (err) {
    return res.status(401).send({ message: err.message });
  }
});

router.get(
  "/favorite/recipe/:favoriteRecipeId",
  authorized,
  async (req, res) => {
    try {
      const { favoriteRecipeId } = req.params;
      const loggedInUser = res.user;

      if (!favoriteRecipeId) {
        res.status(401).send({ message: "Recipe Id cant be empty" });
      }

      const recipe = await FavoriteRecipe.findOne({
        id: favoriteRecipeId,
        userId: loggedInUser._id,
      });

      if (!recipe) {
        throw new Error("Recipe does not exist!");
      }

      res.send(recipe);
    } catch (err) {
      return res.status(401).send({ message: err.message });
    }
  }
);
router.delete(
  "/favorite/recipe/remove/:favoriteRecipeId",
  authorized,
  async (req, res) => {
    try {
      const { favoriteRecipeId } = req.params;
      const loggedInUser = res.user;

      if (!favoriteRecipeId) {
        res.status(401).send({ message: "Recipe Id cant be empty" });
      }

      const recipe = await FavoriteRecipe.findOne({
        id: favoriteRecipeId,
        userId: loggedInUser._id,
      });

      if (!recipe) {
        throw new Error("Recipe does not exist!");
      }

      const data = await recipe.deleteOne();

      res.send(data);
    } catch (err) {
      return res.status(401).send({ message: err.message });
    }
  }
);

module.exports = router;
