from datetime import datetime
from flask import g

class InsufficientPointsError(Exception):
    pass

def update_user_points(user_id, reward=1):
    response = g.supabase_client.table("Account") \
        .select("points_tot") \
        .eq("user_id", user_id) \
        .single() \
        .execute()

    current_points = response.data["points_tot"] if response.data else 0
    new_points = current_points + reward
    if new_points < 0:
            raise Exception("Points cannot be negative.")

    update_response = g.supabase_client.table("Account") \
        .update({"points_tot": new_points}) \
        .eq("user_id", user_id) \
        .execute()

    return update_response.data

def update_note_cost(note_id, increment=1):
    response = g.supabase_client.table("Note") \
        .select("cost") \
        .eq("note_id", note_id) \
        .single() \
        .execute()

    current_cost = response.data["cost"] if response.data else 0
    new_cost = current_cost + increment
    update_response = g.supabase_client.table("Note") \
        .update({"cost": new_cost}) \
        .eq("note_id", note_id) \
        .execute()

    return update_response.data

def check_points(user_id, note_id):
    try:
        user_response = g.supabase_client.table("Account") \
            .select("points_tot") \
            .eq("user_id", user_id) \
            .single() \
            .execute()

        if not user_response.data:
            raise Exception("User not found")

        user_points = user_response.data["points_tot"]

        # Get note cost
        note_response = g.supabase_client.table("Note") \
            .select("cost") \
            .eq("note_id", note_id) \
            .single() \
            .execute()

        if not note_response.data:
            raise Exception("Note not found")

        note_cost = note_response.data["cost"]
        if user_points < note_cost:
            raise InsufficientPointsError("Insufficient points to unlock note.")

        update_user_points(user_id, -note_cost)
        unlocked_note(user_id, note_id)
        return {"message": "Note unlocked successfully"}
    
    except InsufficientPointsError:
        raise
    except Exception as e:
        raise Exception(f"Failed to unlock note: {str(e)}")


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

    if user_id == note_user_id:
        raise Exception("Users cannot like their own notes.")
    
    update_note_cost(note_id)
    update_user_points(note_user_id)
    return response

def comment_note(user_id, note_id, comment_text):
    exists = g.supabase_client.table("Comment").select("*") \
        .eq("note_id", note_id).eq("user_id", user_id).execute()

    if exists.data:
        raise Exception("Comment already exists for this user and note.")

    note_response = g.supabase_client.table("Note") \
        .select("user_id") \
        .eq("note_id", note_id) \
        .single() \
        .execute()

    if not note_response.data:
        raise Exception("Note not found.")

    note_user_id = note_response.data["user_id"]

    if user_id == note_user_id:
        raise Exception("Users cannot comment on their own notes.")
    
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

    note_response = g.supabase_client.table("Note") \
        .select("user_id") \
        .eq("note_id", note_id) \
        .single() \
        .execute()
    
    if not note_response.data:
        raise Exception("Note not found.")

    if exists.data:
        raise Exception("User already unlocked this note.")

    response = g.supabase_client.table("Unlocked").insert({
        "note_id": note_id,
        "user_id": user_id
    }).execute()

    return response

def add_tag(note_id, tag):
    note_response = g.supabase_client.table("Note") \
        .select("note_id") \
        .eq("note_id", note_id) \
        .single() \
        .execute()

    if not note_response.data:
        raise Exception("Note not found.")
  
    tag_exists = g.supabase_client.table("Tags") \
        .select("*") \
        .eq("note_id", note_id) \
        .eq("tag", tag) \
        .execute()

    if tag_exists.data:
        raise Exception("This tag already exists for the note.")

    response = g.supabase_client.table("Tags").insert({
        "note_id": note_id,
        "tag": tag
    }).execute()

    return response

def get_tags(note_id):
    tag_response = g.supabase_client.table("Tags") \
        .select("tag") \
        .eq("note_id", note_id) \
        .execute()

    if not tag_response.data:
        return []  

    tags = [entry["tag"] for entry in tag_response.data]
    return tags

def get_liked_notes(user_id):
    like_response = g.supabase_client.table("Likes") \
        .select("note_id") \
        .eq("user_id", user_id) \
        .execute()

    if not like_response.data:
        return []

    note_ids = [entry["note_id"] for entry in like_response.data]
    return note_ids

def get_notes_by_tag(tag):
    tag_response = g.supabase_client.table("Tags") \
        .select("note_id") \
        .eq("tag", tag) \
        .execute()

    if not tag_response.data:
        return []

    note_ids = [entry["note_id"] for entry in tag_response.data]
    return note_ids