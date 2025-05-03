from datetime import datetime
from flask import g

def like_note(user_id, note_id):
    exists = g.supabase_client.table("Likes").select("*").eq("user_id", user_id).eq("note_id", note_id).execute()

    if exists.data:
        raise Exception("User already liked this note.")

    response = g.supabase_client.table("Likes").insert({
        "note_id": note_id,
        "user_id": user_id  
    }).execute()

    return response

def comment_note(user_id, note_id, comment_text):
    exists = g.supabase_client.table("Comment").select("*") \
        .eq("note_id", note_id).eq("user_id", user_id).execute()

    if exists.data:
        raise Exception("Comment already exists for this user and note.")

    # If not, insert the new comment
    create_timestamp = datetime.now().isoformat()
    response = g.supabase_client.table("Comment").insert({
        "note_id": note_id,
        "user_id": user_id,
        "review": comment_text,
        "create_time": create_timestamp
    }).execute()

    return response.data