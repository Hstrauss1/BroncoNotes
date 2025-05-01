from flask import Flask, jsonify, request
from backend.UploadPdf import create_note, upload_pdf_to_bucket
from backend.auth import require_auth
from connection import get_supabase_client, fetch_accounts

app = Flask(__name__)

# Route example, testing purposes
supabase = get_supabase_client()

@app.route('/')
@require_auth
def account_json():
    accounts = fetch_accounts()
    return jsonify(accounts)

# Need to update using the supabase python client
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


# Run app
if __name__ == "__main__":
    app.run(debug=True)
