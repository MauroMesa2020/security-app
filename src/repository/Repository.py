from src.db.dbaccess import DBAccess

from collections import Counter
from pathlib import Path
from uuid import uuid4


class ProjectsRepository:
    def __init__(self, data_access: DBAccess):
        self.data_access = data_access


    def insert(
            self, 
            id, 
            owner, 
            url, 
            path,
            last_static_analysis,
            last_dynamic_analysis
        ):

        inserted = self.data_access.insert(
            (id, owner, url, path, last_static_analysis, last_dynamic_analysis)
        )

        if inserted != 1:
            raise RuntimeError("The project could not be inserted")

        return inserted


    def delete(self, project_id):

        deleted = self.data_access.delete(
            (project_id,)
        )
        
        if deleted == 0:
            raise LookupError(
                f"Dont exist a project with id {project_id}"
            )

        return deleted

    def get_all(self):
        return self.data_access.get_all_projects()

    def get_by_id(self, project_id):
        project = self.data_access.get_by_id(
            (project_id,)
        )

        if project is None:
            raise LookupError(
                f"Dont exist a project with id {project_id}"
            )

        return project

    def get_all_static(self):
        return self.data_access.get_all_static()

    def get_all_dynamic(self):
        return self.data_access.get_all_dynamic()

    def get_by_owner(self, owner):
        project = self.data_access.get_by_owner(
            (owner,)
        )

        return project


    def get_by_path(self, path):
        project = self.data_access.get_by_path(
            (path,)
        )

        if project is None:
            raise LookupError(
                f"Dont exist a project with path {path}"
            )

        return project

    def save_semgrep_report(self, project_id, report, project_path):
            analysis_id = uuid4()
            findings = report.get("findings", [])
    
            # Resumir los resultados por severidad.
            severity_counts = Counter(
                (
                    finding.get("extra", {}).get("severity") or "UNKNOWN"
                ).upper()
                for finding in findings
            )
    
            summary = {
                "total_findings": len(findings),
                "severity_counts": dict(severity_counts),
                "execution_time": report.get("execution_time", 0),
                "errors_count": len(report.get("errors", []))
            }
    
            # Transformar los hallazgos al formato de PostgreSQL.
            normalized_findings = []
    
            for finding in findings:
                extra = finding.get("extra") or {}
                start = finding.get("start") or {}
                end = finding.get("end") or {}
    
                file_path = finding.get("path")
    
                # Preferir rutas relativas para mostrarlas en la interfaz.
                if file_path:
                    try:
                        file_path = str(
                            Path(file_path).resolve().relative_to(
                                Path(project_path).resolve()
                            )
                        )
                    except (ValueError, OSError):
                        pass
    
                code_fragment = extra.get("lines")
    
                # Semgrep puede devolver este texto como marcador,
                # no como fragmento de código real.
                if code_fragment == "requires login":
                    code_fragment = None
    
                normalized_findings.append({
                    "name": finding.get("check_id", "unknown"),
                    "description": extra.get("message"),
                    "severity": extra.get("severity"),
                    "file_path": file_path,
                    "line_start": start.get("line"),
                    "line_end": end.get("line"),
                    "code_fragment": code_fragment,
                    "payload": finding
                })
    
            self.data_access.save_analysis(
                analysis_id=analysis_id,
                project_id=project_id,
                analysis_type="static",
                summary=summary,
                raw_payload=report,
                findings=normalized_findings
            )
    
            return {
                "analysis_id": str(analysis_id),
                "project_id": str(project_id),
                "analysis_type": "static",
                "summary": summary
            }


    def get_analyses_by_project(self, project_id):
    # Verificar que el proyecto exista.
        self.get_by_id(project_id)

        return self.data_access.get_analyses_by_project(
            project_id
        )


    def get_analysis_details(self, analysis_id):
        result = self.data_access.get_analysis_details(
            analysis_id
        )

        if result is None:
            raise LookupError(
                f"Analysis {analysis_id} does not exist"
            )

        return result


    def save_owaspzap_report(self, project_id, report):
        analysis_id = uuid4()

        findings = report.get("findings", [])

        # Convertir las severidades de ZAP a las categorías del frontend.
        severity_mapping = {
            "HIGH": "ERROR",
            "MEDIUM": "WARNING",
            "LOW": "INFO",
            "INFORMATIONAL": "INFO",
            "INFO": "INFO",
        }

        severity_counts = Counter()

        normalized_findings = []

        for finding in findings:
            original_severity = (
                finding.get("severity") or "UNKNOWN"
            ).upper()

            severity = severity_mapping.get(
                original_severity,
                "UNKNOWN",
            )

            severity_counts[severity] += 1

            normalized_findings.append({
                "name": finding.get("name", "Unknown alert"),
                "description": finding.get("description"),
                "severity": severity,
                "file_path": finding.get("file_path"),
                "line_start": finding.get("line_start"),
                "line_end": finding.get("line_end"),
                "code_fragment": finding.get("code_fragment"),
                "url": finding.get("url"),
                "http_method": finding.get("http_method"),
                "parameter": finding.get("parameter"),
                "evidence": finding.get("evidence"),
                "payload": finding.get("payload", finding),
            })

        summary = {
            "total_findings": len(normalized_findings),
            "severity_counts": dict(severity_counts),
            "execution_time": report.get("execution_time", 0),
            "errors_count": len(report.get("errors", [])),
        }

        self.data_access.save_analysis(
            analysis_id=analysis_id,
            project_id=project_id,
            analysis_type="dynamic",
            summary=summary,
            raw_payload=report,
            findings=normalized_findings,
        )

        return {
            "analysis_id": str(analysis_id),
            "project_id": str(project_id),
            "analysis_type": "dynamic",
            "summary": summary,
        }


    def update_last_dynamic_analysis(self, project_id):
        return self.data_access.update_last_dynamic_analysis(project_id)


    def update_last_static_analysis(self, project_id):
        return self.data_access.update_last_static_analysis(project_id)