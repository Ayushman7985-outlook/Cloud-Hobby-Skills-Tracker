import os
import json
from uuid import uuid4
from datetime import datetime, timezone, date, timedelta

import firebase_admin # type: ignore
from firebase_admin import credentials, firestore, auth # type: ignore

from fastapi import ( # type: ignore
    FastAPI,
    Header,
    HTTPException,
    Depends,
    UploadFile,
    File,
    Form
)

from fastapi.middleware.cors import CORSMiddleware # type: ignore
from pydantic import BaseModel, Field # type: ignore
from dotenv import load_dotenv # type: ignore

import cloudinary # type: ignore
import cloudinary.uploader # type: ignore


# --------------------------------------------------
# ENVIRONMENT VARIABLES
# --------------------------------------------------

load_dotenv()


# --------------------------------------------------
# FIREBASE INITIALIZATION
# --------------------------------------------------

if not firebase_admin._apps:
    raw = os.getenv("FIREBASE_SERVICE_ACCOUNT_JSON", "").strip()
    path = os.getenv("GOOGLE_APPLICATION_CREDENTIALS")

    cred = (
        credentials.Certificate(json.loads(raw))
        if raw
        else credentials.Certificate(path)
        if path
        else credentials.ApplicationDefault()
    )

    firebase_admin.initialize_app(
        cred,
        {
            "storageBucket": os.getenv("FIREBASE_STORAGE_BUCKET")
        }
    )


db = firestore.client()


# --------------------------------------------------
# CLOUDINARY INITIALIZATION
# --------------------------------------------------

cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
    api_key=os.getenv("CLOUDINARY_API_KEY"),
    api_secret=os.getenv("CLOUDINARY_API_SECRET"),
    secure=True
)


# --------------------------------------------------
# FASTAPI APP
# --------------------------------------------------

app = FastAPI(
    title="Online Hobby & Skills Tracker API",
    version="1.0.0"
)


# --------------------------------------------------
# --------------------------------------------------
# CORS
# --------------------------------------------------

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173"
    ],
    allow_origin_regex=r"https://.*\.vercel\.app$",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)
# --------------------------------------------------
# AUTHENTICATION
# --------------------------------------------------

async def uid(
    authorization: str | None = Header(default=None)
):
    if (
        not authorization
        or not authorization.startswith("Bearer ")
    ):
        raise HTTPException(
            401,
            "Missing Firebase ID token"
        )

    try:
        return auth.verify_id_token(
            authorization.split(" ", 1)[1]
        )["uid"]

    except Exception:
        raise HTTPException(
            401,
            "Invalid or expired Firebase ID token"
        )


# --------------------------------------------------
# HELPERS
# --------------------------------------------------

def now():
    return datetime.now(timezone.utc).isoformat()


def profile(u):
    s = (
        db.collection("users")
        .document(u)
        .collection("profile")
        .document("main")
        .get()
    )

    return (
        s.to_dict()
        if s.exists
        else {
            "name": "",
            "username": "",
            "bio": "",
            "interests": [],
            "created_at": now()
        }
    )


# --------------------------------------------------
# DATA MODELS
# --------------------------------------------------

class Profile(BaseModel):
    name: str = ""
    username: str = ""
    bio: str = ""
    interests: list[str] = []


class Skill(BaseModel):
    skill_name: str
    category: str = "Other"
    current_level: str = "BEGINNER"
    target_level: str = "INTERMEDIATE"
    start_date: str = ""
    target_date: str = ""
    status: str = "ACTIVE"
    description: str = ""


class Goal(BaseModel):
    skill_id: str
    title: str
    target_value: float = Field(gt=0)
    unit: str = "hours"
    deadline: str = ""


class Practice(BaseModel):
    skill_id: str
    duration_minutes: int = Field(
        gt=0,
        le=1440
    )
    activity: str
    notes: str = ""
    practiced_at: str


class Post(BaseModel):
    text: str
    visibility: str = "public"
    image_url: str = ""


class Comment(BaseModel):
    text: str = Field(
        min_length=1,
        max_length=1000
    )


# --------------------------------------------------
# SKILL HELPERS
# --------------------------------------------------

