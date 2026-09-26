# Security Documentation

## 1. Authentication

The application uses Firebase Authentication for user authentication.

Users can:

- Register using email and password.
- Login using their registered credentials.
- Logout securely.
- Access protected application pages only after authentication.

The frontend obtains a Firebase ID token after login.

The token is sent to the FastAPI backend using:

Authorization: Bearer <Firebase ID Token>

The backend verifies the Firebase ID token before allowing access to protected API endpoints.

## 2. Authorization

The backend uses the authenticated Firebase user ID to identify the current user.

User-specific resources such as:

- Skills
- Practice records
- Goals
- Profile information
- Analytics

are accessed using the authenticated user's UID.

Users cannot directly request another user's private skill, practice, goal, profile, or analytics data through the normal application API.

Community posts are public community content, while post deletion is restricted to the post owner.

## 3. Password Security

The application does not store user passwords in its own Firestore database.

Password authentication is handled by Firebase Authentication.

Therefore, the application does not directly manage or store plaintext passwords.

## 4. HTTPS and Encryption

The deployed application uses HTTPS through:

- Vercel for the frontend
- Render for the FastAPI backend
- Cloudinary for cloud object storage

Authentication tokens and API requests are transmitted over HTTPS in the deployed environment.

## 5. Cloud Database Security

Firestore is used as the cloud database.

The backend accesses Firestore using Firebase Admin SDK credentials.

User-specific data is associated with the authenticated Firebase UID.

The application backend performs ownership checks before modifying user-specific resources.

## 6. Object Storage Security

Cloudinary is used for cloud object storage instead of Firebase Storage.

The backend handles uploads through protected API endpoints.

Supported upload types are restricted to:

- JPG
- PNG
- WEBP
- PDF

The application also limits uploaded file size to 5 MB.

Uploaded files are sent to Cloudinary rather than being stored directly on the application server.

## 7. Secure File Upload

File uploads require an authenticated user.

The backend validates:

- File type
- File extension
- File size

before sending the file to Cloudinary.

This reduces the risk of accepting unsupported or unnecessarily large files.

## 8. API Security

The FastAPI backend protects user-specific endpoints using Firebase authentication.

Examples include:

GET /api/skills

GET /api/practice

GET /api/goals

GET /api/profile

GET /api/analytics/dashboard

Requests without a valid Firebase ID token receive an HTTP 401 Unauthorized response.

Automated tests verify that protected endpoints reject unauthenticated requests.

## 9. Secrets Management

Sensitive credentials are not stored in the GitHub repository.

Environment variables are used for sensitive configuration such as:

FIREBASE_SERVICE_ACCOUNT_JSON

CLOUDINARY_CLOUD_NAME

CLOUDINARY_API_KEY

CLOUDINARY_API_SECRET

Local .env files and Firebase service-account credentials are excluded from Git using .gitignore.

Production secrets are configured through the Render environment-variable settings.

## 10. Frontend Security

The frontend does not contain Firebase service-account credentials.

Only the Firebase web configuration required by the client application is exposed to the frontend.

The Firebase service-account credentials remain on the backend.

## 11. Data Isolation

The application uses the Firebase UID to associate private application data with its owner.

Example:

User A
  - Skills
  - Practice
  - Goals
  - Profile
  - Analytics

User B
  - Skills
  - Practice
  - Goals
  - Profile
  - Analytics

The backend retrieves user-specific records using the authenticated UID.

This prevents normal API requests from one authenticated user from being used to retrieve another user's private application data.

## 12. Community Content

Community posts are designed to be shared with other authenticated users.

Posts contain:

- Text
- Visibility information
- Optional achievement image
- Likes
- Comments

Post deletion is restricted to the owner of the post.

Likes are associated with individual user IDs, preventing the same user from creating multiple normal likes on the same post.

## 13. Error Handling

Protected API requests return appropriate HTTP error responses when authentication is missing or invalid.

For example:

401 Unauthorized

is returned when a required Firebase authentication token is missing or invalid.

The application also handles API failures on the frontend and displays user-facing error messages instead of silently failing.

## 14. Automated Security-Related Testing

Automated tests verify that protected API endpoints cannot be accessed without authentication.

Current tests cover:

- Health endpoint
- Analytics authentication
- Skills authentication
- Practice authentication
- Goals authentication
- Profile authentication
- Community feed authentication

Example:

response = client.get("/api/analytics/dashboard")

assert response.status_code == 401

The automated test suite currently passes successfully.

## 15. Current Security Limitations

The current project does not implement every advanced security mechanism listed in the project requirements.

The following are areas for future enhancement:

- Role-based admin authorization
- API rate limiting
- Advanced spam prevention
- Automated content moderation
- Signed download URLs
- Dedicated audit logging
- Centralized security monitoring
- Automated database backups
- Advanced malware scanning for uploaded files
- Automated abuse detection

These limitations are documented instead of claiming that the features already exist.

## 16. Future Security Improvements

Future versions can add:

1. Role-based access control for administrators.
2. API rate limiting.
3. Content reporting and moderation.
4. Signed URLs for private files.
5. Centralized application logging.
6. Security monitoring and alerts.
7. Automated Firestore backup procedures.
8. More comprehensive API security tests.
9. Advanced upload scanning.
10. Account and data deletion workflows.

## 17. Security Summary

The current application provides a security foundation using:

- Firebase Authentication
- Firebase ID-token verification
- User UID-based authorization
- Protected FastAPI endpoints
- HTTPS deployment
- Cloudinary-controlled uploads
- File type and size validation
- Environment-based secret management
- Git exclusion of sensitive credentials
- Automated authentication tests

Advanced security controls not currently implemented are explicitly documented as limitations and future improvements.