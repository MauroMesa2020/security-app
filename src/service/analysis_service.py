# src/services/analysis_service.py
import os
from src.repository.Repository import ProjectsRepository
from src.scripts.Semgrep import Semgrep
from src.scripts.Owaspzap import Owaszap
from urllib.parse import urlparse
import ipaddress
import socket


class AnalysisService:

    def __init__(self, repository: ProjectsRepository):
        self.__repository = repository


    def static_analysis(self, id,path: str):
        
        if not os.path.exists(path):
            raise ValueError("The path does not exist")

        semgrep = Semgrep()
        report = semgrep.run_semgrep(path)

        if report.get("status") != "success":
            raise RuntimeError("Semgrep analysis failed")

        # Guardar la ejecución y sus hallazgos.
        retult = self.__repository.save_semgrep_report(
            project_id=id,
            report=report,
            project_path=path
        )


        self.__repository.update_last_static_analysis(id)

        return retult


    def validate_url(self, url: str) -> str:
        if not isinstance(url, str) or not url.strip():
            raise ValueError("LThe URL must be a non-empty string.")

        parsed = urlparse(url.strip())

        if parsed.scheme not in ("http", "https"):
            raise ValueError("The URL scheme must be http or https.")

        if not parsed.hostname:
            raise ValueError("The URL must have a valid hostname.")

        if parsed.username or parsed.password:
            raise ValueError("The URL must not contain credentials.")

        if parsed.port is not None and not (1 <= parsed.port <= 65535):
            raise ValueError("The URL port must be between 1 and 65535.")

        hostname = parsed.hostname.rstrip(".").lower()

        if hostname == "localhost" or hostname.endswith(".localhost"):
            raise ValueError("The URL must not resolve to localhost.")

        try:
            ip = ipaddress.ip_address(hostname)
            if not ip.is_global:
                raise ValueError("Local and private IP addresses are not allowed.")
        except ValueError as exc:
            # Distinguir una IP no global de un hostname que no sea una IP.
            try:
                ipaddress.ip_address(hostname)
            except ValueError:
                pass
            else:
                raise exc

        try:
            addresses = socket.getaddrinfo(
                hostname,
                parsed.port or (443 if parsed.scheme == "https" else 80),
                type=socket.SOCK_STREAM,
            )
        except socket.gaierror as exc:
            raise ValueError("The URL does not resolve.") from exc

        for address in addresses:
            resolved_ip = ipaddress.ip_address(address[4][0])
            if not resolved_ip.is_global:
                raise ValueError("Local and private IP addresses are not allowed.")

        return url.strip()
    
    def dynamic_analysis(self, project_id: str, url: str):

        print("entro 2")
        validated_url = self.validate_url(url)

        project = self.__repository.get_by_id(project_id)

        if project is None:
            raise ValueError("The project does not exist.")

        print("Verifico")
        if project["url"].rstrip("/") != validated_url.rstrip("/"):
            raise ValueError(
                "The project URL does not match the provided URL."
            )

        print("Armo zap")

        owasp_zap = Owaszap({
            "ZAP_API_KEY": os.environ["ZAP_API_KEY"],
            "ZAP_API_URL": os.getenv(
                "ZAP_API_URL",
                "http://zap:8080",
            ),
            "ZAP_TIMEOUT": os.getenv("ZAP_TIMEOUT", "1800"),
            "ZAP_POLL_INTERVAL": os.getenv("ZAP_POLL_INTERVAL", "2"),
            "ZAP_ACTIVE_SCAN": os.getenv("ZAP_ACTIVE_SCAN", "true").lower() == "true",
        })

        report = owasp_zap.run_owaspzap(validated_url)

        result = self.__repository.save_owaspzap_report(
            project_id=project_id,
            report=report,
        )

        self.__repository.update_last_dynamic_analysis(project_id)

        return result