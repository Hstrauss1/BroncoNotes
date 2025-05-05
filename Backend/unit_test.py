import unittest
from unittest.mock import patch, MagicMock
from app import app
from flask import g
from interaction import InsufficientPointsError

class UpdatePointsTestCase(unittest.TestCase):
    def setUp(self):
        self.app = app.test_client()
        self.app_context = app.app_context()
        self.app_context.push()

    def tearDown(self):
        self.app_context.pop()

    @patch("app.authenticate_request", return_value=None)
    @patch("app.update_user_points")
    def test_update_points_success(self, mock_update_user_points, mock_authenticate):
        #simulates whether it will award points and return right status 
        mock_update_user_points.return_value = {"points_tot": 5}

        response = self.app.post("/update_points", data={
            "user_id": "500771d2-e06f-4aec-9737-bc2d06b265a9",
            "reward": 5
        })
        
        self.assertEqual(response.status_code, 200)
        self.assertIn("Points updated", response.get_json()["message"])
    
    @patch("app.authenticate_request", return_value=None)  
    @patch("app.update_user_points")  
    def test_update_points_no_negative_values(self, mock_update_user_points, mock_authenticate):
        # simulate reward a point that will result in negative score and getting correct status 
        mock_update_user_points.side_effect = Exception("Points cannot be negative")
        
        with app.test_client() as client:
            response = client.post('/update_points', data={
                'user_id': '500771d2-e06f-4aec-9737-bc2d06b265a9',
                'reward': -10
            })

            self.assertEqual(response.status_code, 400)
            self.assertIn("Points cannot be negative", response.get_data(as_text=True))
    
    @patch("app.authenticate_request", return_value=None)  
    @patch("app.check_points")  
    def test_unlock_note_insufficient_points(self, mock_check_points, mock_authenticate):
        #simulates whether or not get correct status when have insufficient points
        mock_check_points.side_effect = InsufficientPointsError("Insufficient points to unlock note.")

        with app.test_client() as client:
            response = client.post('/unlock_note', json={
                'user_id': '3ee65b8e-bcef-44fc-9b08-987f12a30374',
                'note_id': '05f2d689-49fc-4aed-a674-b6b8fb588e42'
            })

            self.assertEqual(response.status_code, 403)
            self.assertIn("Insufficient points", response.get_data(as_text=True))

if __name__ == "__main__":
    unittest.main()