def skillref(u, i):
    return (
        db.collection("users")
        .document(u)
        .collection("skills")
        .document(i)
    )


def skills(u):
    return [
        {
            "id": x.id,
            **x.to_dict()
        }
        for x in (
            db.collection("users")
            .document(u)
            .collection("skills")
            .stream()
        )
    ]


def practices(u):
    ss = {
        x["id"]: x
        for x in skills(u)
    }

    out = []

    for x in (
        db.collection("users")
        .document(u)
        .collection("practice")
        .stream()
    ):
        z = {
            "id": x.id,
            **x.to_dict()
        }

        z["skill_name"] = (
            ss.get(
                z.get("skill_id"),
                {}
            ).get(
                "skill_name",
                "Unknown"
            )
        )

        out.append(z)

    return sorted(
        out,
        key=lambda x: x.get(
            "practiced_at",
            ""
        ),
        reverse=True
    )


# --------------------------------------------------
# BASIC ROUTES
# --------------------------------------------------

@app.get("/")
def root():
    return {
        "project": (
            "Online Hobby & Skills Tracker "
            "with Community Sharing on Cloud"
        ),
        "status": "running",
        "docs": "/docs"
    }


@app.get("/api/health")
def health():
    return {
        "status": "ok"
    }


# --------------------------------------------------
# PROFILE
# --------------------------------------------------

@app.get("/api/profile")
def get_profile(
    u: str = Depends(uid)
):
    return profile(u)


@app.put("/api/profile")
def put_profile(
    d: Profile,
    u: str = Depends(uid)
):
    p = profile(u)

    z = d.model_dump()

    z["email"] = p.get(
        "email",
        ""
    )

    z["created_at"] = p.get(
        "created_at",
        now()
    )

    (
        db.collection("users")
        .document(u)
        .collection("profile")
        .document("main")
        .set(
            z,
            merge=True
        )
    )

    return {
        **p,
        **z
    }


# --------------------------------------------------
# SKILLS
# --------------------------------------------------

@app.get("/api/skills")
def get_skills(
    u: str = Depends(uid)
):
    return skills(u)


@app.post("/api/skills")
def add_skill(
    d: Skill,
    u: str = Depends(uid)
):
    i = uuid4().hex

    z = d.model_dump()

    z.update(
        user_id=u,
        created_at=now()
    )

    skillref(u, i).set(z)

    return {
        "id": i,
        **z
    }


@app.delete("/api/skills/{i}")
def delete_skill(
    i: str,
    u: str = Depends(uid)
):
    ref = skillref(u, i)

    if not ref.get().exists:
        raise HTTPException(
            404,
            "Skill not found"
        )

    ref.delete()

    return {
        "ok": True
    }


# --------------------------------------------------
# PRACTICE
# --------------------------------------------------

@app.post("/api/practice")
def add_practice(
    d: Practice,
    u: str = Depends(uid)
):
    if not skillref(
        u,
        d.skill_id
    ).get().exists:

        raise HTTPException(
            404,
            "Skill not found"
        )

    i = uuid4().hex

    z = d.model_dump()

    z.update(
        user_id=u,
        created_at=now()
    )

    (
        db.collection("users")
        .document(u)
        .collection("practice")
        .document(i)
        .set(z)
    )

    return {
        "id": i,
        **z
    }


@app.get("/api/practice")
def get_practice(
    u: str = Depends(uid)
):
    return practices(u)


# --------------------------------------------------
# GOALS
# --------------------------------------------------

@app.post("/api/goals")
def add_goal(
    d: Goal,
    u: str = Depends(uid)
):
    if not skillref(
        u,
        d.skill_id
    ).get().exists:

        raise HTTPException(
            404,
            "Skill not found"
        )

    i = uuid4().hex

    z = d.model_dump()

    z.update(
        user_id=u,
        status="ACTIVE",
        created_at=now()
    )

    (
        db.collection("users")
        .document(u)
        .collection("goals")
        .document(i)
        .set(z)
    )

    return {
        "id": i,
        **z
    }


