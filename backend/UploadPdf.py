from connection import get_supabase_client
import uuid


def upload_pdf_to_bucket(jwt:str,file_path: str, user_id: str) -> str:
    file_name = f"{uuid.uuid4()}.pdf"
    storage_path = f"{user_id}/{file_name}"

    with open(file_path, "rb") as f:
        data = f.read()

    try:
        supabase = get_supabase_client(jwt)
        supabase.storage.from_("note-storage").upload(storage_path, data)
    except Exception as e:
        raise Exception(f"Storage upload failed: {str(e)}")

    return storage_path


def create_note(jwt:str,user_id: str, title: str, storage_path: str) -> str:
    note_id = str(uuid.uuid4())
    try:
        supabase = get_supabase_client(jwt)
        supabase.table("Note").insert({
            "note_id":     note_id,
            "user_id":     user_id,
            "votes":       0,
            "title":       title,
            "storage_path": storage_path
        }).execute()
    except Exception as e:
        raise Exception(f"DB insert failed: {e}")
    return note_id
