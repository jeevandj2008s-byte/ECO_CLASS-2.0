import unittest
import base64
from face_engine import FaceRecognitionEngine, EMBEDDING_DIM
from main import app
from fastapi.testclient import TestClient

class TestFaceService(unittest.TestCase):
    def setUp(self):
        self.client = TestClient(app)

    def test_health(self):
        res = self.client.get("/health")
        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.json()["embedding_dim"], 512)

    def test_consent_enforcement(self):
        fake_img = base64.b64encode(b"dummy image bytes").decode("utf-8")
        # Attempt without consent
        res = self.client.post("/register_face", json={
            "profile_id": "test-prof-1",
            "has_consented": False,
            "image_base64": fake_img
        })
        self.assertEqual(res.status_code, 400)
        self.assertIn("Privacy violation", res.json()["detail"])

        # Attempt with consent
        res_consent = self.client.post("/register_face", json={
            "profile_id": "test-prof-1",
            "has_consented": True,
            "image_base64": fake_img
        })
        self.assertEqual(res_consent.status_code, 200)
        data = res_consent.json()
        self.assertEqual(len(data["embedding"]), 512)

    def test_classroom_detection_mapping(self):
        fake_img = base64.b64encode(b"student image bytes").decode("utf-8")
        emb = FaceRecognitionEngine.generate_embedding_from_bytes(b"student image bytes")

        res = self.client.post("/detect_classroom", json={
            "classroom_id": "c1",
            "total_rows": 5,
            "registered_profiles": [
                {"profile_id": "prof-student-1", "role": "user", "embedding": emb}
            ],
            "candidates": [
                # Candidate sitting in back row (y = 6.5m)
                {"detection_id": "det-1", "x": 1.0, "y": 6.5, "face_image_base64": fake_img},
                # Anonymous candidate in row 1 (y = 1.8m)
                {"detection_id": "det-2", "x": 0.5, "y": 1.8}
            ]
        })

        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertEqual(data["total_people"], 2)
        self.assertEqual(data["row_occupancy"]["5"], 1)
        self.assertEqual(data["row_occupancy"]["1"], 1)
        self.assertEqual(len(data["identified_attendees"]), 1)
        self.assertEqual(data["identified_attendees"][0]["profile_id"], "prof-student-1")

if __name__ == "__main__":
    unittest.main()
