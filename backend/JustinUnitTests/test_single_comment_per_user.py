import unittest
from unittest.mock import MagicMock
from flask import g
from app import app
from interaction import comment_note

class TestCommentOnNote(unittest.TestCase):
    def test_user_can_comment_only_once(self):
        with app.app_context():
            mock_client = MagicMock()
            g.supabase_client = mock_client

            # Mock check for existing comment
            existing_comment_response = MagicMock()
            existing_comment_response.data = [{"user_id": "user123", "note_id": "note456"}]

            comment_check_mock = MagicMock()
            comment_check_mock.select.return_value.eq.return_value.eq.return_value.execute.return_value = existing_comment_response

            mock_client.table.return_value = comment_check_mock

            with self.assertRaises(Exception) as context:
                comment_note("user123", "note456", "Great note!")

            self.assertIn("Comment already exists for this user and note", str(context.exception))
