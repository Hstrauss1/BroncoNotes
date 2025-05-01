from supabase import create_client, Client
from dotenv import load_dotenv
import os
from postgrest.exceptions import APIError
import logging

load_dotenv()

def get_supabase_client() -> Client:
    url = os.getenv("SUPABASE_URL")
    key = os.getenv("SUPABASE_ANON_KEY")
    if url is None or key is None:
        raise RuntimeError("SUPABASE_URL and SUPABASE_ANON_KEY must be set")
    return create_client(url, key)

def fetch_accounts():
    supabase = get_supabase_client()

    try:
        # this will raise a PostgrestError if the HTTP request fails
        response = supabase.table("Account").select("*").execute()
    except APIError as e:
        print(f"Supabase API error: {e.code} – {e.message}")
        return [], []
    except Exception as e:
        print(f"Unexpected error: {e}")
        return [], []

    # At this point execute() succeeded with a 2xx
    rows = response.data or []                # type: ignore[attr-defined]
    column_names = list(rows[0].keys()) if rows else []

    print("Fetched rows:", rows)
    print("Column names:", column_names)
    return rows, column_names

if __name__ == "__main__":
    fetch_accounts()
