Project Report

Online Hobby & Skills Tracker with Community Sharing on Cloud

1. Abstract

The Online Hobby & Skills Tracker with Community Sharing on Cloud is a cloud-based web application designed to help users manage hobbies and skills, record practice sessions, create goals and milestones, monitor progress, and share achievements with a community.

The project demonstrates practical cloud computing concepts through a React frontend, FastAPI REST backend, Firebase Authentication, Firebase Firestore, Cloudinary object storage, Vercel deployment, and Render deployment.

The application supports authentication, user-specific data, skill management, practice tracking, goals, milestones, streaks, analytics, profile image uploads, community posts, likes, comments, and achievement uploads.

The project also includes automated backend tests, security documentation, testing documentation, GitHub source-code management, and cloud deployment.

2. Introduction

Many people start hobbies or learning activities but stop because they lack structure, progress visibility, and accountability. A digital tracker can help users organize their skills, record practice activities, set measurable goals, and review their progress.

Cloud computing makes this type of application accessible across devices because application data can be stored centrally in cloud services. Authentication, database storage, object storage, backend APIs, and deployment can all be provided through managed cloud platforms.

This project combines these concepts into one application focused on hobby and skill development.

3. Problem Statement

Users often maintain hobby progress using notebooks, spreadsheets, or disconnected applications. These approaches can make it difficult to maintain consistent practice records, calculate progress, store achievement evidence, and share achievements with other people.

The proposed system provides a centralized cloud-based platform where users can manage skills, practice sessions, goals, achievements, and community interactions.

4. Objectives

The main objectives are:

Provide secure user registration and login.

Allow users to create and manage skills.

Record practice sessions in a cloud database.

Create goals and milestones.

Calculate practice progress and streaks.

Upload profile and achievement images.

Provide a community feed.

Support likes and comments.

Provide personal analytics.

Expose functionality through REST APIs.

Deploy the frontend and backend to cloud platforms.

Demonstrate cloud security, testing, and documentation practices.

Maintain source code and development proof through GitHub.

5. Existing System

Traditional hobby tracking can involve:

Paper notebooks

Spreadsheets

Separate habit-tracking applications

Local files

Social media posts without structured progress tracking

These approaches may not provide one centralized system for skills, practice, goals, milestones, analytics, and community interaction.

6. Proposed System

The proposed system provides:

Cloud authentication

User profiles

Skill management

Practice tracking

Goal management

Milestones

Streak calculation

Cloud object storage

Community posts

Likes

Comments

Analytics

REST APIs

Cloud deployment

The application separates frontend, backend, database, authentication, and object storage responsibilities.

7. Industry Relevance

The architecture is relevant to:

Learning platforms

EdTech applications

Fitness tracking systems

Professional skill platforms

Creator communities

Portfolio platforms

Learning Management Systems

Community applications

Employee learning portals

The project demonstrates concepts commonly found in applications that manage user-generated content and cloud-hosted data.

8. Cloud Computing Concepts

Cloud Database

Firebase Firestore stores application data such as skills, practice records, goals, profiles, posts, likes, and comments.

Cloud Authentication

Firebase Authentication manages user registration, login, logout, and identity.

Cloud Object Storage

Cloudinary stores uploaded profile and achievement images.

REST API

FastAPI exposes backend functionality through HTTP REST endpoints.

Cloud Deployment

The frontend is deployed using Vercel and the backend is deployed using Render.

HTTPS

The deployed frontend and backend communicate through HTTPS.

Environment Variables

Sensitive backend configuration is supplied through environment variables rather than being stored in source code.

Scalability

Managed cloud services provide a foundation that can be expanded with caching, indexing, pagination, rate limiting, background workers, CDN services, and horizontal scaling.

Monitoring and Logging

The current deployment provides platform-level logs. Dedicated application monitoring and alerting are identified as future improvements.

Backup

The current implementation does not include an automated backup workflow. Backup and disaster-recovery procedures are identified as future improvements.

Serverless Computing

The assignment discusses serverless functions as an architectural option. The current implementation uses a continuously deployed FastAPI service on Render rather than Firebase Cloud Functions.

