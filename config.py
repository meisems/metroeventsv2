"""
Metro Events — Configuration
Handles all environment-based settings for dev/production.
"""

import os
from dotenv import load_dotenv

load_dotenv()

BASE_DIR = os.path.abspath(os.path.dirname(__file__))


class Config:
    # ── Security ──────────────────────────────────────────────
    SECRET_KEY = os.environ.get("SECRET_KEY", "metro-events-dev-secret-2024")

    # ── Database ──────────────────────────────────────────────
    _db_url = os.environ.get(
        "DATABASE_URL",
        f"sqlite:///{os.path.join(BASE_DIR, 'metro_events.db')}"
    )
    # Supabase / Heroku ship "postgres://" but SQLAlchemy needs "postgresql://"
    if _db_url.startswith("postgres://"):
        _db_url = _db_url.replace("postgres://", "postgresql://", 1)

    SQLALCHEMY_DATABASE_URI    = _db_url
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # ── Supabase Storage ───────────────────────────────────────
    SUPABASE_URL        = os.environ.get("SUPABASE_URL", "")
    SUPABASE_SERVICE_KEY = os.environ.get("SUPABASE_SERVICE_KEY", "")
    SUPABASE_BUCKET     = os.environ.get("SUPABASE_BUCKET", "metro-events")

    # ── App Info ───────────────────────────────────────────────
    APP_NAME    = "Metro Events"
    APP_TAGLINE = "Creating memories."
    APP_VERSION = "1.0.0"

    # ── Pagination ─────────────────────────────────────────────
    ITEMS_PER_PAGE = 20

    # ── File Uploads ───────────────────────────────────────────
    MAX_CONTENT_LENGTH = 16 * 1024 * 1024   # 16 MB hard limit
    ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg", "gif", "pdf", "docx", "xlsx"}

    # ── Email (optional — future phase) ───────────────────────
    MAIL_SERVER   = os.environ.get("MAIL_SERVER", "smtp.gmail.com")
    MAIL_PORT     = int(os.environ.get("MAIL_PORT", 587))
    MAIL_USE_TLS  = True
    MAIL_USERNAME = os.environ.get("MAIL_USERNAME")
    MAIL_PASSWORD = os.environ.get("MAIL_PASSWORD")


class DevelopmentConfig(Config):
    DEBUG = True
    SQLALCHEMY_ECHO = False   # set True to see SQL queries


class ProductionConfig(Config):
    DEBUG = False


config = {
    "development": DevelopmentConfig,
    "production":  ProductionConfig,
    "default":     DevelopmentConfig,
}
