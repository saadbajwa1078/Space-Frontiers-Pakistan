from __future__ import annotations

import json
import os
import threading
from dataclasses import dataclass
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Dict, Optional


_LOCK = threading.Lock()


def _utc_now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


@dataclass(frozen=True)
class DbPaths:
    data_dir: Path
    db_file: Path


def default_paths() -> DbPaths:
    base = Path(__file__).resolve().parent
    data_dir = base / "data"
    return DbPaths(data_dir=data_dir, db_file=data_dir / "db.json")


def _ensure_db_exists(db_path: Path) -> None:
    db_path.parent.mkdir(parents=True, exist_ok=True)
    if db_path.exists():
        return
    initial = {"nextUserId": 1, "users": []}
    tmp = db_path.with_suffix(".json.tmp")
    tmp.write_text(json.dumps(initial, indent=2), encoding="utf-8")
    os.replace(tmp, db_path)


def load_db(db_path: Optional[Path] = None) -> Dict[str, Any]:
    paths = default_paths()
    db_file = db_path or paths.db_file
    with _LOCK:
        _ensure_db_exists(db_file)
        raw = db_file.read_text(encoding="utf-8")
        return json.loads(raw) if raw.strip() else {"nextUserId": 1, "users": []}


def save_db(db: Dict[str, Any], db_path: Optional[Path] = None) -> None:
    paths = default_paths()
    db_file = db_path or paths.db_file
    with _LOCK:
        db_file.parent.mkdir(parents=True, exist_ok=True)
        tmp = db_file.with_suffix(".json.tmp")
        tmp.write_text(json.dumps(db, indent=2), encoding="utf-8")
        os.replace(tmp, db_file)


def find_user_by_email(db: Dict[str, Any], email: str) -> Optional[Dict[str, Any]]:
    email_lc = email.strip().lower()
    for u in db.get("users", []):
        if str(u.get("email", "")).lower() == email_lc:
            return u
    return None


def find_user_by_id(db: Dict[str, Any], user_id: int) -> Optional[Dict[str, Any]]:
    for u in db.get("users", []):
        if int(u.get("id", -1)) == int(user_id):
            return u
    return None


def create_user(
    db: Dict[str, Any],
    *,
    email: str,
    password_hash: str,
    first_name: str,
    last_name: str,
) -> Dict[str, Any]:
    users = db.setdefault("users", [])
    next_id = int(db.get("nextUserId") or 1)
    user = {
        "id": next_id,
        "email": email.strip().lower(),
        "passwordHash": password_hash,
        "createdAt": _utc_now_iso(),
        "profile": {"firstName": first_name.strip(), "lastName": last_name.strip()},
    }
    users.append(user)
    db["nextUserId"] = next_id + 1
    return user

