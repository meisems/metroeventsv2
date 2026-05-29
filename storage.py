"""
Metro Events — Supabase Storage Helper
Replaces all local disk uploads with Supabase Storage.

Env vars required:
    SUPABASE_URL         — e.g. https://xxxx.supabase.co
    SUPABASE_SERVICE_KEY — service role key (not anon key)
    SUPABASE_BUCKET      — storage bucket name (default: metro-events)
"""

import os
import uuid
from supabase import create_client


def _client():
    url = os.environ["SUPABASE_URL"]
    key = os.environ["SUPABASE_SERVICE_KEY"]
    return create_client(url, key)


BUCKET = os.environ.get("SUPABASE_BUCKET", "metro-events")


def upload_file(file, allowed_exts):
    """
    Upload a Werkzeug FileStorage object to Supabase Storage.

    Returns:
        (stored_filename, public_url, size_kb, mime_type)
        or (None, None, 0, None) on failure / wrong type.
    """
    if not file or not file.filename or "." not in file.filename:
        return None, None, 0, None

    ext = file.filename.rsplit(".", 1)[1].lower()
    if ext not in allowed_exts:
        return None, None, 0, None

    fname        = f"{uuid.uuid4().hex}.{ext}"
    data         = file.read()
    size_kb      = len(data) // 1024
    content_type = file.content_type or "application/octet-stream"

    sb = _client()
    sb.storage.from_(BUCKET).upload(
        path=fname,
        file=data,
        file_options={"content-type": content_type},
    )

    public_url = sb.storage.from_(BUCKET).get_public_url(fname)
    return fname, public_url, size_kb, content_type


def delete_file(stored_filename):
    """
    Delete a file from Supabase Storage by its stored filename (uuid.ext).
    Silently ignores errors so a missing file never crashes a delete route.
    """
    if not stored_filename:
        return
    try:
        _client().storage.from_(BUCKET).remove([stored_filename])
    except Exception:
        pass