@app.get("/api/goals")
def get_goals(
    u: str = Depends(uid)
):
    ss = {
        x["id"]: x
        for x in skills(u)
    }

    ps = practices(u)

    out = []

    for x in (
        db.collection("users")
        .document(u)
        .collection("goals")
        .stream()
    ):
        g = {
            "id": x.id,
            **x.to_dict()
        }

        rel = [
            p
            for p in ps
            if p.get("skill_id")
            == g.get("skill_id")
        ]

        if g.get("unit") == "hours":
            cur = (
                sum(
                    int(
                        p.get(
                            "duration_minutes",
                            0
                        )
                    )
                    for p in rel
                )
                / 60
            )

        elif g.get("unit") == "minutes":
            cur = sum(
                int(
                    p.get(
                        "duration_minutes",
                        0
                    )
                )
                for p in rel
            )

        else:
            cur = len(rel)

        g.update(
            skill_name=ss.get(
                g.get("skill_id"),
                {}
            ).get(
                "skill_name",
                "Unknown"
            ),
            current_value=round(
                cur,
                2
            ),
            progress=round(
                min(
                    100,
                    cur
                    / float(
                        g["target_value"]
                    )
                    * 100
                ),
                1
            ),
            milestones=[
                {
                    "title": (
                        f"{g['target_value'] * q:g} "
                        f"{g['unit']}"
                    ),
                    "achieved":
                        cur
                        >= g["target_value"] * q
                }
                for q in (
                    0.25,
                    0.5,
                    0.75,
                    1
                )
            ]
        )

        out.append(g)

    return out


# --------------------------------------------------
# COMMUNITY POSTS
# --------------------------------------------------

@app.post("/api/posts")
def add_post(
    d: Post,
    u: str = Depends(uid)
):
    i = uuid4().hex

    z = d.model_dump()

    z.update(
        uid=u,
        created_at=now(),
        likes=0,
        comments=0
    )

    (
        db.collection("posts")
        .document(i)
        .set(z)
    )

    return {
        "id": i,
        **z
    }


@app.get("/api/feed")
def feed(
    u: str = Depends(uid)
):
    out = []

    for x in (
        db.collection("posts")
        .stream()
    ):
        z = {
            "id": x.id,
            **x.to_dict()
        }

        likes = list(
            x.reference
            .collection("likes")
            .stream()
        )

        z.update(
            likes=len(likes),
            likedByMe=any(
                a.id == u
                for a in likes
            ),
            is_owner=(
                z.get("uid") == u
            ),
            author_name=(
                profile(
                    z.get("uid", "")
                ).get("name")
                or "Community member"
            )
        )

        out.append(z)

    return sorted(
        out,
        key=lambda x: x.get(
            "created_at",
            ""
        ),
        reverse=True
    )[:100]


@app.delete("/api/posts/{i}")
def delete_post(
    i: str,
    u: str = Depends(uid)
):
    r = (
        db.collection("posts")
        .document(i)
    )

    s = r.get()

    if not s.exists:
        raise HTTPException(
            404,
            "Post not found"
        )

    if s.to_dict().get("uid") != u:
        raise HTTPException(
            403,
            "Only the owner can delete this post"
        )

    r.delete()

    return {
        "ok": True
    }


# --------------------------------------------------
# LIKES
# --------------------------------------------------

@app.post("/api/posts/{i}/like")
def like(
    i: str,
    u: str = Depends(uid)
):
    (
        db.collection("posts")
        .document(i)
        .collection("likes")
        .document(u)
        .set(
            {
                "created_at": now()
            }
        )
    )

    return {
        "ok": True
    }


@app.delete("/api/posts/{i}/like")
def unlike(
    i: str,
    u: str = Depends(uid)
):
    (
        db.collection("posts")
        .document(i)
        .collection("likes")
        .document(u)
        .delete()
    )

    return {
        "ok": True
    }


# --------------------------------------------------
# COMMENTS
# --------------------------------------------------

@app.get("/api/posts/{i}/comments")
def comments(
    i: str,
    u: str = Depends(uid)
):
    out = []

    for x in (
        db.collection("posts")
        .document(i)
        .collection("comments")
        .stream()
    ):
        z = {
            "id": x.id,
            **x.to_dict()
        }

        z["author_name"] = (
            profile(
                z.get("uid", "")
            ).get("name")
            or "Community member"
        )

        out.append(z)

    return out


