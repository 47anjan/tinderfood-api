- **Auth**

  - `POST /api/signup`
  - `POST /api/login`
  - `POST /api/logout`

- **Profile**

  - `GET /api/profile/view`
  - `PATCH /api/profile/edit`

- **User Discovery**

  - `GET /api/users` – discover other foodies
  - `GET /api/users/:userId` – get user profile

- **Recipes**

  - `POST /api/favorite/recipe/add`
  - `GET /api/favorite/recipe/:favoriteRecipeId`
  - `DELETE /api/favorite/recipe/remove/:favoriteRecipeId`
  - `GET /api/user/favoriteRecipes`

- **Social**

  - `POST /api/request/send/:status/:toUserId` – send connection request
  - `POST /api/request/review/:status/:requestId` – accept request
  - `DELETE /api/request/review/:status/:requestId` – remove connection
  - `GET /api/user/requests/received`
  - `GET /api/user/requests/pending`
  - `GET /api/user/connections`

- **Chat**
  - `GET /api/chat/:toUserId` – get or create chat
