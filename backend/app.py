from __future__ import annotations

import os
from pathlib import Path

from flask import Flask, jsonify, request, send_from_directory, session
from werkzeug.security import check_password_hash, generate_password_hash

from storage import create_user, find_user_by_email, find_user_by_id, load_db, save_db


def create_app() -> Flask:
    app = Flask(__name__)

    # Session cookie auth (simple, good for same-origin websites)
    app.config["SECRET_KEY"] = os.environ.get("FLASK_SECRET_KEY", "dev-secret-change-me")
    app.config["SESSION_COOKIE_HTTPONLY"] = True
    app.config["SESSION_COOKIE_SAMESITE"] = "Lax"

    repo_root = Path(__file__).resolve().parents[1]

    def current_user():
        user_id = session.get("user_id")
        if not user_id:
            return None
        db = load_db()
        return find_user_by_id(db, int(user_id))

    def public_user(user):
        return {"id": user["id"], "email": user["email"], "profile": user.get("profile", {})}

    @app.get("/api/me")
    def api_me():
        u = current_user()
        if not u:
            return jsonify({"authenticated": False, "user": None})
        return jsonify({"authenticated": True, "user": public_user(u)})

    @app.post("/api/register")
    def api_register():
        data = request.get_json(silent=True) or {}
        email = str(data.get("email", "")).strip()
        password = str(data.get("password", ""))
        first_name = str(data.get("firstName", "")).strip()
        last_name = str(data.get("lastName", "")).strip()

        if not email or "@" not in email:
            return jsonify({"ok": False, "error": "Please provide a valid email address."}), 400
        if not password or len(password) < 8:
            return jsonify({"ok": False, "error": "Password must be at least 8 characters."}), 400
        if not first_name or not last_name:
            return jsonify({"ok": False, "error": "First name and last name are required."}), 400

        db = load_db()
        if find_user_by_email(db, email):
            return jsonify({"ok": False, "error": "An account with this email already exists."}), 409

        pwd_hash = generate_password_hash(password)
        user = create_user(
            db,
            email=email,
            password_hash=pwd_hash,
            first_name=first_name,
            last_name=last_name,
        )
        save_db(db)

        session["user_id"] = user["id"]
        return jsonify({"ok": True, "user": public_user(user)})

    @app.post("/api/login")
    def api_login():
        data = request.get_json(silent=True) or {}
        email = str(data.get("email", "")).strip()
        password = str(data.get("password", ""))

        if not email or not password:
            return jsonify({"ok": False, "error": "Email and password are required."}), 400

        db = load_db()
        user = find_user_by_email(db, email)
        if not user or not check_password_hash(user.get("passwordHash", ""), password):
            return jsonify({"ok": False, "error": "Invalid email or password."}), 401

        session["user_id"] = user["id"]
        return jsonify({"ok": True, "user": public_user(user)})

    @app.post("/api/logout")
    def api_logout():
        session.pop("user_id", None)
        return jsonify({"ok": True})

    # Static site serving (your existing HTML/CSS/JS in repo root)
    @app.get("/")
    def serve_index():
        return send_from_directory(repo_root, "index.html")

    @app.get("/<path:asset_path>")
    def serve_any(asset_path: str):
        # Prevent accessing backend files.
        if asset_path.startswith("backend/") or asset_path.startswith("backend\\"):
            return jsonify({"ok": False, "error": "Not found"}), 404
        target = (repo_root / asset_path).resolve()
        if repo_root not in target.parents and target != repo_root:
            return jsonify({"ok": False, "error": "Not found"}), 404
        if not target.exists() or not target.is_file():
            return jsonify({"ok": False, "error": "Not found"}), 404
        return send_from_directory(repo_root, asset_path)

    return app


if __name__ == "__main__":
    app = create_app()
    app.run(host="127.0.0.1", port=5000, debug=True)

