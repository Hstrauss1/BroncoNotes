from flask import Flask, jsonify, request
from flask.helpers import abort
from UploadPdf import create_note, upload_pdf_to_bucket
from auth import authenticate_request
from user import fetch_user_by_id, get_or_create_user

app = Flask(__name__)

@app.before_request
def before_request():
    if request.endpoint not in ['static', 'public']:
        error = authenticate_request()
        if error:
            return error

@app.route('/')
def account_json():
    return jsonify({
      "test":"Hello"
    })

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

@app.route("/upload-note", methods=["POST"])
def upload_note():
    file = request.files["pdf"]
    title = request.form["title"]
    user_id = request.form["user_id"]

    temp_path = f"/tmp/{file.filename}"
    file.save(temp_path)

    try:
        storage_path = upload_pdf_to_bucket(temp_path, user_id)
        print("upload_pdf_to_bucket returned:", storage_path)
    except Exception as e:
        print("upload_pdf_to_bucket failed:", e)
        return jsonify({"error": str(e)}), 500

    try:
        note_id = create_note(user_id, title, storage_path)
        print("create_note returned note_id:", note_id)
    except Exception as e:
        print("create_note failed:", e)
        return jsonify({"error": str(e)}), 500

    return jsonify({"note_id": note_id, "pdf_path": storage_path})

# Run app
if __name__ == "__main__":
    app.run(debug=True)
