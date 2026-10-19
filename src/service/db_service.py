import shutil
from werkzeug.datastructures import FileStorage
from src.repository.Repository import ProjectsRepository

from src.scripts.utils import build_folder, PROJECT_ROOT

class DBService:
    def __init__(self, repository:ProjectsRepository):
        self.__repository = repository

    def register_project(
            self,
            owner: str,
            url: str,
            files: list[FileStorage],
            relative_paths: list[str],
        ) -> dict:

        project_id, project_path = build_folder(
            files,
            relative_paths,
        )

        try:
            stored_path = project_path.relative_to(
                PROJECT_ROOT
            ).as_posix()

            project_data = {
                "id": project_id,
                "owner": owner,
                "url": url,
                "path": stored_path,
                "last_static_analysis": None,
                "last_dynamic_analysis": None,
            }

            self.__repository.insert(**project_data)

            return project_data

        except Exception:
            # La carpeta fue creada por esta operación.
            # Si falla la persistencia, eliminamos esa carpeta.
            shutil.rmtree(project_path, ignore_errors=True)
            raise

    def get_all(self):
        return self.__repository.get_all()