9. Technology Stack

Frontend

React

Vite

React Router

CSS

Backend

Python

FastAPI

Uvicorn

Pydantic

Authentication

Firebase Authentication

Database

Firebase Firestore

Object Storage

Cloudinary

Deployment

Vercel

Render

Testing

Pytest

FastAPI TestClient

Manual browser testing

Version Control

Git

GitHub

10. System Architecture

User
  |
  v
React + Vite Frontend
  |
  | HTTPS
  v
FastAPI REST API
  |
  +--------------------+
  |                    |
  v                    v
Firebase             Cloudinary
Authentication       Object Storage
  |
  v
Firestore Database

The user interacts with the React frontend. Authentication is performed using Firebase Authentication. Authenticated requests are sent to the FastAPI backend with a Firebase ID token. The backend verifies the token and performs user-specific operations using the authenticated Firebase UID. Firestore stores application data, while Cloudinary stores uploaded files.

11. Application Flow

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

12. Database Design

The application uses Firebase Firestore as a NoSQL cloud database.

Major logical data areas include:

Users / Profiles

Stores user profile information.

Skills

Stores:

Skill name

Category

Current level

Target level

Start date

Target date

Status

Description

Practice

Stores:

Skill

Duration

Activity

Notes

Practice date

Goals

Stores:

Skill

Goal title

Target

Unit

Deadline

Progress

Community Posts

Stores:

User ID

Post text

Visibility

Image URL

Creation time

Likes

Likes are stored per user/post relationship so one user cannot create repeated normal likes on the same post.

Comments

Comments are associated with posts and users.

13. Object Storage Design

Cloudinary is used for object storage.

Current uses include:

Profile images

Achievement images

Supported uploaded documents/images

The database stores the relevant file URL/reference while the actual file is stored by Cloudinary.

Supported upload types:

JPG

PNG

WEBP

PDF

Maximum upload size:

5 MB

14. Authentication

Firebase Authentication handles:

Registration

Login

Logout

User identity

The frontend obtains a Firebase ID token after authentication.

The backend expects:

Authorization: Bearer <Firebase ID Token>

FastAPI verifies the token using Firebase Admin SDK.

Invalid or missing authentication results in HTTP 401 Unauthorized.

15. Authorization and Data Isolation

The backend identifies the current user through the verified Firebase UID.

User-specific resources are queried using the authenticated UID.

This applies to:

Skills

Practice

Goals

Profile

Analytics

Community content is shared between authenticated users, while deleting a community post is restricted to its owner.

The current project does not implement a separate administrator/moderator role system. Role-based administration is documented as future scope rather than being claimed as an existing feature.

16. Skill Management

Users can create skills such as:

Coding

Photography

Guitar

Painting

Fitness

Cooking

Writing

Each skill contains information such as category, current level, target level, dates, status, and description.

The application supports creating, viewing, and deleting skills.

17. Practice Tracking

Users can log:

Skill

Duration

Activity

Notes

Practice date

Practice information is stored in Firestore.

The data is used to calculate:

Total practice hours

Weekly practice hours

Monthly practice hours

Practice by skill

Current streak

Longest streak

18. Goals and Milestones

Users can create goals linked to their skills.

A goal contains:

Title

Target

Unit

Deadline

Progress

Milestone progress is represented through percentage thresholds.

The dashboard can display progress toward goals and milestones.

19. Streaks

The backend calculates practice streaks using practice dates.

The application calculates:

Current streak

Longest streak

Duplicate practice records on the same date are handled as dates when calculating the streak, preventing multiple sessions on one day from incorrectly increasing the streak by multiple days.

20. Community Sharing

Users can create community posts containing:

Text

Visibility

Optional achievement image

The community feed allows authenticated users to view shared posts.

Users can:

Create posts

View posts

Like posts

Unlike posts

Add comments

Delete their own posts

21. Likes and Comments

Likes are associated with the user who performed the like.

This prevents one user from creating multiple normal likes for the same post.

Comments are associated with:

Post

User

Comment content

Creation time

Post deletion is restricted to the post owner.

22. Analytics Dashboard

