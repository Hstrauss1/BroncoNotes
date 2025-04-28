import psycopg2
from dotenv import load_dotenv
import os

load_dotenv()

def get_db_connection():
    try:
        connection = psycopg2.connect(
            user=os.getenv("user"),
            password=os.getenv("password"),
            host=os.getenv("host"),
            port=os.getenv("port"),
            dbname=os.getenv("dbname"),
            sslmode='require'
        )
        return connection
    except Exception as e:
        print(f"Database connection failed: {e}")
        return None

def fetch_accounts():
    connection = get_db_connection()
    if connection is None:
        return [] 
    try:
        cursor = connection.cursor()
        cursor.execute('SELECT * FROM public."Account";')
        rows = cursor.fetchall()
        column_names = [desc[0] for desc in cursor.description]
        print("Fetched rows:", rows)
        print("Column names:", column_names)
        return rows, column_names
    except Exception as e:
        print(f"Query failed: {e}")
        return []
    finally:
        if connection:
            cursor.close()
            connection.close()
