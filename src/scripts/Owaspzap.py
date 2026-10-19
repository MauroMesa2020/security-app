import time
from collections import Counter

from zapv2 import ZAPv2


class Owaszap:
    def __init__(self, config):
        self.config = config

        self.api_key = config["ZAP_API_KEY"]
        self.api_url = config.get(
            "ZAP_API_URL",
            "http://127.0.0.1:8080"
        ).rstrip("/")

        self.timeout = int(config.get("ZAP_TIMEOUT", 1800))
        self.poll_interval = float(
            config.get("ZAP_POLL_INTERVAL", 2)
        )

        self.active_scan_enabled = config.get(
            "ZAP_ACTIVE_SCAN",
            True
        )

        self.zap = ZAPv2(
            apikey=self.api_key,
            proxies={
                "http": self.api_url,
                "https": self.api_url,
            }
        )

    def _wait_for_scan(self, status_function, scan_id, stage):
        """Wait until a scan reaches 100 % or the timeout expires."""
        deadline = time.monotonic() + self.timeout

        while time.monotonic() < deadline:
            progress = int(status_function(scan_id))

            if progress >= 100:
                return

            time.sleep(self.poll_interval)

        raise TimeoutError(
            f"OWASP ZAP timed out during {stage}."
        )

    def _wait_for_passive_scan(self):
        """Wait intil Zap finishes processing captured responses."""
        deadline = time.monotonic() + self.timeout

        while time.monotonic() < deadline:
            remaining = int(self.zap.pscan.records_to_scan)

            if remaining == 0:
                return

            time.sleep(self.poll_interval)

        raise TimeoutError(
            "OWASP ZAP timed out during passive scanning."
        )

    def run_owaspzap(self, url: str):
        started_at = time.monotonic()
        print(f"Entro a run, la url es {url}")

        # La validación y autorización del destino corresponden al service.
        # Aquí se ejecuta el análisis sobre la URL que recibe la clase.

        # 1. Acceder al destino para iniciar el descubrimiento.
        self.zap.core.access_url(
            url=url,
            followredirects=True
        )

        print("Termino validacion")

        # 2. Descubrir páginas y endpoints con el Spider.

        print("Scaneo")
        spider_id = self.zap.spider.scan(url)

        self._wait_for_scan(
            self.zap.spider.status,
            spider_id,
            "spider scan"
        )

        # 3. Esperar a que finalice el análisis pasivo.
        self._wait_for_passive_scan()

        # 4. Ejecutar el análisis activo si está habilitado.
        if self.active_scan_enabled:
            active_scan_id = self.zap.ascan.scan(
                url=url,
                recurse=True,
                inscopeonly=True
            )

            if not active_scan_id or active_scan_id == "does_not_exist":
                raise RuntimeError(
                    "OWASP ZAP could not start the active scan."
                )

            self._wait_for_scan(
                self.zap.ascan.status,
                active_scan_id,
                "active scan"
            )

            # Las respuestas del análisis activo también pueden
            # generar alertas que procesa el escáner pasivo.
            self._wait_for_passive_scan()

        # 5. Recuperar todas las alertas del destino.
        alerts = []
        start = 0
        page_size = 5000

        while True:
            page = self.zap.alert.alerts(
                baseurl=url,
                start=start,
                count=page_size
            )

            if not page:
                break

            alerts.extend(page)
            start += len(page)

            if len(page) < page_size:
                break

        # 6. Normalizar las alertas para que el service pueda guardarlas.
        normalized_findings = []

        for alert in alerts:
            normalized_findings.append({
                "name": alert.get("alert") or "Unknown alert",
                "description": alert.get("description"),
                "severity": alert.get("risk"),
                "file_path": None,
                "line_start": None,
                "line_end": None,
                "code_fragment": None,
                "url": alert.get("url"),
                "http_method": alert.get("method"),
                "parameter": alert.get("param"),
                "evidence": alert.get("evidence"),
                "payload": alert,
            })

        severity_counts = Counter(
            (finding.get("severity") or "UNKNOWN").upper()
            for finding in normalized_findings
        )

        summary = {
            "total_findings": len(normalized_findings),
            "severity_counts": dict(severity_counts),
            "execution_time": round(
                time.monotonic() - started_at, 2
            ),
            "errors_count": 0,
        }

        # 7. Devolver los datos al service. No se escribe en la DB aquí.
        return {
            "findings": normalized_findings,
            "summary": summary,
            "execution_time": summary["execution_time"],
            "errors": [],
        }