from flask import Flask, jsonify
from connection import get_supabase_client
import uuid

supabase = get_supabase_client()

def upload_pdf_to_bucket(file_path: str, user_id: str) -> str:
    # generate a random filename
    file_name = f"{uuid.uuid4()}.pdf"
    storage_path = f"{user_id}/{file_name}"

    # read the file
    with open(file_path, "rb") as f:
        data = f.read()

    # attempt the upload
    res = supabase.storage.from_("note-storage").upload(storage_path, data)

    if getattr(res, "error", None):
        err = res.error
        msg = getattr(err, "message", str(err))
        raise Exception(f"Storage upload failed: {msg}")

    return storage_path


def create_note(user_id: str, title: str, storage_path: str) -> str:
    
    note_id = str(uuid.uuid4())

    res = supabase.table("Note").insert({
        "note_id":     note_id,
        "user_id":     user_id,
        "votes":       0,
        "title":       title,
        "storage_path": storage_path
    }).execute()

    # check for errors
    if getattr(res, "error", None):
        err = res.error
        msg = getattr(err, "message", str(err))
        raise Exception(f"DB insert failed: {msg}")

    return note_id
