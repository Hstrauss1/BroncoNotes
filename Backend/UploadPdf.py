from flask import Flask, jsonify

def upload_pdf_to_bucket(file_path: str, user_id: str):
    import uuid
    file_name = f"{uuid.uuid4()}.pdf"
    storage_path = f"{user_id}/{file_name}" # <user_id>/<note_id>.pdf save for bucket

    with open(file_path, "rb") as f:
        file_data = f.read()

    res = supabase.storage.from_("note-storage").upload(storage_path, file_data)
    if res.get("error"):
        raise Exception(res["error"]["message"])

    return storage_path  # to save  Notes table


def create_note(user_id: str, title: str, storage_path: str): #create note inside the tables
    note_id = str(uuid.uuid4())
    supabase.table("Note").insert({
        "note_id": note_id,
        "user_id": user_id,
        "votes": 0,
        "title": title,
        "storage_path": storage_path
    }).execute()
    return note_id
  
#FLASK UPLOAD CODE iht
@app.route("/upload-note", methods=["POST"])
def upload_note():
    file = request.files["pdf"]
    title = request.form["title"]
    user_id = request.form["user_id"]

    temp_path = f"/tmp/{file.filename}"
    file.save(temp_path)

    storage_path = upload_pdf_to_bucket(temp_path, user_id)
    note_id = create_note(user_id, title, storage_path)

    return jsonify({"note_id": note_id, "pdf_path": storage_path})
