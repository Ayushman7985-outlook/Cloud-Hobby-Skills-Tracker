# Testing Documentation

## 1. Testing Overview

The Online Hobby & Skills Tracker was tested at multiple levels to verify authentication, API behavior, cloud data handling, file uploads, frontend functionality, and deployment.

Testing was performed using:

- Manual functional testing
- FastAPI automated tests
- Browser testing
- Cloud deployment testing
- Multi-user data isolation testing

## 2. Automated API Tests

The backend uses pytest and FastAPI TestClient.

The automated test suite verifies:

| Test | Expected Result |
|---|---|
| Health endpoint | HTTP 200 |
| Analytics without authentication | HTTP 401 |
| Skills without authentication | HTTP 401 |
| Practice without authentication | HTTP 401 |
| Goals without authentication | HTTP 401 |
| Profile without authentication | HTTP 401 |
| Community feed without authentication | HTTP 401 |

The complete automated test suite passed successfully with 7 tests passing.

## 3. Authentication Testing

### Test Case: User Registration

Steps:

1. Open the application.
2. Enter a new email address.
3. Enter a password.
4. Submit the registration form.

Expected result:

- Firebase creates the user account.
- The user can access the authenticated application.

### Test Case: User Login

Steps:

1. Open the login page.
2. Enter valid credentials.
3. Submit the form.

Expected result:

- Firebase authenticates the user.
- The user is redirected to the dashboard.
- Protected application pages become available.

### Test Case: Invalid Authentication

Steps:

1. Send a protected API request without an authentication token.

Expected result:

HTTP 401 Unauthorized

This behavior is also verified through automated tests.

## 4. Skills Testing

Tested operations:

- Create a skill
- View skills
- Delete a skill

Expected result:

Skill information is stored in Firestore and remains available after refreshing the application.

## 5. Practice Tracking Testing

Tested operations:

- Select a skill
- Enter practice duration
- Add activity information
- Add notes
- Submit practice record
- View practice history

Expected result:

Practice data is stored in the cloud and appears in the user's practice history.

## 6. Goals and Milestones Testing

Tested operations:

- Create a goal
- Select a skill
- Set a target
- Set a deadline
- View progress
- View milestone progress

Expected result:

The goal and its progress are stored and displayed correctly.

## 7. Analytics Testing

The analytics dashboard was tested for:

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

Expected result:

Analytics are calculated from the user's stored cloud data and displayed on the dashboard.

## 8. Profile Testing

Tested operations:

- View profile
- Update profile information
- Upload profile image

Expected result:

Profile information is saved to the cloud and the uploaded image is stored using Cloudinary.

## 9. Community Testing

Tested operations:

- Create a community post
- View community feed
- Like a post
- Unlike a post
- Add a comment
- Delete an owned post
- Upload an achievement image

Expected result:

Community content is stored and displayed correctly.

## 10. Multi-User Data Isolation Testing

Two separate authenticated users were used to verify user-specific data.

Test procedure:

1. Register/login as User A.
2. Create skills, practice records, goals, and profile data.
3. Logout.
4. Login as User B.
5. Verify User A's private data is not displayed.
6. Create User B's own data.
7. Verify User B sees their own data.

Expected result:

Each user accesses their own private application data.

Community content remains available as shared community content.

## 11. File Upload Testing

Supported upload types:

- JPG
- PNG
- WEBP
- PDF

Maximum file size:

5 MB

The backend validates file type and size before uploading files to Cloudinary.

## 12. Deployment Testing

The deployed application was tested after deployment.

Frontend:

Vercel

Backend:

Render

Cloud services:

- Firebase Authentication
- Firebase Firestore
- Cloudinary

The deployed backend health endpoint was verified successfully.

## 13. API Testing

The FastAPI documentation interface was used to inspect and test API endpoints.

The backend provides REST API endpoints for:

/api/skills

/api/practice

/api/goals

/api/profile

/api/posts

/api/feed

/api/posts/{id}/like

/api/posts/{id}/comments

/api/files/upload

/api/files/profile

/api/analytics/dashboard

## 14. Error Testing

The application was tested for common failure conditions including:

- Missing authentication
- Invalid authentication
- Invalid API requests
- Failed API responses
- Unsupported file uploads
- Oversized file uploads
- Network/API failures

The frontend displays error messages when API operations fail.

## 15. Regression Testing

After major changes, previously working features were checked again.

Regression testing included:

- Login
- Registration
- Dashboard
- Skills
- Practice
- Goals
- Profile
- Profile image upload
- Community posts
- Likes
- Comments
- Achievement image upload
- Analytics
- Logout

## 16. Testing Result

The application passed the current automated backend test suite with 7 tests passing, and the major application workflows were verified through manual testing.

Testing evidence can be provided through screenshots of:

- Login
- Dashboard
- Skills
- Practice
- Goals
- Profile
- Community
- Analytics
- FastAPI documentation
- Automated pytest results
- Cloud Firestore data
- Cloudinary uploads
- Deployed application