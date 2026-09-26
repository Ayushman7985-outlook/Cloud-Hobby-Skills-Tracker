# PROJECT REPORT OUTLINE
## Online Hobby & Skills Tracker with Community Sharing on Cloud

### 1. Project Title
Online Hobby & Skills Tracker with Community Sharing on Cloud

### 2. Introduction
This project is a cloud-based web application that allows users to manage hobbies and professional skills, set goals and milestones, record practice sessions, monitor progress, and share achievements with a community.

### 3. Objectives
- Provide secure registration and login.
- Maintain user profiles.
- Track hobbies and professional skills.
- Create goals and milestones.
- Record practice sessions.
- Track progress, streaks, and achievements.
- Upload achievement proof and certificates using cloud storage.
- Provide community posts, likes, and comments.
- Display useful progress analytics.
- Use REST APIs and cloud services.
- Deploy the application online.

### 4. Technology Stack
- Frontend: React + Vite
- Authentication: Firebase Authentication
- Database: Cloud Firestore
- Object Storage: Firebase Storage
- Backend: FastAPI
- Frontend Deployment: Vercel
- Version Control: GitHub
- Testing: Pytest / HTTP testing

### 5. System Architecture
User → React Frontend → Firebase Authentication
                         ↓
                    FastAPI REST API
                         ↓
                    Cloud Firestore
                         ↓
                    Firebase Storage

### 6. Main Modules
1. Registration and Login
2. User Profile
3. Hobby and Skill Management
4. Goals and Milestones
5. Practice Sessions
6. Progress and Analytics
7. Achievement/File Upload
8. Community Posts
9. Likes and Comments
10. Cloud Deployment

### 7. Database Design
The application uses Firestore collections/subcollections for users, skills, practice sessions, goals, uploaded files, community posts, likes, and comments.

### 8. Authentication and Security
Firebase Authentication is used for user authentication. FastAPI verifies Firebase ID tokens before allowing protected API operations. Service-account credentials are kept outside the Git repository.

### 9. Cloud Storage
Firebase Storage is used for profile pictures, achievement images, certificates, and other permitted files.

### 10. REST API
FastAPI provides REST endpoints for protected application operations such as profile management, skills, practice sessions, goals, community posts, likes, comments, analytics, and file uploads.

### 11. Testing
Testing includes backend health testing, authentication testing, API testing, database operation testing, file-upload validation, frontend functionality testing, and deployment testing.

### 12. Deployment
The React frontend can be deployed on Vercel. The FastAPI backend can be deployed on a suitable cloud hosting service. Firebase provides authentication, Firestore, and storage services.

### 13. Expected Outcome
The completed application provides a centralized cloud platform for tracking personal hobbies and professional skills while allowing users to share progress and achievements with a community.

### 14. Future Improvements
- AI-based hobby/skill recommendations
- Advanced analytics
- Notifications and reminders
- More achievement badges
- Mobile application
- NFC/IoT-based practice logging
- Scaling and performance improvements

### 15. Conclusion
The project demonstrates cloud computing concepts through authentication, cloud database, object storage, REST APIs, security, testing, and deployment in a practical web application.
