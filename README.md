# Social Media REST API  

This repository contains a fully functional **Social Media REST API** built with **Node.js**, **Express.js**, and **MongoDB**. It supports core social media functionalities, from basic CRUD operations to advanced features like user authentication, story uploads, messaging, and more.

---

## **Features**
- **User Authentication**: Secure user login/signup using **JWT**.  
- **CRUD Operations**: Create, Read, Update, and Delete posts, comments, and other entities.  
- **Image & Story Uploads**: Users can upload images and stories with file handling.  
- **Messaging System**: Real-time messaging functionality for user interaction.  
- **Likes & Comments**: Like and comment on posts seamlessly.  
- **Blocking Functionality**: Block/unblock users to maintain user privacy.  
- **Secure Routes**: Token-based authentication for protected API routes.

---

## **Technologies Used**
- **Backend**: Node.js, Express.js  
- **Database**: MongoDB (NoSQL)  
- **Authentication**: JSON Web Tokens (JWT)  
- **File Handling**: Multer  
- **Other Tools**: dotenv, bcrypt, and more.

---

## **Setup and Installation**

1. **Clone the Repository**  
   ```bash
   git clone https://github.com/yourusername/social-media-rest-api.git
   cd social-media-rest-api
   
## **Setup and Installation**

2. **Install Dependencies**  
   ```bash
   npm install
## **Set Up Environment Variables**  
Create a `.env` file in the root directory and configure the following:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret 
```
### **Run the Application**

```bash
npm start
```
The server will run on [`http://localhost:5000`](http://localhost:5000).

## **API Endpoints**

### **Authentication**

| Method | Endpoint             | Description         |
|--------|----------------------|---------------------|
| POST   | `/api/auth/register` | Register a new user |
| POST   | `/api/auth/login`    | Login an existing user |

### **Users**

| Method | Endpoint             | Description         |
|--------|----------------------|---------------------|
| GET    | `/api/users/:id`     | Fetch user details  |
| PUT    | `/api/users/:id`     | Update user profile |
| DELETE | `/api/users/:id`     | Delete user account |

### **Posts**

| Method | Endpoint             | Description            |
|--------|----------------------|------------------------|
| POST   | `/api/posts`         | Create a new post      |
| GET    | `/api/posts/:id`     | Fetch a specific post  |
| DELETE | `/api/posts/:id`     | Delete a post          |

### **Comments**

| Method | Endpoint             | Description               |
|--------|----------------------|---------------------------|
| POST   | `/api/comments`      | Add a comment to a post   |
| DELETE | `/api/comments/:id`  | Delete a comment          |

### **Messaging**

| Method | Endpoint             | Description               |
|--------|----------------------|---------------------------|
| POST   | `/api/messages`      | Send a message            |
| GET    | `/api/messages`      | Fetch messages            |

### **Media Uploads**

| Method | Endpoint             | Description                |
|--------|----------------------|----------------------------|
| POST   | `/api/upload/story`  | Upload a story             |
| POST   | `/api/upload/image`  | Upload an image            |

## **Contributing**

Contributions are welcome! Please fork the repository and submit a pull request.
## **License**

This project is licensed under the MIT License. See the `LICENSE` file for details.
