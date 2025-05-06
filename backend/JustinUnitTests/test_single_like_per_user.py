import unittest
from unittest.mock import MagicMock
from flask import g
from app import app
from interaction import like_note

class TestLikeNote(unittest.TestCase):
    def test_user_can_like_note_only_once(self):
        with app.app_context():
            mock_client = MagicMock()
            g.supabase_client = mock_client

            # Mock check for existing like
            existing_like_response = MagicMock()
            existing_like_response.data = [{"user_id": "user123", "note_id": "note456"}]
            
            like_check_mock = MagicMock()
            like_check_mock.select.return_value.eq.return_value.eq.return_value.execute.return_value = existing_like_response

            mock_client.table.return_value = like_check_mock

            with self.assertRaises(Exception) as context:
                like_note("user123", "note456")
            
            self.assertIn("User already liked this note", str(context.exception))
