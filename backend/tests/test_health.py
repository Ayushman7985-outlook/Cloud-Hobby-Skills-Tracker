from fastapi.testclient import TestClient
from app.main import app
c=TestClient(app)
def test_root(): assert c.get('/').status_code==200
def test_health(): assert c.get('/api/health').json()['status']=='ok'
