from flask import Blueprint, request, jsonify
import json
import logging

from src.container import db_service

db_bp = Blueprint('db', __name__)



@db_bp.route("/register-project", methods=["POST"])
def register_project():
    owner = request.form.get("owner", "").strip()
    url = request.form.get("url", "").strip()

    files = request.files.getlist("files")

    try:
        relative_paths = json.loads(
            request.form.get("relative_paths", "[]")
        )
    except (json.JSONDecodeError, TypeError):
        return jsonify({
            "status": "error",
            "message": "Invalid relative_paths data",
        }), 400

    if not owner or not url:
        return jsonify({
            "status": "error",
            "message": "Owner and URL are required",
        }), 400

    if not isinstance(relative_paths, list):
        return jsonify({
            "status": "error",
            "message": "relative_paths must be a list",
        }), 400

    if not files:
        return jsonify({
            "status": "error",
            "message": "No source files were uploaded",
        }), 400

    if (
        len(relative_paths) != len(files)
        or not all(
            isinstance(path, str)
            for path in relative_paths
        )
    ):
        return jsonify({
            "status": "error",
            "message": "Files and paths do not match",
        }), 400

    try:
        project = db_service.register_project(
            owner=owner,
            url=url,
            files=files,
            relative_paths=relative_paths,
        )

        return jsonify({
            "status": "success",
            "message": "Project registered successfully",
            "data": project,
        }), 201

    except ValueError as error:
        return jsonify({
            "status": "error",
            "message": str(error),
        }), 400

    except Exception:
        # Registrar el traceback en los logs del servidor
        # antes de desplegar la aplicación en producción.
        import logging
        logging.exception("Failed to register project")

        return jsonify({
            "status": "error",
            "message": "Failed to register project",
        }), 500



@db_bp.route("/get-projects", methods=["GET"])
def get_projects():
    try:
        projects = db_service.get_all()

        return jsonify({
            "status": "success",
            "data": projects,
        }), 200

    except Exception:
        logging.exception("Failed to get projects")

        return jsonify({
            "status": "error",
            "message": "Failed to get projects",
        }), 500
