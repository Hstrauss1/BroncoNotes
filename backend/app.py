from flask import Flask, jsonify, request
from flask.helpers import abort
from UploadPdf import create_note, upload_pdf_to_bucket
from user import fetch_user_by_id, get_or_create_user
from connection import get_supabase_client, fetch_accounts

app = Flask(__name__)

# Route example, testing purposes
supabase = get_supabase_client()

@app.route('/')
def account_json():
    accounts = fetch_accounts()
    return jsonify(accounts)

@app.route("/initialize-user", methods=["POST"])
def init_user():
    body = request.get_json()
    user_id = body.get("user_id")

    if not user_id:
        return jsonify({"error": "Missing user_id in request body"}), 400

    user = get_or_create_user(user_id, 10)
    if user is None:
        return jsonify({"error": "Could not fetch or create user"}), 500

    return jsonify(user)

@app.route("/user/<user_id>", methods=["GET"])
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