The analytics dashboard provides:

Total practice hours

Weekly practice hours

Monthly practice hours

Most practiced skill

Current streak

Longest streak

Active skills

Goals completed

Active goals

Milestones achieved

Community posts

Likes received

Comments received

Practice distribution by skill

The dashboard retrieves analytics from the FastAPI analytics endpoint.

23. REST API Design

Important endpoints include:

GET    /api/health

GET    /api/skills
POST   /api/skills
DELETE /api/skills/{id}

GET    /api/practice
POST   /api/practice

GET    /api/goals
POST   /api/goals

GET    /api/profile
PUT    /api/profile

GET    /api/posts
POST   /api/posts
DELETE /api/posts/{id}

GET    /api/feed

POST   /api/posts/{id}/like

POST   /api/posts/{id}/comments

POST   /api/files/upload
POST   /api/files/profile

GET    /api/analytics/dashboard

All user-specific protected endpoints use Firebase ID-token verification.

24. Implementation

The implementation was divided into frontend and backend responsibilities.

Frontend

The React application provides:

Login and registration

Navigation

Dashboard

Skills

Practice

Goals

Community

Profile

Backend

FastAPI provides:

Authentication verification

REST endpoints

Firestore access

Cloudinary uploads

Analytics calculations

Ownership checks

Error handling

Cloud Services

Firebase provides authentication and Firestore.

Cloudinary provides object storage.

Vercel hosts the frontend.

Render hosts the FastAPI backend.

25. File Upload Implementation

File uploads require authentication.

The backend validates supported file types and file size before uploading to Cloudinary.

The current supported formats are JPG, PNG, WEBP, and PDF, with a 5 MB maximum.

26. Security

Implemented security controls include:

Firebase Authentication

Firebase ID-token verification

Protected API endpoints

UID-based user data isolation

Ownership checks

HTTPS deployment

Environment variables

Git exclusion of local secrets

File type validation

File size validation

No application-level plaintext password storage

The project does not currently implement all advanced security controls requested in the assignment.

Future security work includes:

Role-based administrator authorization

API rate limiting

Advanced content moderation

Signed private file URLs

Dedicated audit logging

Centralized security monitoring

Automated database backups

Advanced malware scanning

Automated abuse detection

27. Privacy

The application separates private user data from community content.

Private user data includes:

Profile information

Skills

Practice records

Goals

Analytics

Community posts are intended to be shared content.

The current implementation does not provide the complete privacy-management feature set listed in the assignment, such as a full blocking system, reporting workflow, account deletion workflow, and advanced moderation system. These are documented as future improvements.

28. Scalability

The current architecture is suitable for a student-scale deployment.

For larger deployments, the architecture can be expanded using:

Horizontal backend scaling

Load balancing

Database indexing

Pagination

Caching

CDN

Object storage

Background workers

Queues

Rate limiting

For a large community feed, two conceptual approaches are:

Fan-out on Read

Posts are collected when a user requests the feed.

Advantage:

Simpler writes.

Disadvantage:

Feed generation can become expensive at high scale.

Fan-out on Write

Feed references are prepared when a post is created.

Advantage:

Faster feed reads.

Disadvantage:

More write operations and storage.

The current project uses a simpler feed architecture suitable for the project scale.

29. Failure Handling

The application handles common API and authentication failures through HTTP error responses and frontend error messages.

Database Failure

The backend can return an error instead of presenting an incorrect successful result.

Future improvement:

Retry strategy

Monitoring

Backup and recovery

File Upload Failure

The upload request returns an error and the frontend can display the failure.

Future improvement:

Retry

Cleanup of partially completed operations

Backend Unavailable

The frontend receives a failed request and displays an error.

Future improvement:

Health monitoring

Alerts

Automatic recovery

Authentication Token Expiry

The backend rejects an invalid or expired token with HTTP 401.

Network Failure

The frontend handles failed API requests through error handling.

Duplicate Requests

The application prevents duplicate normal likes by associating likes with user IDs.

More comprehensive idempotency mechanisms are future work.

Image Upload and Database Inconsistency

A production implementation should use cleanup or retry mechanisms when one operation succeeds and another fails.

