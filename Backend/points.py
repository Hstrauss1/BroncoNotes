from flask import g
from interaction import unlocked_note

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
            raise Exception("Insufficient points to unlock note.")

        update_user_points(user_id, -note_cost)
        unlocked_note(user_id, note_id)
        return {"message": "Note unlocked successfully"}

    except Exception as e:
        raise Exception(f"Failed to unlock note: {str(e)}")
