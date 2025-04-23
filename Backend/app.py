from flask import Flask, jsonify
import psycopg2
from dotenv import load_dotenv
import os

load_dotenv()
app = Flask(__name__)

def get_db_connection():
    try:
        connection = psycopg2.connect(
            user=os.getenv("user"),
            password=os.getenv("password"),
            host=os.getenv("host"),
            port=os.getenv("port"),
            dbname=os.getenv("dbname")
        )
        return connection
    except Exception as e:
        print(f"Database connection failed: {e}")
        return None

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

# Run app
if __name__ == "__main__":
    app.run(debug=True)