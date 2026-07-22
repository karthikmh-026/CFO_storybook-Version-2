import os
import psycopg2

PG_HOST = os.environ.get("PG_HOST", "192.168.1.45")
PG_PORT = os.environ.get("PG_PORT", "5432")
PG_USER = os.environ.get("PG_USER", "postgres")
PG_PASSWORD = os.environ.get("PG_PASSWORD", "postgres")
PG_DBNAME = os.environ.get("PG_DBNAME", "Pitti")

# Load local .env file if it exists
env_path = os.path.join(os.path.dirname(__file__), ".env")
if os.path.exists(env_path):
    with open(env_path, "r") as f:
        for line in f:
            line = line.strip()
            # Support both '=' and '-' just in case
            sep = None
            if "=" in line:
                sep = "="
            elif "-" in line and not line.startswith("#"):
                sep = "-"
                
            if line and not line.startswith("#") and sep:
                key, val = line.split(sep, 1)
                key = key.strip()
                val = val.strip().strip('"').strip("'")
                os.environ[key] = val
                if key == "PG_HOST": PG_HOST = val
                elif key == "PG_PORT": PG_PORT = val
                elif key == "PG_USER": PG_USER = val
                elif key == "PG_PASSWORD": PG_PASSWORD = val
                elif key == "PG_DBNAME": PG_DBNAME = val


# Track whether PostgreSQL is reachable so we don't wait 2s on every call
_pg_available = None  # None = untested, True = reachable, False = unreachable
_offline_cache = {}   # cache OfflineConnection instances by dbname


def connect(dbname=None):
    global _pg_available
    target_db = dbname or PG_DBNAME

    # If we already know PG is unreachable, go straight to offline
    if _pg_available is False:
        return _get_offline(target_db)

    try:
        conn = psycopg2.connect(
            host=PG_HOST,
            port=PG_PORT,
            user=PG_USER,
            password=PG_PASSWORD,
            dbname=target_db,
            connect_timeout=2
        )
        _pg_available = True
        return conn
    except Exception as e:
        if _pg_available is None:
            print(f"Database connection failed ({e}). Falling back to Offline mode using local Excel files.")
        _pg_available = False
        return _get_offline(target_db)


def _get_offline(target_db):
    """Return a cached OfflineConnection for the given database."""
    if target_db not in _offline_cache:
        try:
            from offline_db import OfflineConnection
            _offline_cache[target_db] = OfflineConnection(target_db)
        except Exception as inner_err:
            print(f"Failed to load Offline Connection: {inner_err}")
            raise
    return _offline_cache[target_db]

