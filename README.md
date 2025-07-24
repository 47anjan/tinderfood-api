# 🍔 TinderFood API

**TinderFood API** is the backend service powering the TinderFood application—an AI-enhanced social platform for discovering recipes and connecting with other food lovers. This API handles user authentication, recipe management, social connections, and real-time chat.

## 🚀 Features

- **User Authentication** (JWT-based)
- **User Profiles & Preferences**
- **Save Favorite Recipes**
- **Friend Requests & Connections**
- **Real-Time Chat** (via WebSocket)
- **RESTful API for Recipe Management**
- **MongoDB Data Modeling with Mongoose**

## 🛠 Tech Stack

- **Node.js**
- **Express.js**
- **MongoDB** with **Mongoose**
- **JWT** for authentication
- **WebSocket (Socket.io)** for real-time chat
- **Environment Variables** for config management

## 📂 Project Structure

```
tinderfood-api/
├── .env                   # Environment variables
├── package.json           # Project metadata and dependencies
├── src/
│   ├── app.js             # Main Express app
│   ├── config/            # DB configuration
│   │   └── database.js
│   ├── middleware/        # JWT Auth middleware
│   │   └── auth.js
│   ├── models/            # Mongoose data models
│   │   ├── user.js
│   │   ├── chat.js
│   │   ├── connectionRequest.js
│   │   └── favoriteRecipe.js
│   ├── routes/            # API route handlers
│   │   ├── auth.js
│   │   ├── user.js
│   │   ├── users.js
│   │   ├── profile.js
│   │   ├── request.js
│   │   ├── favorite.js
│   │   └── chat.js
│   └── utils/             # Validation and helper functions
│       ├── socket.js
│       ├── signupValidation.js
│       ├── loginValidation.js
│       └── validateEditProfile.js
```

## 📦 Installation

1. **Clone the repository**

```bash
git clone https://github.com/47anjan/tinderfood-api.git
cd tinderfood-api
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**
   Create a `.env` file in the root directory:

```env
PORT=5000
DB_CONNECTION=your_mongo_connection_string
JTW_SECRET=your_jwt_secret
```

4. **Start the server**

```bash
node src/app.js
```

Server will start on `http://localhost:5000`

## 🧪 API Endpoints

A full list of endpoints is available in the routes, but here's a quick overview:

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

## 🔐 Auth Middleware

All protected routes use the `auth.js` middleware to verify JWT tokens and ensure only authenticated users can access sensitive data.

## 🧠 Models

- **User**: Basic info + cooking preferences & dietary restrictions
- **FavoriteRecipe**: Stores user-saved recipes with recipe metadata
- **ConnectionRequest**: Handles friend system with interest/accepted states
- **Chat**: Real-time messaging structure with embedded messages

## 🗨️ WebSocket (Chat)

- Real-time connection established upon login
- Rooms for 1-to-1 messaging between connected users
- Socket events include: `sendMessage`, `receiveMessage`, `startTyping`, `stopTyping`, `messageNotification`
- User registration system for push notifications

## 📄 License

ISC License

## ✉️ Contact

Have feedback or ideas? Reach out at [your-email@example.com]

---

_Built with ❤️ for food lovers everywhere! 🍕🍜🥘_
