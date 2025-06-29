const express = require("express");
const { authorized } = require("../middleware/auth");
const favoriteRecipeValidation = require("../utils/favoriteRecipeValidation");
const favoriteRecipe = require("../models/favoriteRecipe");

const router = express.Router();

router.post("/favorite/recipe/save", authorized, async (req, res) => {
  try {
    favoriteRecipeValidation(req);

    const { title, image, id } = req.body;
    const loggedInUser = res.user;

    const data = await favoriteRecipe({
      id,
      title,
      image,
      email: loggedInUser.email,
    });

    await data.save();

    res.send(data);
  } catch (err) {
    return res.status(401).send({ message: err.message });
  }
});