The current implementation documents this as an area for further hardening.

30. Testing Strategy

Testing included:

Automated FastAPI tests

Browser-based functional testing

Deployment testing

Multi-user data isolation testing

File upload testing

Regression testing

Automated tests verify:

Health endpoint.

Analytics authentication.

Skills authentication.

Practice authentication.

Goals authentication.

Profile authentication.

Community feed authentication.

Result:

7 automated tests passed.

31. Manual Functional Testing

Major workflows tested include:

Registration

Login

Dashboard

Skill creation

Practice entry

Goal creation

Milestone progress

Profile update

Profile image upload

Community post creation

Likes

Comments

Achievement image upload

Analytics

Logout

32. Multi-User Testing

Two separate users were used to verify data isolation.

User A created private skills, practice records, goals, and profile information.

User B was then authenticated separately.

The application displayed each user's private data according to the authenticated UID while community content remained shareable.

33. Deployment

Frontend

The React frontend is deployed on Vercel.

Backend

The FastAPI backend is deployed on Render.

Authentication and Database

Firebase Authentication and Firestore are used as managed cloud services.

Object Storage

Cloudinary provides cloud object storage.

Live Backend

https://cloud-hobby-skills-tracker.onrender.com

Live Frontend

https://cloud-hobby-skills-tracker-28ox14q1r-cloud-assignment-portal.vercel.app

34. GitHub and Version Control

The project source code is maintained in GitHub.

Repository:

https://github.com/Ayushman7985-outlook/Cloud-Hobby-Skills-Tracker

The repository contains:

Frontend

Backend

Tests

Documentation

README

Project structure

Sensitive environment files are excluded through .gitignore.

35. Proof and Evidence

Recommended evidence screenshots include:

Project folder structure

Registration page

Login page

User profile

Add Skill page

Skills dashboard

Goal creation

Practice session

Progress calculation

Milestone progress

Analytics dashboard

Firestore cloud database

Cloudinary upload

Achievement image

Community post

Community feed

Like interaction

Comment interaction

Second-user account

Data isolation

FastAPI API documentation

Automated pytest results

Render deployment

Vercel deployment

Live application

GitHub repository

GitHub commit history

README

36. Advantages

The system provides:

Centralized cloud data

Cross-device access

Secure authentication

Structured skill tracking

Practice history

Goal tracking

Milestone tracking

Progress analytics

Cloud object storage

Community interaction

REST API architecture

Cloud deployment

Automated backend testing

37. Limitations

Current limitations include:

No dedicated administrator/moderator role system.

No API rate limiting.

No complete content reporting workflow.

No complete user blocking workflow.

No automated content moderation.

No automated database backup workflow.

No advanced malware scanning.

No dedicated monitoring and alerting system.

No signed private download URL system.

No full account deletion workflow.

These limitations are documented honestly and can be addressed in future versions.

38. Future Scope

Future improvements include:

Administrator and moderator roles.

Content reporting.

User blocking.

Spam prevention.

Automated content moderation.

API rate limiting.

Signed URLs for private files.

Automated Firestore backups.

Monitoring and alerting.

Account deletion and data export.

Notifications.

Advanced charts.

AI-based hobby recommendations.

Recommendation systems.

Mobile application.

CDN and caching for larger deployments.

Background processing and queues.

More comprehensive automated tests.

39. Results

The project successfully demonstrates a deployed cloud-based hobby and skills tracking platform.

Implemented results include:

Working registration and login

Protected application routes

Firebase authentication

Firestore cloud data

Skill tracking

Practice tracking

Goals

Milestones

Streaks

Analytics

Profile management

Cloudinary uploads

Community sharing

Likes

Comments

Automated API testing

Vercel deployment

Render deployment

GitHub source management

40. Learning Outcomes

The project provided practical experience with:

Cloud computing

React development

FastAPI

REST API design

Firebase Authentication

Firestore

Cloud object storage

Cloud deployment

Authentication and authorization

Environment variables

Git and GitHub

Automated testing

Cloud security

Data isolation

Analytics

Community features

41. Conclusion

