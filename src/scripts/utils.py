# src/scripts/utils.py

from pathlib import Path, PurePosixPath
from uuid import uuid4
import shutil
import re

from werkzeug.datastructures import FileStorage


# Raíz del proyecto: python-security/
PROJECT_ROOT = Path(__file__).resolve().parents[2]

# Carpeta donde se almacenarán los proyectos registrados.
WEB_SITES_ROOT = PROJECT_ROOT / "web-sites"


def _validate_relative_path(relative_path: str) -> Path:
    """
    Valida una ruta relativa recibida desde el frontend.
    Evita rutas absolutas y traversal mediante '..'.
    """
    if not relative_path or "\x00" in relative_path:
        raise ValueError("Invalid file path.")

    # Aceptar separadores de Windows y Unix,
    # pero procesarlos de forma consistente.
    normalized = relative_path.replace("\\", "/")

    if (
        normalized.startswith("/")
        or re.match(r"^[a-zA-Z]:", normalized)
    ):
        raise ValueError("Absolute paths are not allowed.")

    path = PurePosixPath(normalized)

    if any(part in ("", ".", "..") for part in path.parts):
        raise ValueError("Invalid path components.")

    return Path(*path.parts)


def build_folder(
    files: list[FileStorage],
    relative_paths: list[str],
) -> tuple[str, Path]:
    """
    Reconstruye un proyecto dentro de web-sites/<uuid>.

    Devuelve:
        project_id: identificador único del proyecto.
        project_path: ruta absoluta de la carpeta creada.
    """
    if not files or len(files) != len(relative_paths):
        raise ValueError("Files and paths do not match.")

    safe_paths = [
        _validate_relative_path(path)
        for path in relative_paths
    ]

    # No permitir rutas duplicadas dentro del mismo proyecto.
    normalized_paths = [
        path.as_posix().casefold()
        for path in safe_paths
    ]

    if len(set(normalized_paths)) != len(normalized_paths):
        raise ValueError("Duplicate file paths are not allowed.")

    WEB_SITES_ROOT.mkdir(parents=True, exist_ok=True)

    project_id = str(uuid4())
    project_path = WEB_SITES_ROOT / project_id

    try:
        project_path.mkdir()

        for uploaded_file, relative_path in zip(
            files, safe_paths
        ):
            destination = project_path / relative_path

            # Comprobación adicional de que el destino
            # permanece dentro de la carpeta del proyecto.
            destination_resolved = destination.resolve()
            destination_resolved.relative_to(
                project_path.resolve()
            )

            destination.parent.mkdir(
                parents=True,
                exist_ok=True,
            )

            # Escribir el contenido real del archivo.
            uploaded_file.save(destination_resolved)

        return project_id, project_path

    except Exception:
        # Si falla un archivo, eliminar el proyecto parcial.
        shutil.rmtree(project_path, ignore_errors=True)
        raise