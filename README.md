# ZAD Social

ZAD Social is a full-stack social media application built with a React frontend and an Express backend, featuring real-time chat functionality and a modern UI using Chakra UI.

## Table of Contents

- [ZAD Social](#zad-social)
  - [Table of Contents](#table-of-contents)
  - [Feature List](#feature-list)
  - [Project Structure](#project-structure)
  - [Frontend](#frontend)
    - [Dependencies](#dependencies)
    - [Development](#development)
  - [Backend](#backend)
    - [Dependencies](#dependencies-1)
    - [Development](#development-1)
  - [License](#license)

## Feature List

🌟 Tech stack: MERN + Socket.io + Chakra UI  
🎃 Authentication & Authorization with JWT  
📝 Create Post  
🗑️ Delete Post  
❤️ Like/Unlike Post  
💬 Comment on a Post  
👥 Follow/Unfollow Users  
❄️ Freeze Your Account  
🌓 Dark/Light Mode  
📱 Completely Responsive  
💬 Chat App With Image Support  
👀 Seen/Unseen Status for Messages  
🔊 Notification Sounds  
⭐ Deployment for FREE  

## Project Structure

project-root/
│
├── frontend/
│ ├── package.json
│ └── ...
│
└── backend/
│
├── package.json
└── Models
├── Conversation Model
├── Message Model
├── User Model
└── Post Model
└── Controllers
├── User Controller
├── Message Controller
└── Post Controller
└── Routes
├── User Route
├── Message Route
└── Post Route
└── Utils
└── Middlewares
└── Database
│
├── package.json         <-- Root package.json (for overall project)
└── Dockerfile           <-- Dockerfile for building and running the application
## Frontend

The frontend of ZAD Social is built using React and Vite. It utilizes Chakra UI for styling and Recoil for state management.

### Dependencies

The frontend has the following dependencies:

- `@chakra-ui/icons`: ^2.1.1
- `@chakra-ui/react`: ^2.8.2
- `@emotion/react`: ^11.11.4
- `@emotion/styled`: ^11.11.0
- `date-fns`: ^3.6.0
- `framer-motion`: ^11.0.20
- `react`: ^18.2.0
- `react-dom`: ^18.2.0
- `react-icons`: ^5.0.1
- `react-router-dom`: ^6.22.3
- `recoil`: ^0.7.7

Development dependencies:

- `@types/react`: ^18.2.66
- `@types/react-dom`: ^18.2.22
- `@vitejs/plugin-react`: ^4.2.1
- `eslint`: ^8.57.0
- `eslint-plugin-react`: ^7.34.1
- `eslint-plugin-react-hooks`: ^4.6.0
- `eslint-plugin-react-refresh`: ^0.4.6
- `vite`: ^5.2.0

### Development

To get started with the frontend, follow these steps:

1. Navigate to the `frontend` directory:

    ```sh
    cd frontend
    ```

2. Install the dependencies:

    ```sh
    npm install
    ```

3. Run the development server:

    ```sh
    npm run dev
    ```

4. To build the project for production:

    ```sh
    npm run build
    ```

5. To preview the production build:

    ```sh
    npm run preview
    ```

## Backend

The backend of ZAD Social is built using Express and MongoDB, with JWT for authentication and Cloudinary for image uploads.

### Dependencies

The backend has the following dependencies:

- `bcryptjs`: ^2.4.3
- `cloudinary`: ^2.2.0
- `cookie-parser`: ^1.4.6
- `cors`: ^2.8.5
- `dotenv`: ^16.4.5
- `express`: ^4.19.2
- `jsonwebtoken`: ^9.0.2
- `mongodb`: ^6.5.0
- `mongoose`: ^8.2.4
- `nodemon`: ^3.1.0

### Development

To get started with the backend, follow these steps:

1. Navigate to the `backend` directory:

    ```sh
    cd backend
    ```

2. Install the dependencies:

    ```sh
    npm install
    ```

3. Create a `.env` file in the `backend` directory and add your environment variables:

    ```sh
    touch .env
    ```

    Example `.env` file:

    ```env
    PORT=5000
    MONGODB_URI=your_mongodb_uri
    JWT_SECRET=your_jwt_secret
    CLOUDINARY_CLOUD_NAME=your_cloud_name
    CLOUDINARY_API_KEY=your_api_key
    CLOUDINARY_API_SECRET=your_api_secret
    ```

4. Start the development server:

    ```sh
    npm start
    ```

## License

This project is licensed under the ISC License.
