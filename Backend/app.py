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
def index():
    account, columns = fetch_accounts()  # prints row but doesn't show here
    print("Account passed to template:", account)
    print("Columns:", columns)
    return render_template_string('''
        <h1>Account List</h1>
        {% if account %}
            <table border="1">
                <tr>
                    {% for col in columns %}
                        <th>{{ col }}</th>
                    {% endfor %}
                </tr>
                {% for row in account %}
                <tr>
                    {% for item in row %}
                        <td>{{ item }}</td>
                    {% endfor %}
                </tr>
                {% endfor %}
            </table>
        {% else %}
            <p>No accounts found.</p>
        {% endif %}
    ''', account=account, columns=columns)

# Run app
if __name__ == "__main__":
    app.run(debug=True)