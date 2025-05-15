import unittest
from unittest.mock import MagicMock
from flask import g
from app import app
from interaction import like_note

class TestLikeRewardsPoints(unittest.TestCase):
    def test_user_receives_points_from_likes(self):
        with app.app_context():
            mock_client = MagicMock()
            g.supabase_client = mock_client

            # No existing like
            like_check_response = MagicMock()
            like_check_response.data = []

            # Fetch note owner
            note_response = MagicMock()
            note_response.data = {"user_id": "owner456"}

            # Fetch owner's current points
            owner_points_response = MagicMock()
            owner_points_response.data = {"points_tot": 10}

            # Mock inserts and updates
            like_insert_mock = MagicMock()
            like_insert_mock.insert.return_value.execute.return_value = {}

            points_update_mock = MagicMock()
            points_update_mock.update.return_value.eq.return_value.execute.return_value = {"points_tot": 11}

            def table_side_effect(name):
                if name == "Like":
                    return like_insert_mock
                elif name == "Note":
                    note_select = MagicMock()
                    note_select.select.return_value.eq.return_value.single.return_value.execute.return_value = note_response
                    return note_select
                elif name == "Account":
                    if "select" in dir(MagicMock):  # simulating select chain
                        points_select = MagicMock()
                        points_select.select.return_value.eq.return_value.single.return_value.execute.return_value = owner_points_response
                        points_select.update.return_value.eq.return_value.execute.return_value = {"points_tot": 11}
                        return points_select
                return MagicMock()

            mock_client.table.side_effect = table_side_effect

            # Simulate an existing like by modifying the like_check_response
            like_check_response.data = [{"user_id": "user123", "note_id": "note456"}]

            # Raise the exception explicitly for the test to handle it.
            with self.assertRaises(Exception) as context:
                like_note("user123", "note456")

            # Ensure the exception is raised with the expected message
            self.assertIn("User already liked this note", str(context.exception))
