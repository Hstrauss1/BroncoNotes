from flask import Flask
from supabase import create_client, Client

url = "https://rqkpgyozvfoprikbosfa.supabase.co"
key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJxa3BneW96dmZvcHJpa2Jvc2ZhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ1Njc4NzgsImV4cCI6MjA2MDE0Mzg3OH0.r9oxLtXAq7HT3RZQyw3W-3HFwBUtci4T7YvRjWHBYD4"
supabase: Client = create_client(url, key)

#for test purposes 
# response = supabase.table('Account').select('*').execute()
# print(response)


app = Flask(__name__)