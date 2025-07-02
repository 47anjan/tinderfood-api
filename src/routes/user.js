const express = require("express");
const { authorized } = require("../middleware/auth");
const ConnectionRequest = require("../models/connectionRequest");
const favoriteRecipe = require("../models/favoriteRecipe");

const router = express.Router();

const profileInfo = [
  "name",
  "email",
  "username",
  "cookingLevel",
  "avatar",
  "bio",
];

const fullProfileInfo = [
  "name",
  "email",
  "username",
  "cookingLevel",
  "avatar",
  "bio",
  "dietaryRestrictions",
  "favoriteFoods",
  "cuisinePreferences",
  "createdAt",
  "location",
];

router.get("/user/requests/received", authorized, async (req, res) => {
  try {
    const loggedInUserId = res.user._id;

    const data = await ConnectionRequest.find({
      toUserId: loggedInUserId,
      status: "interested",
    }).populate("fromUserId", profileInfo);

    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get("/user/requests/pending", authorized, async (req, res) => {
  try {
    const loggedInUserId = res.user._id;

    const data = await ConnectionRequest.find({
      fromUserId: loggedInUserId,
      status: "interested",
    }).populate("toUserId", profileInfo);

    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get("/user/connections", authorized, async (req, res) => {
  try {
    const loggedInUserId = res.user._id;

    const data = await ConnectionRequest.find({
      $or: [
        { toUserId: loggedInUserId, status: "accepted" },
        { fromUserId: loggedInUserId, status: "accepted" },
      ],
    })
      .populate("toUserId", fullProfileInfo)
      .populate("fromUserId", fullProfileInfo);

    const user = data.map((con) => {
      if (con.fromUserId._id.toString() === loggedInUserId.toString())
        return con.toUserId;
      return con.fromUserId;
    });

    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get("/user/favoriteRecipes", authorized, async (req, res) => {
  try {
    const loggedInUser = res.user;

    const data = await favoriteRecipe.find({
      userId: loggedInUser._id,
    });

    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