The Online Hobby & Skills Tracker with Community Sharing on Cloud demonstrates how multiple cloud services can be combined to build a practical full-stack application.

The project integrates a React frontend, FastAPI backend, Firebase Authentication, Firestore, Cloudinary object storage, Vercel, and Render.

The final system provides structured skill and practice management together with goals, milestones, analytics, community sharing, likes, comments, and cloud file uploads.

The project also demonstrates testing, security documentation, deployment, GitHub version control, and awareness of scalability and failure-handling requirements.

42. Interview Preparation — Exactly 10 Questions and Answers

Question 1: Explain your project.

Answer:

My project is an Online Hobby & Skills Tracker with Community Sharing on Cloud. It allows users to register, create skills, record practice sessions, set goals and milestones, track streaks and progress, upload achievement images, and share achievements through a community feed. Users can also like and comment on posts.

Technically, I used React and Vite for the frontend, FastAPI for REST APIs, Firebase Authentication for authentication, Firestore for cloud database storage, Cloudinary for object storage, Vercel for frontend deployment, and Render for backend deployment.

The frontend sends Firebase ID tokens to the FastAPI backend. The backend verifies the token and uses the authenticated Firebase UID for user-specific data operations.

Question 2: Why did you use cloud computing in this project?

Answer:

Cloud computing allows the application to store authentication data, application data, and uploaded files using managed cloud services. This means the application is not dependent on one local computer and users can access their data through the deployed application. It also provides a foundation for scalability and centralized data management.

Question 3: How does authentication work?

Answer:

Firebase Authentication handles user registration and login. After successful login, the frontend obtains a Firebase ID token. The token is sent to the FastAPI backend in the Authorization header. The backend verifies the token using Firebase Admin SDK. If the token is missing, invalid, or expired, the backend returns HTTP 401 Unauthorized.

Question 4: How did you implement authorization and data isolation?

Answer:

After verifying the Firebase ID token, the backend obtains the authenticated user's UID. User-specific queries use that UID so that skills, practice records, goals, profile information, and analytics belong to the authenticated user. Community posts are shared content, but deleting a post is restricted to its owner.

Question 5: Why did you use Firestore?

Answer:

Firestore is a managed cloud NoSQL database and integrates directly with Firebase. It is suitable for storing user profiles, skills, practice records, goals, posts, likes, and comments. It also avoids the need to manage a database server manually.

Question 6: Why did you use Cloudinary instead of storing images in Firestore?

Answer:

Firestore is a database and is not intended to store the actual binary contents of uploaded images efficiently. Cloudinary is used as object storage for profile and achievement images. The application stores the relevant image URL/reference while the actual file is stored in Cloudinary.

Question 7: How does your REST API work?

Answer:

The React frontend communicates with FastAPI through HTTP endpoints such as /api/skills, /api/practice, /api/goals, /api/profile, /api/posts, and /api/analytics/dashboard. Protected requests include the Firebase ID token. FastAPI verifies the token, performs the required operation using Firestore or Cloudinary, and returns a JSON response.

Question 8: How did you implement analytics?

Answer:

The backend collects the authenticated user's practice, skills, goals, and community data. It calculates total, weekly, and monthly practice hours, current and longest streaks, most practiced skill, active skills, goals completed, active goals, milestones achieved, posts, likes, and comments. The dashboard retrieves these values from the analytics API.

Question 9: How would you scale this application?

Answer:

For a larger user base, I would add database indexes and pagination, cache frequently requested data, use CDN services for media, horizontally scale the backend, and use background workers or queues for expensive tasks. For a very large community feed, I would also evaluate fan-out-on-read versus fan-out-on-write approaches.

Question 10: What security measures did you implement and what would you improve?

Answer:

I implemented Firebase Authentication, Firebase ID-token verification, protected API endpoints, UID-based data isolation, ownership checks, HTTPS deployment, environment-based secrets, Git exclusion of sensitive files, and file type and size validation.

Advanced controls such as rate limiting, administrator roles, automated moderation, signed private file URLs, centralized monitoring, automated backups, and advanced malware scanning are documented as future improvements rather than being claimed as implemented features.