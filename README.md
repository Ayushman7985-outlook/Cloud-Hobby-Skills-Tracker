# Online Hobby & Skills Tracker with Community Sharing on Cloud

A cloud-based web application for tracking hobbies and skills, recording practice activities, managing goals and milestones, monitoring progress through analytics, and sharing achievements with a community.

## 1. Project Overview

The Online Hobby & Skills Tracker allows users to:

- Register and login securely.
- Create and manage skills.
- Track practice sessions.
- Set goals and deadlines.
- Monitor progress and milestones.
- Maintain practice streaks.
- Upload achievement and profile images.
- Share achievements with a community.
- Like and comment on community posts.
- View personal analytics.
- Store application data in cloud services.

## 2. Technology Stack

### Frontend
- React
- Vite
- React Router
- CSS

### Backend
- Python
- FastAPI
- Uvicorn
- Pydantic

### Cloud Services
- Firebase Authentication
- Firebase Firestore
- Cloudinary
- Render
- Vercel

### Development Tools
- Git
- GitHub
- VS Code
- Pytest

## 3. Architecture

User
  |
  v
React + Vite Frontend
  |
  | HTTPS
  v
FastAPI REST API
  |
  +-------------------+
  |                   |
  v                   v
Firebase            Cloudinary
Authentication      Object Storage
  |
  v
Firestore Database

## 4. Application Flow

Register / Login
       |
       v
    Profile
       |
       v
 Create Skill
       |
       v
 Set Goals & Milestones
       |
       v
  Log Practice
       |
       v
Track Progress & Streaks
       |
       v
Upload Achievement
       |
       v
Community Sharing
       |
       v
Likes + Comments
       |
       v
Analytics Dashboard

## 5. Main Features

### Authentication

Firebase Authentication is used for:

- Registration
- Login
- Logout
- Firebase ID token generation

The FastAPI backend verifies Firebase ID tokens before processing protected requests.

### Skills

Users can:

- Add skills
- Select skill categories
- Set current and target levels
- Add descriptions
- Set dates
- Delete skills

### Practice Tracking

Users can record:

- Skill
- Practice duration
- Activity
- Notes
- Practice date

Practice records are stored in Firestore.

### Goals and Milestones

Users can:

- Create goals
- Set targets
- Set units
- Set deadlines
- Track progress
- View milestone progress

### Analytics

The dashboard provides:

- Total practice hours
- Weekly practice hours
- Monthly practice hours
- Most practiced skill
- Current streak
- Longest streak
- Active skills
- Completed goals
- Active goals
- Milestones achieved
- Community posts
- Likes received
- Comments received
- Practice distribution by skill

### Community

Users can:

- Create posts
- Upload achievement images
- View the community feed
- Like posts
- Unlike posts
- Add comments
- Delete their own posts

### Cloud Storage

Cloudinary is used for cloud object storage.

Supported upload formats include:

- JPG
- PNG
- WEBP
- PDF

Maximum upload size: 5 MB

## 6. REST API

The FastAPI backend provides REST endpoints including:

GET /api/health

GET /api/skills
POST /api/skills
DELETE /api/skills/{id}

GET /api/practice
POST /api/practice

GET /api/goals
POST /api/goals

GET /api/profile
PUT /api/profile

GET /api/posts
POST /api/posts
DELETE /api/posts/{id}

GET /api/feed

POST /api/posts/{id}/like

POST /api/posts/{id}/comments

POST /api/files/upload
POST /api/files/profile

GET /api/analytics/dashboard

Interactive API documentation is available through FastAPI's documentation interface.

## 7. Database

Firebase Firestore is used as the cloud NoSQL database.

Application data includes:

- User profiles
- Skills
- Practice records
- Goals
- Community posts
- Likes
- Comments

User-specific resources are associated with the authenticated Firebase UID.

## 8. Object Storage

Cloudinary is used to store uploaded files.

The application uses Cloudinary for:

- Profile images
- Achievement images
- Supported document/image uploads

Uploaded files are handled by the FastAPI backend.

## 9. Authentication and Authorization

The application uses Firebase Authentication and Firebase ID tokens.

The frontend sends:

Authorization: Bearer <Firebase ID Token>

The backend verifies the token before allowing access to protected endpoints.

User-specific API operations use the authenticated user's UID.

