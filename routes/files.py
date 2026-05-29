"""
Metro Events — Event Files Routes
Upload and manage layouts, permits, contracts, floor plans,
and other documents per event.
"""

from flask import Blueprint, redirect, url_for, flash, request
from flask_login import login_required, current_user
from database import db
from models.event_file import EventFile, FILE_CATEGORIES
from models.event import Event
from storage import upload_file, delete_file as supabase_delete

files_bp = Blueprint("files", __name__, url_prefix="/events")

ALLOWED_EXTS = {"png", "jpg", "jpeg", "gif", "pdf", "docx", "doc",
                "xlsx", "xls", "zip", "mp4", "mov"}


# ── Upload ────────────────────────────────────────────────────────────────

@files_bp.route("/<int:event_id>/files/upload", methods=["POST"])
@login_required
def upload_file_route(event_id):
    Event.query.get_or_404(event_id)
    uploaded = request.files.get("file")
    if not uploaded:
        flash("No file selected.", "warning")
        return redirect(url_for("events.detail", event_id=event_id, tab="files"))

    stored_name, file_url, size_kb, mime = upload_file(uploaded, ALLOWED_EXTS)
    if not stored_name:
        flash(f"Invalid file type. Allowed: {', '.join(sorted(ALLOWED_EXTS))}", "danger")
        return redirect(url_for("events.detail", event_id=event_id, tab="files"))

    ef = EventFile(
        event_id          = event_id,
        category          = request.form.get("category", "other"),
        original_filename = uploaded.filename,
        stored_filename   = stored_name,
        file_url          = file_url,
        file_size_kb      = size_kb,
        mime_type         = mime,
        description       = request.form.get("description", "").strip(),
        uploaded_by       = current_user.id,
        is_client_visible = request.form.get("is_client_visible") == "1",
    )
    db.session.add(ef)
    db.session.commit()
    flash(f"\'{uploaded.filename}\' uploaded.", "success")
    return redirect(url_for("events.detail", event_id=event_id, tab="files"))


# ── Delete ────────────────────────────────────────────────────────────────

@files_bp.route("/<int:event_id>/files/<int:file_id>/delete", methods=["POST"])
@login_required
def delete_file(event_id, file_id):
    ef = EventFile.query.get_or_404(file_id)
    if not current_user.is_admin:
        flash("Only admins can delete files.", "danger")
        return redirect(url_for("events.detail", event_id=event_id, tab="files"))

    supabase_delete(ef.stored_filename)
    db.session.delete(ef)
    db.session.commit()
    flash("File deleted.", "warning")
    return redirect(url_for("events.detail", event_id=event_id, tab="files"))


# ── Toggle client visibility ──────────────────────────────────────────────

@files_bp.route("/<int:event_id>/files/<int:file_id>/toggle_visibility",
                methods=["POST"])
@login_required
def toggle_visibility(event_id, file_id):
    ef = EventFile.query.get_or_404(file_id)
    ef.is_client_visible = not ef.is_client_visible
    db.session.commit()
    state = "visible to client" if ef.is_client_visible else "hidden from client"
    flash(f"File is now {state}.", "info")
    return redirect(url_for("events.detail", event_id=event_id, tab="files"))
