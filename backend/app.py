from flask import Flask, jsonify, request
from flask.helpers import abort
from UploadPdf import create_note, upload_pdf_to_bucket
from auth import authenticate_request
from user import fetch_user_by_id, get_or_create_user
from points import update_user_points, update_note_cost, check_points
from interaction import like_note, comment_note

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

@app.route('/update_points', methods=['POST'])
def update_points():
    try:
        user_id = request.form.get('user_id')
        reward = request.form.get('reward', default=1, type=int)

        if not user_id:
            return jsonify({"error": "Missing user_id"}), 400

        data = update_user_points(user_id, reward)
        return jsonify({"message": "Points updated", "data": data}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/update_cost', methods=['POST'])
def update_cost():
    try:
        note_id = request.form.get('note_id')
        increment = request.form.get('increment', default=1, type=int)

        if not note_id:
            return jsonify({"error": "Missing note_id"}), 400

        data = update_note_cost(note_id, increment)
        return jsonify({"message": "Note cost updated", "data": data}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/unlock_note', methods=['POST'])
def unlock_note():
    try:
        data = request.get_json()
        user_id = data.get("user_id")
        note_id = data.get("note_id")

        if not user_id or not note_id:
            return jsonify({"error": "Missing user_id or note_id"}), 400

        result = check_points(user_id, note_id)
        return jsonify(result), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 400

@app.route('/like_note', methods=['POST'])
def like_note_endpoint():
    try:
        data = request.get_json()
        user_id = data.get("user_id")
        note_id = data.get("note_id")

        if not user_id or not note_id:
            return jsonify({"error": "Both user_id and note_id must be provided."}), 400

        response = like_note(user_id, note_id)
        return jsonify({"message": "Note liked successfully."}), 200

    except Exception as e:
        return jsonify({"error": f"Failed to like note: {str(e)}"}), 500

@app.route('/comment', methods=['POST'])
def comment_note_endpoint():
    try:
        data = request.get_json()
        user_id = data.get("user_id")
        note_id = data.get("note_id")
        comment_text = data.get("comment_text")

        if not user_id or not note_id or not comment_text:
            return jsonify({"error": "Missing user_id, note_id, or comment_text"}), 400
        
        result = comment_note(user_id, note_id, comment_text)
        return jsonify({"message": "Comment added successfully", "data": result}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 400

# Run app
if __name__ == "__main__":
    app.run(debug=True)