Community post deletion is restricted to the owner of the post.

## 10. Security

Security measures currently implemented include:

- Firebase Authentication
- Firebase ID-token verification
- Protected REST API endpoints
- User UID-based data isolation
- Ownership checks
- HTTPS deployment
- Environment variables for secrets
- .gitignore protection for local secrets
- File type validation
- File size validation
- No application-level plaintext password storage

Detailed security documentation is available in:

docs/SECURITY.md

## 11. Testing

The project uses pytest for backend automated testing.

Current automated tests verify:

- Health endpoint
- Protected analytics endpoint
- Protected skills endpoint
- Protected practice endpoint
- Protected goals endpoint
- Protected profile endpoint
- Protected community feed endpoint

The current automated test suite passes successfully.

Detailed testing documentation is available in:

docs/TESTING.md

## 12. Local Development

### Frontend

Go to the frontend directory:

cd frontend

Install dependencies:

npm install

Start the development server:

npm run dev

The Vite development server normally runs on:

http://localhost:5173

### Backend

Go to the backend directory:

cd backend

Install dependencies:

pip install -r requirements.txt

Start FastAPI:

uvicorn app.main:app --reload --port 8000

Health endpoint:

http://127.0.0.1:8000/api/health

FastAPI documentation:

http://127.0.0.1:8000/docs

## 13. Environment Variables

### Frontend

The frontend uses Vite environment variables for Firebase web configuration.

Example variables:

VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=

### Backend

The backend uses environment variables for cloud credentials.

Example variables:

FIREBASE_SERVICE_ACCOUNT_JSON=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

Sensitive credentials must not be committed to GitHub.

## 14. Deployment

### Frontend

The React application is deployed using Vercel.

### Backend

The FastAPI application is deployed using Render.

### Cloud Services

The deployed application uses:

- Firebase Authentication
- Firebase Firestore
- Cloudinary
- Vercel
- Render

## 15. Repository Structure

Cloud-Hobby-Skills-Tracker/
|
|-- frontend/
|   |-- src/
|   |-- package.json
|   |-- vite.config.js
|   |-- vercel.json
|
|-- backend/
|   |-- app/
|   |   |-- __init__.py
|   |   |-- main.py
|   |
|   |-- tests/
|   |   |-- test_health.py
|   |
|   |-- requirements.txt
|   |-- .gitignore
|
|-- docs/
|   |-- SECURITY.md
|   |-- TESTING.md
|
|-- reports/
|
|-- sample_data/
|
|-- screenshots/
|
|-- README.md

## 16. Cloud Concepts Demonstrated

The project demonstrates practical use of:

- Cloud authentication
- Cloud NoSQL database
- Cloud object storage
- REST APIs
- Cloud deployment
- Environment-based configuration
- HTTPS
- User-specific cloud data
- Community sharing
- Cloud-based analytics
- Automated backend testing

## 17. Known Limitations

The current implementation does not yet provide every advanced production-level feature.

Examples include:

- Dedicated role-based administrator system
- API rate limiting
- Advanced content moderation
- Signed private download URLs
- Centralized security monitoring
- Automated backup workflows
- Advanced malware scanning

These features are documented as future improvements rather than being represented as currently implemented functionality.

## 18. Future Scope

Future versions can include:

- Administrator role management
- Content reporting and moderation
- API rate limiting
- Notifications
- Mobile application
- Advanced analytics and charts
- Recommendation systems
- AI-based skill recommendations
- Automated moderation
- Advanced backup and disaster recovery
- More comprehensive automated testing

## 19. Project Status

The core cloud application has been implemented and deployed.

Current major components:

- Authentication
- Cloud database
- REST API
- Skills tracking
- Practice tracking
- Goals
- Milestones
- Streaks
- Analytics
- Profile management
- Cloudinary file uploads
- Community posts
- Likes
- Comments
- Automated API tests
- Cloud deployment

## 20. Project Links

### Frontend

https://cloud-hobby-skills-tracker-28ox14q1r-cloud-assignment-portal.vercel.app

### Backend

https://cloud-hobby-skills-tracker.onrender.com

### GitHub

https://github.com/Ayushman7985-outlook/Cloud-Hobby-Skills-Tracker

## 21. Author

Ayushman Dubey

BTech Information Technology