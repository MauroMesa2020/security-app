
from src.db.query_analyses import Query_Analyses
from src.db.query_findings import Query_Findings
from src.db.query_projects import Query_Projects
from src.db.pool_connections import PoolConnections
from psycopg.rows import dict_row
from psycopg.types.json import Jsonb

class DBAccess:
    def __init__(
        self,
        query: Query_Projects,
        query_analyses: Query_Analyses,
        query_findings: Query_Findings,
        pool: PoolConnections
    ):
        self.query = query
        self.pool = pool
        self.query_analyses = query_analyses
        self.query_findings = query_findings

    def insert(self, data):
        with self.pool.get_connection() as conn:
            with conn.cursor() as cur:
                cur.execute(self.query.insert(), data)
                return cur.rowcount

    def delete(self, data):
        with self.pool.get_connection() as conn:
            with conn.cursor() as cur:
                cur.execute(self.query.delete(), data)
                return cur.rowcount

    def get_all_projects(self):
        with self.pool.get_connection() as conn:
            with conn.cursor(row_factory=dict_row) as cur:
                cur.execute(self.query.get_all())
                rows = cur.fetchall()

                return [
                    {
                        **row,
                        "id": str(row["id"]),
                        "last_static_analysis": (
                            row["last_static_analysis"].isoformat()
                            if row["last_static_analysis"] else None
                        ),
                        "last_dynamic_analysis": (
                            row["last_dynamic_analysis"].isoformat()
                            if row["last_dynamic_analysis"] else None
                        ),
                        "created_at": row["created_at"].isoformat(),
                    }
                    for row in rows
                ]
    def get_by_id(self, data):
        with self.pool.get_connection() as conn:
            with conn.cursor(row_factory=dict_row) as cur:
                cur.execute(self.query.get_by_id(), data)
                return cur.fetchone()


    def get_all_static(self):
        with self.pool.get_connection() as conn:
            with conn.cursor() as cur:
                cur.execute(self.query.get_all_static())
                return cur.fetchall()

    def get_all_dynamic(self):
        with self.pool.get_connection() as conn:
            with conn.cursor() as cur:
                cur.execute(self.query.get_all_dynamic())
                return cur.fetchall()

    def get_by_owner(self, data):
        with self.pool.get_connection() as conn:
            with conn.cursor() as cur:
                cur.execute(self.query.get_by_owner(), data)
                return cur.fetchall()

    def get_by_path(self, data):
        with self.pool.get_connection() as conn:
            with conn.cursor() as cur:
                cur.execute(self.query.get_by_path(), data)
                return cur.fetchone()



    def save_analysis(
        self,
        analysis_id,
        project_id,
        analysis_type,
        summary,
        raw_payload,
        findings
    ):

        with self.pool.get_connection() as conn:
            with conn.cursor() as cur:
                # 1. Insertar la ejecución.
                cur.execute(
                    self.query_analyses.insert(),
                    (
                        analysis_id,
                        project_id,
                        analysis_type,
                        Jsonb(summary),
                        Jsonb(raw_payload)
                    )
                )

                # 2. Insertar los hallazgos asociados.
                finding_sql = self.query_findings.insert()

                for finding in findings:
                    cur.execute(
                        finding_sql,
                        (
                            analysis_id,
                            finding["name"],
                            finding["description"],
                            finding["severity"],
                            finding["file_path"],
                            finding["line_start"],
                            finding["line_end"],
                            finding["code_fragment"],
                            Jsonb(finding["payload"])
                        )
                    )

                # 3. Actualizar la fecha del último análisis.
                cur.execute(
                    self.query.update_last_analysis(analysis_type),
                    (project_id,)
                )

                if cur.rowcount != 1:
                    raise LookupError(
                        f"Project {project_id} does not exist"
                    )

        return analysis_id



    def get_analyses_by_project(self, project_id):
        with self.pool.get_connection() as conn:
            with conn.cursor(row_factory=dict_row) as cur:
                cur.execute(
                    """
                    SELECT
                        a.id,
                        a.project_id,
                        a.analysis_type,
                        a.summary,
                        a.created_at,
                        COUNT(f.id) AS findings_count
                    FROM analyses a
                    LEFT JOIN findings f ON f.analysis_id = a.id
                    WHERE a.project_id = %s
                    GROUP BY
                        a.id,
                        a.project_id,
                        a.analysis_type,
                        a.summary,
                        a.created_at
                    ORDER BY a.created_at DESC
                    """,
                    (project_id,),
                )

                rows = cur.fetchall()

                return [
                    {
                        **row,
                        "id": str(row["id"]),
                        "project_id": str(row["project_id"]),
                        "created_at": row["created_at"].isoformat(),
                        "findings_count": row["findings_count"],
                    }
                    for row in rows
                ]



    def get_analysis_details(self, analysis_id):
        with self.pool.get_connection() as conn:
            with conn.cursor(row_factory=dict_row) as cur:
                cur.execute(
                    """
                    SELECT
                        id, project_id, analysis_type,
                        summary, raw_payload, created_at
                    FROM analyses
                    WHERE id = %s
                    """,
                    (analysis_id,),
                )
                analysis = cur.fetchone()

                if analysis is None:
                    return None

                cur.execute(
                    """
                    SELECT
                        id, name, description, severity,
                        file_path, line_start, line_end,
                        code_fragment
                    FROM findings
                    WHERE analysis_id = %s
                    ORDER BY
                        CASE UPPER(severity)
                            WHEN 'ERROR' THEN 1
                            WHEN 'WARNING' THEN 2
                            WHEN 'INFO' THEN 3
                            ELSE 4
                        END,
                        file_path,
                        line_start
                    """,
                    (analysis_id,),
                )
                findings = cur.fetchall()

                return {
                    "id": str(analysis["id"]),
                    "project_id": str(analysis["project_id"]),
                    "analysis_type": analysis["analysis_type"],
                    "created_at": analysis["created_at"].isoformat(),
                    "summary": analysis["summary"],
                    "findings": findings,
                }

    def update_last_dynamic_analysis(self, project_id):
        with self.pool.get_connection() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    self.query.update_last_dynamic_analysis(),
                    (project_id,)
                )
                return cur.rowcount


    def update_last_static_analysis(self, project_id):
        with self.pool.get_connection() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    self.query.update_last_static_analysis(),
                    (project_id,)
                )
                return cur.rowcount