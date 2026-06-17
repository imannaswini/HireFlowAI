import sys
import os

# Ensure the parent directory is in Python path so app imports work
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

def check_env():
    print("Checking Environment Variables...")
    from app.core.config import settings
    passed = True
    print(f"  DATABASE_URL loaded: {'YES' if settings.DATABASE_URL else 'NO'}")
    print(f"  PORT loaded: {settings.PORT}")
    print(f"  HOST loaded: {settings.HOST}")
    if not settings.DATABASE_URL:
        passed = False
    return "PASS" if passed else "FAIL"

def check_gemini():
    print("Checking Gemini Configuration...")
    from app.core.config import settings
    if settings.GEMINI_API_KEY:
        print(f"  GEMINI_API_KEY found: Yes (Starts with {settings.GEMINI_API_KEY[:4]}...)")
    else:
        print("  GEMINI_API_KEY found: No (Running in rules-based fallback mode)")
    # Since rules-based fallback mode is expected when no key is present, this is considered a PASS
    return "PASS"

def check_postgres():
    print("Checking PostgreSQL Connection...")
    import psycopg2
    from app.core.config import settings
    try:
        url = settings.DATABASE_URL
        if url.startswith("postgresql://") or url.startswith("postgres://"):
            conn = psycopg2.connect(url)
            conn.close()
            print("  Raw PostgreSQL Connection: SUCCESS")
            return "PASS"
        else:
            print(f"  DATABASE_URL is not PostgreSQL: {url}")
            return "FAIL"
    except Exception as e:
        print(f"  Raw PostgreSQL Connection failed: {e}")
        return "FAIL"

def check_db_exists():
    print("Checking Database Existence...")
    import psycopg2
    from app.core.config import settings
    try:
        url = settings.DATABASE_URL
        conn = psycopg2.connect(url)
        conn.close()
        print("  Database 'hireflowai' exists and is accessible: YES")
        return "PASS"
    except Exception as e:
        print(f"  Database 'hireflowai' check failed: {e}")
        return "FAIL"

def check_engine():
    print("Checking SQLAlchemy Engine...")
    from app.database.session import engine
    from sqlalchemy import text
    try:
        with engine.connect() as conn:
            result = conn.execute(text("SELECT 1"))
            val = result.scalar()
            if val == 1:
                print("  SQLAlchemy Connection Test: SUCCESS")
                return "PASS"
            else:
                print(f"  SQLAlchemy Connection Test returned unexpected value: {val}")
                return "FAIL"
    except Exception as e:
        print(f"  SQLAlchemy Engine creation/connection failed: {e}")
        return "FAIL"

def check_fastapi():
    print("Checking FastAPI App Importability...")
    try:
        from app.main import app
        print(f"  FastAPI app imported successfully: {app.title}")
        return "PASS"
    except Exception as e:
        print(f"  FastAPI app import failed: {e}")
        return "FAIL"

def main():
    print("==================================================")
    print("        HIREFLOW AI BACKEND HEALTH CHECK          ")
    print("==================================================")
    
    results = {}
    results["Environment Variables"] = check_env()
    print("-" * 50)
    results["Gemini Configuration"] = check_gemini()
    print("-" * 50)
    results["PostgreSQL Connection"] = check_postgres()
    print("-" * 50)
    results["Database Existence"] = check_db_exists()
    print("-" * 50)
    results["SQLAlchemy Engine"] = check_engine()
    print("-" * 50)
    results["FastAPI Importability"] = check_fastapi()
    print("==================================================")
    print("                 SUMMARY RESULTS                  ")
    print("==================================================")
    all_passed = True
    for subsystem, status in results.items():
        print(f"{subsystem:<25}: {status}")
        if status != "PASS":
            all_passed = False
            
    print("==================================================")
    if all_passed:
        print("          ALL SYSTEMS OPERATIONAL (PASS)          ")
        sys.exit(0)
    else:
        print("          SOME SYSTEMS FAILED (FAIL)             ")
        sys.exit(1)

if __name__ == "__main__":
    main()