@app.post("/api/posts/{i}/comments")
def add_comment(
    i: str,
    d: Comment,
    u: str = Depends(uid)
):
    r = (
        db.collection("posts")
        .document(i)
    )

    if not r.get().exists:
        raise HTTPException(
            404,
            "Post not found"
        )

    z = {
        "uid": u,
        "text": d.text.strip(),
        "created_at": now()
    }

    c = r.collection(
        "comments"
    ).document()

    c.set(z)

    return {
        "id": c.id,
        **z
    }


# --------------------------------------------------
# CLOUDINARY FILE UPLOAD
# --------------------------------------------------

ALLOWED = {
    "image/jpeg",
    "image/png",
    "image/webp",
    "application/pdf"
}


def upload_to_cloudinary(
    user_id,
    file,
    folder
):
    if file.content_type not in ALLOWED:
        raise HTTPException(
            status_code=400,
            detail=(
                "Allowed files: "
                "JPG, PNG, WEBP, PDF"
            )
        )

    data = file.file.read()

    if len(data) > 5 * 1024 * 1024:
        raise HTTPException(
            status_code=400,
            detail="Maximum file size is 5 MB"
        )

    filename = (
        file.filename
        .replace("/", "_")
        .replace("\\", "_")
    )

    public_id = (
        f"{folder}/"
        f"{user_id}/"
        f"{uuid4().hex}-"
        f"{filename}"
    )

    try:
        result = cloudinary.uploader.upload(
            data,
            public_id=public_id,
            resource_type="auto"
        )

    except Exception as error:
        print(
            "Cloudinary upload error:",
            error
        )

        raise HTTPException(
            status_code=500,
            detail="File upload failed"
        )

    return (
        result["public_id"],
        result["secure_url"]
    )


@app.post("/api/files/upload")
def file_upload(
    file: UploadFile = File(...),
    folder: str = Form("achievements"),
    u: str = Depends(uid)
):
    safe_folder = (
        folder
        if folder in (
            "achievements",
            "posts"
        )
        else "achievements"
    )

    path, url = upload_to_cloudinary(
        u,
        file,
        safe_folder
    )

    record = (
        db.collection("users")
        .document(u)
        .collection("files")
        .document()
    )

    record.set(
        {
            "path": path,
            "url": url,
            "name": file.filename,
            "content_type": file.content_type,
            "created_at": now()
        }
    )

    return {
        "id": record.id,
        "url": url
    }


@app.post("/api/files/profile")
def profile_upload(
    file: UploadFile = File(...),
    u: str = Depends(uid)
):
    path, url = upload_to_cloudinary(
        u,
        file,
        "profiles"
    )

    (
        db.collection("users")
        .document(u)
        .collection("profile")
        .document("main")
        .set(
            {
                "profile_picture": url
            },
            merge=True
        )
    )

    return {
        "url": url
    }


# --------------------------------------------------
# ANALYTICS
# --------------------------------------------------

def streak(ps):
    dates = set()

    for practice in ps:
        practiced_at = practice.get("practiced_at", "")

        if not practiced_at:
            continue

        try:
            # Convert timestamp such as:
            # 2026-09-26T14:23:35.215Z
            # into:
            # 2026-09-26
            practice_date = datetime.fromisoformat(
                practiced_at.replace("Z", "+00:00")
            ).date()

            dates.add(practice_date)

        except (ValueError, TypeError):
            continue

    ds = sorted(dates, reverse=True)

    if not ds:
        return 0, 0

    # Calculate longest streak
    best = 1
    run = 1

    for current_date, previous_date in zip(ds, ds[1:]):
        if current_date - previous_date == timedelta(days=1):
            run += 1
        else:
            run = 1

        best = max(best, run)

    # Calculate current streak
    run = 1

    for current_date, previous_date in zip(ds, ds[1:]):
        if current_date - previous_date == timedelta(days=1):
            run += 1
        else:
            break

    if ds[0] >= date.today() - timedelta(days=1):
        current_streak = run
    else:
        current_streak = 0

    return current_streak, best


