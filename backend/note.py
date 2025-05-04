import logging
import uuid
from flask import g
from postgrest.exceptions import APIError


def upload_pdf_to_bucket(file_path: str, user_id: str) -> str:
    file_name = f"{uuid.uuid4()}.pdf"
    storage_path = f"{user_id}/{file_name}"

    with open(file_path, "rb") as f:
        data = f.read()

    try:
        g.supabase_client.storage.from_("note-storage").upload(storage_path, data)
    except Exception as e:
        raise Exception(f"Storage upload failed: {str(e)}")

    return storage_path


def create_note(user_id: str, title: str, storage_path: str) -> str:
    note_id = str(uuid.uuid4())
    try:
        g.supabase_client.table("Note").insert({
            "note_id":     note_id,
            "user_id":     user_id,
            "votes":       0,
            "title":       title,
            "storage_path": storage_path
        }).execute()
    except Exception as e:
        raise Exception(f"DB insert failed: {e}")
    return note_id

    note_id = str(uuid.uuid4())

def fetch_pdf_from_storage(storage_path: str):
    try:
        if not storage_path:
            print("Error: storage_path is empty.")
            return None

        print(f"Attempting to download from: '{storage_path}'")
        file_bytes = g.supabase_client.storage.from_("note-storage").download(storage_path)
        return file_bytes
    except Exception as e:
        print(f"Unexpected error fetching PDF: {e}")
        return None



def fetch_note_by_id(note_id: str):
    try:
        # only select the non-sensitive columns
        response = (
            g.supabase_client
              .table("Note")
              .select("*")
              .eq("note_id", note_id)
              .single()
              .execute()
        )

    except APIError as e:
        logging.error(f"Supabase API error fetching note {note_id}: {e.code} – {e.message}")
        return None
    except Exception as e:
        logging.error(f"Unexpected error fetching note {note_id}: {e}")
        return None

    data = response.data or {}
    if not data:
        # no user found
        return None
    return data
