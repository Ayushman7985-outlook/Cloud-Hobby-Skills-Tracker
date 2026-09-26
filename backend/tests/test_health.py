from fastapi.testclient import TestClient

from app.main import app


client = TestClient(app)


def test_health():
    response = client.get("/api/health")

    assert response.status_code == 200
    assert response.json()["status"] == "ok"


def test_protected_endpoint_requires_authentication():
    response = client.get("/api/analytics/dashboard")

    assert response.status_code == 401


def test_skills_endpoint_requires_authentication():
    response = client.get("/api/skills")

    assert response.status_code == 401


def test_practice_endpoint_requires_authentication():
    response = client.get("/api/practice")

    assert response.status_code == 401


def test_goals_endpoint_requires_authentication():
    response = client.get("/api/goals")

    assert response.status_code == 401


def test_profile_endpoint_requires_authentication():
    response = client.get("/api/profile")

    assert response.status_code == 401


def test_feed_endpoint_requires_authentication():
    response = client.get("/api/feed")

    assert response.status_code == 401