@app.get("/api/analytics/dashboard")
def analytics(
    u: str = Depends(uid)
):
    ss = skills(u)
    ps = practices(u)
    gs = get_goals(u)

    # --------------------------------------------------
    # TOTAL PRACTICE TIME
    # --------------------------------------------------

    minutes = sum(
        int(
            x.get(
                "duration_minutes",
                0
            )
        )
        for x in ps
    )

    # --------------------------------------------------
    # WEEKLY + MONTHLY PRACTICE
    # --------------------------------------------------

    today = datetime.now(timezone.utc).date()

    # Monday of the current week
    week_start = today - timedelta(
        days=today.weekday()
    )

    month_start = today.replace(
        day=1
    )

    weekly_minutes = 0
    monthly_minutes = 0

    for x in ps:
        practiced_at = x.get(
            "practiced_at",
            ""
        )

        if not practiced_at:
            continue

        try:
            practice_date = datetime.fromisoformat(
                practiced_at.replace(
                    "Z",
                    "+00:00"
                )
            ).date()
        except (
            ValueError,
            TypeError
        ):
            continue

        duration = int(
            x.get(
                "duration_minutes",
                0
            )
        )

        if practice_date >= week_start:
            weekly_minutes += duration

        if practice_date >= month_start:
            monthly_minutes += duration

    # --------------------------------------------------
    # STREAKS
    # --------------------------------------------------

    cur, best = streak(ps)

    # --------------------------------------------------
    # PRACTICE BY SKILL
    # --------------------------------------------------

    by = {}

    for x in ps:
        skill_name = x.get(
            "skill_name",
            "Unknown"
        )

        by[skill_name] = (
            by.get(
                skill_name,
                0
            )
            + int(
                x.get(
                    "duration_minutes",
                    0
                )
            )
        )

    # Most practiced skill
    most_practiced_skill = (
        max(
            by,
            key=by.get
        )
        if by
        else "None"
    )

    # --------------------------------------------------
    # COMMUNITY POSTS
    # --------------------------------------------------

    posts = [
        x
        for x in (
            db.collection("posts")
            .stream()
        )
        if x.to_dict().get(
            "uid"
        ) == u
    ]

    likes_received = 0
    comments_received = 0

    for x in posts:

        likes_received += len(
            list(
                x.reference
                .collection("likes")
                .stream()
            )
        )

        comments_received += len(
            list(
                x.reference
                .collection("comments")
                .stream()
            )
        )

    # --------------------------------------------------
    # GOALS
    # --------------------------------------------------

    goals_completed = sum(
        x.get(
            "progress",
            0
        ) >= 100
        for x in gs
    )

    active_goals = sum(
        x.get(
            "status",
            "ACTIVE"
        ) == "ACTIVE"
        and x.get(
            "progress",
            0
        ) < 100
        for x in gs
    )

    # --------------------------------------------------
    # MILESTONES
    # --------------------------------------------------

    milestones_achieved = 0

    for goal in gs:

        milestones = goal.get(
            "milestones",
            []
        )

        milestones_achieved += sum(
            milestone.get(
                "achieved",
                False
            )
            for milestone in milestones
        )

    # --------------------------------------------------
    # FINAL RESPONSE
    # --------------------------------------------------

    return {
        "totalPracticeHours":
            round(
                minutes / 60,
                1
            ),

        "weeklyPracticeHours":
            round(
                weekly_minutes / 60,
                1
            ),

        "monthlyPracticeHours":
            round(
                monthly_minutes / 60,
                1
            ),

        "mostPracticedSkill":
            most_practiced_skill,

        "currentStreak":
            cur,

        "longestStreak":
            best,

        "activeSkills":
            sum(
                x.get("status")
                == "ACTIVE"
                for x in ss
            ),

        "goalsCompleted":
            goals_completed,

        "activeGoals":
            active_goals,

        "milestonesAchieved":
            milestones_achieved,

        "postsCount":
            len(posts),

        "likesReceived":
            likes_received,

        "commentsReceived":
            comments_received,

        "practiceBySkill": [
            {
                "skill": k,
                "minutes": v
            }
            for k, v in by.items()
        ]
    }