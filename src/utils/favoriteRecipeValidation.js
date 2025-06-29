const favoriteRecipeValidation = (req) => {
  const { title, id, image } = req.body;

  if (!title) {
    throw new Error("Title cant be empty");
  }
  if (!id) {
    throw new Error("Id cant be empty");
  }
  if (!image) {
    throw new Error("Image cant be empty");
  }
};

module.exports = favoriteRecipeValidation;
