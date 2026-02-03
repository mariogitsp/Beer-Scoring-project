# BeerScoring - Beer Rating & Review Application

A full-stack web application for beer enthusiasts to discover, rate, and review beers. Built with React (Vite) on the frontend and Node.js/Express with MongoDB on the backend.

## Features

### User Features
- **User Registration & Authentication**: Secure account creation and JWT-based authentication
- **Browse Beer Collection**: View all available beers with their average ratings and review counts
- **Beer Details**: View detailed information about each beer including description and image
- **Write Reviews**: Rate beers on a scale of 1-10 and leave comments
- **Edit/Delete Reviews**: Modify or remove your own reviews
- **User Profile**: View and manage your account and reviews

### Admin Features
- **Add New Beers**: Create new beer entries with name, description, and image URL
- **Delete Beers**: Remove beers from the collection
- **Manage Reviews**: Delete any inappropriate reviews

## Tech Stack

### Frontend
- **React 19** - Modern UI library with hooks
- **Vite** - Fast build tool and development server
- **React Router DOM 7** - Client-side routing
- **Axios** - HTTP client for API requests
- **CSS** - Custom styling with responsive design

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT (jsonwebtoken)** - Token-based authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-Origin Resource Sharing

## Project Structure

```
BeerScoring_oarwa_projekt/
├── client/                  # Frontend React application
│   ├── public/              # Static assets
│   ├── src/
│   │   ├── App.jsx          # Main application component
│   │   ├── AuthContext.jsx  # Authentication context provider
│   │   ├── HomePage.jsx     # Beer collection listing
│   │   ├── BeerDetail.jsx   # Individual beer view with reviews
│   │   ├── BeerList.jsx     # Beer grid component
│   │   ├── BeerCard.jsx     # Individual beer card
│   │   ├── AddBeer.jsx      # Admin beer creation form
│   │   ├── LoginRegister.jsx # Authentication forms
│   │   ├── UserProfile.jsx  # User profile page
│   │   ├── UserReviewList.jsx # Review listing component
│   │   ├── Navigation.jsx   # Navigation bar
│   │   ├── Footer.jsx       # Footer component
│   │   ├── Loader.jsx       # Loading spinner
│   │   └── *.css            # Component styles
│   ├── package.json
│   └── vite.config.js
│
└── server/                  # Backend Express application
    ├── models/
    │   ├── Beer.js          # Beer schema (name, description, image)
    │   ├── User.js          # User schema (username, email, password, role)
    │   └── Review.js        # Review schema (beerId, userId, rating, comment)
    ├── routes/
    │   ├── beers.js         # Beer CRUD endpoints
    │   ├── reviews.js       # Review CRUD endpoints
    │   ├── auth.js          # Authentication endpoints
    │   └── protected.js     # Protected route handlers
    ├── middleware/
    │   ├── auth.js          # JWT authentication middleware
    │   └── isAdmin.js       # Admin role verification
    ├── index.js             # Server entry point
    └── package.json
```

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login and receive JWT token |

### Beers
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/beers` | Get all beers |
| GET | `/api/beers/:id` | Get a specific beer |
| GET | `/api/beers/average/:beerId` | Get average rating for a beer |
| POST | `/api/beers/add` | Add a new beer (Admin only) |
| DELETE | `/api/beers/delete/:id` | Delete a beer (Admin only) |

### Reviews
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/reviews` | Get all reviews |
| GET | `/api/reviews/beer/:id` | Get all reviews for a beer |
| POST | `/api/reviews/add` | Add a new review |
| PUT | `/api/reviews/:id` | Update a review |
| DELETE | `/api/reviews/:id` | Delete a review |

## Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn

### Backend Setup

1. Navigate to the server directory:
   ```bash
   cd BeerScoring_oarwa_projekt/server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the server directory:
   ```env
   JWT_SECRET=your_jwt_secret_key
   MONGODB_URI=mongodb://127.0.0.1:27017/BeerScoring
   ```

4. Start the server:
   ```bash
   # Development mode (with hot reload)
   npm run dev
   
   # Production mode
   npm start
   ```

The server will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the client directory:
   ```bash
   cd BeerScoring_oarwa_projekt/client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:5173`

## Database Schema

### User
```javascript
{
  username: String (required),
  email: String (required, unique),
  password: String (required, hashed),
  role: String (enum: ['user', 'admin'], default: 'user')
}
```

### Beer
```javascript
{
  name: String (required),
  description: String (required),
  image: String (required)
}
```

### Review
```javascript
{
  beerId: ObjectId (ref: 'Beer', required),
  userId: ObjectId (ref: 'User', required),
  rating: Number (required, 1-10),
  comment: String (required)
}
```

## Security Features

- **Password Hashing**: User passwords are hashed using bcryptjs before storage
- **JWT Authentication**: Secure token-based authentication for API requests
- **Role-Based Access Control**: Admin and user roles with different permissions
- **Protected Routes**: Frontend routes protected based on authentication status
- **CORS Configuration**: Configured for secure cross-origin requests

## Scripts

### Server
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon

### Client
- `npm run dev` - Start Vite development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## License

This project was created as part of the OARWA (Web Application Development) course.

## Author

Created by mr-ados
