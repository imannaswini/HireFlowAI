import json, sys, os
sys.path.append('d:/Project_2/HireFlowAI/backend')
from app.main import app
from fastapi.testclient import TestClient

client = TestClient(app)

endpoints = [
    ("GET", "/api/analytics/kpis"),
    ("GET", "/api/jobs"),
    ("GET", "/api/jobs/1"),
    ("GET", "/api/jobs/1/candidates"),
    ("GET", "/api/analytics/jobs/1/analytics"),
    ("POST", "/api/interview/generate"),
    ("POST", "/api/auth/register"),
    ("POST", "/api/auth/login"),
]

results = []
for method, path in endpoints:
    if method == "GET":
        resp = client.get(path)
    else:
        # send minimal payload for POST endpoints
        if path == "/api/interview/generate":
            payload = {"candidate_id": None, "job_id": None, "focus_areas": []}
        elif path == "/api/auth/register":
            payload = {"email": "test@example.com", "password": "password123"}
        elif path == "/api/auth/login":
            payload = {"email": "test@example.com", "password": "password123"}
        else:
            payload = {}
        resp = client.post(path, json=payload)
    try:
        json_body = resp.json()
    except Exception:
        json_body = None
    results.append({
        "method": method,
        "path": path,
        "status_code": resp.status_code,
        "json": json_body,
    })

print(json.dumps(results, ensure_ascii=False, indent=2))
