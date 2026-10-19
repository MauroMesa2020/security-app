import json
import shutil
import subprocess
import sys

from pathlib import Path


class Semgrep:
    def __init__(self, options=None):
        self.options = options or {}

    def run_semgrep(self, path: str):
        project_path = Path(path).resolve()

        if not project_path.exists() or not project_path.is_dir():
            raise ValueError(
                f"Project directory does not exist: {project_path}"
            )

        executable = shutil.which("semgrep")

        if executable:
            command = [executable]
        else:
            command = [sys.executable, "-m", "semgrep"]

        # Reglas generales y específicas por lenguaje.
        configs = self.options.get("configs", [
            "p/default",
            "p/security-audit",
            "p/owasp-top-ten",
            "p/javascript",
            "p/typescript",
            "p/python",
            "p/java",
            "p/secrets",
        ])

        command.append("scan")

        for config in configs:
            command.extend(["--config", config])

        command.extend([
            "--json",
            "--metrics=off",
            str(project_path)
        ])

        timeout = self.options.get("timeout", 300)

        try:
            process = subprocess.run(
                command,
                capture_output=True,
                text=True,
                encoding="utf-8",
                errors="replace",
                timeout=timeout,
                check=False
            )

        except subprocess.TimeoutExpired as exc:
            raise RuntimeError(
                f"Semgrep analysis exceeded {timeout} seconds."
            ) from exc

        except OSError as exc:
            raise RuntimeError(
                f"Could not execute Semgrep: {exc}"
            ) from exc

        try:
            report = json.loads(process.stdout)
        except json.JSONDecodeError as exc:
            raise RuntimeError(
                "Semgrep did not return valid JSON. "
                f"Details: {process.stderr or process.stdout}"
            ) from exc

        if process.returncode not in (0, 1):
            raise RuntimeError(
                f"Semgrep execution failed: {process.stderr}"
            )

        findings = report.get("results", [])

        return {
            "status": "success",
            "project_path": str(project_path),
            "total_findings": len(findings),
            "findings": findings,
            "errors": report.get("errors", []),
            "execution_time": report.get("time", {}).get(
                "wallclock", 0
            )
        }
