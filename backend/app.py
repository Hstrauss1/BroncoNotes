import io
import os
from flask import Flask, jsonify, request, send_file
from flask.helpers import abort
from note import create_note, fetch_pdf_from_storage, upload_pdf_to_bucket, fetch_note_by_id
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

@app.route("/initialize-user/<user_id>", methods=["POST"])
def init_user(user_id):
    if not user_id:
        return jsonify({"error": "Missing user_id in request body"}), 400

    data = request.get_json()
    user = get_or_create_user(user_id, data["avatar"],data["name"], 10)
    if user is None:
        return jsonify({"error": "Could not fetch or create user"}), 500

    return jsonify(user)

@app.route("/user/<user_id>", methods=["GET"])
def get_user(user_id):
    user = fetch_user_by_id(user_id)
    if user is None:
        abort(404, description="User not found")
    return jsonify(user)

@app.route("/note/<note_id>", methods=["GET"])
def get_note(note_id):
    note = fetch_note_by_id(note_id)
    if note is None:
        abort(404, description="Note not found")
    return jsonify(note)

@app.route('/storage', methods=['POST'])
def get_pdf_by_path():
    data = request.get_json()
    if not data or 'storage_path' not in data:
        return jsonify({"error": "Missing 'storage_path' in the request body"}), 400

    storage_path = data['storage_path']
    pdf_content = fetch_pdf_from_storage(storage_path)
    if pdf_content:
        return send_file(
            io.BytesIO(pdf_content),
            mimetype='application/pdf',
            as_attachment=False,  # Set to True to force download
            download_name=f"document_{os.path.basename(storage_path)}"
        )
    else:
        return {"error": "Failed to fetch PDF from storage"}, 404


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
