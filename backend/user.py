from typing import Optional, Dict, Any
from postgrest.exceptions import APIError
from connection import get_supabase_client
import logging

def fetch_user_by_id(user_id: str) -> Optional[Dict[str, Any]]:
    """
    Fetch a single user record from the "Account" table by user_id.
    Returns:
      - A dict of that user’s fields (excluding password) on success
      - None if no such user or on error
    """
    supabase = get_supabase_client()
    print(user_id)

    try:
        # only select the non-sensitive columns
        response = (
            supabase
              .table("Account")
              .select("user_id, username, points_tot, email")
              .eq("user_id", user_id)
              .single()
              .execute()
        )
    except APIError as e:
        logging.error(f"Supabase API error fetching user {user_id}: {e.code} – {e.message}")
        return None
    except Exception as e:
        logging.error(f"Unexpected error fetching user {user_id}: {e}")
        return None

    data = response.data or {}
    if not data:
        # no user found
        return None

    return data
