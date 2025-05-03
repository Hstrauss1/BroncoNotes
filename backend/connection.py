from supabase import create_client, Client
from dotenv import load_dotenv
import os
from supabase.lib.client_options import SyncClientOptions

load_dotenv()

def get_supabase_client(jwt:str) -> Client:
    url = os.getenv("SUPABASE_URL")
    key = os.getenv("SUPABASE_ANON_KEY")
    if url is None or key is None:
        raise RuntimeError("SUPABASE_URL and SUPABASE_ANON_KEY must be set")

    return create_client(url, key, SyncClientOptions(headers={"Authorization": f"Bearer {jwt}"}))
