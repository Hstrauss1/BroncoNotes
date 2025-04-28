from flask import Flask, jsonify, render_template_string
from connection import get_db_connection, fetch_accounts


app = Flask(__name__)

# Route example, testing purposes
@app.route("/time")
def get_time():
    conn = get_db_connection()
    if not conn:
        return jsonify({"error": "Database connection failed"}), 500

    cursor = conn.cursor()
    cursor.execute("SELECT NOW();")
    current_time = cursor.fetchone()[0]

    cursor.close()
    conn.close()
    print("here")
    return jsonify({"current_time": current_time.isoformat()})


@app.route('/')
def account_json():
    account, columns = fetch_accounts()  # prints row but doesn't show here
    account_list = []
    for row in account:
        account_dict = dict(zip(columns, row))
        account_list.append(account_dict)
    return jsonify(account_list)

# Run app
if __name__ == "__main__":
    app.run(debug=True)