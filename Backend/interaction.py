from datetime import datetime
from flask import g
from points import update_user_points, update_note_cost

def like_note(user_id, note_id):
    exists = g.supabase_client.table("Likes").select("*").eq("user_id", user_id).eq("note_id", note_id).execute()

    if exists.data:
        raise Exception("User already liked this note.")

    response = g.supabase_client.table("Likes").insert({
        "note_id": note_id,
        "user_id": user_id  
    }).execute()
    
    note_response = g.supabase_client.table("Note") \
        .select("user_id") \
        .eq("note_id", note_id) \
        .single() \
        .execute()

    if not note_response.data:
        raise Exception("Note not found.")

    note_user_id = note_response.data["user_id"]
    update_note_cost(note_id)
    update_user_points(note_user_id)
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

def unlocked_note(user_id, note_id):
    exists = g.supabase_client.table("Unlocked").select("*").eq("user_id", user_id).eq("note_id", note_id).execute()

    if exists.data:
        raise Exception("User already unlocked this note.")

    response = g.supabase_client.table("Unlocked").insert({
        "note_id": note_id,
        "user_id": user_id  
    }).execute()

    return response