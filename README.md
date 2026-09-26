# Online Hobby & Skills Tracker with Community Sharing on Cloud

React + Vite frontend, Firebase Authentication, FastAPI REST API, Firestore and Firebase Storage. Built as the core implementation for the supplied EDC IIT Delhi Cloud Computing assignment.

## Features
- Authentication and user profiles
- Profile image/object storage
- Skills/hobbies
- Goals and milestones
- Practice sessions, progress and streaks
- Community posts, likes and comments
- Analytics dashboard
- REST API with Firebase ID-token verification
- File validation and user authorization
- Automated API smoke tests

## Local setup
Frontend:
```bash
cd frontend
npm install
copy .env.example .env
npm run dev
```
Backend:
```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
uvicorn app.main:app --reload
```
Never commit Firebase service-account credentials.
