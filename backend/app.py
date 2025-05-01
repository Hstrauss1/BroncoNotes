from flask import Flask, jsonify, request
from flask.helpers import abort
from UploadPdf import create_note, upload_pdf_to_bucket
from auth import require_auth
from user import fetch_user_by_id
from connection import get_supabase_client, fetch_accounts

app = Flask(__name__)

# Route example, testing purposes
supabase = get_supabase_client()

@app.route('/')
@require_auth
def account_json():
    accounts = fetch_accounts()
    return jsonify(accounts)

@app.route("/user/<user_id>", methods=["GET"])
@require_auth
def get_user(user_id):
    user = fetch_user_by_id(user_id)
    if user is None:
        abort(404, description="User not found")
    return jsonify(user)

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
