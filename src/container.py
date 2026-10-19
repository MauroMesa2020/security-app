from src.db.query_analyses import Query_Analyses
from src.db.query_findings import Query_Findings
from src.db.query_projects import Query_Projects
from src.db.pool_connections import PoolConnections
from src.db.dbaccess import DBAccess
from src.repository.Repository import ProjectsRepository
from src.service.db_service import DBService
from src.service.analysis_service import AnalysisService


pool = PoolConnections()
queries = Query_Projects()
queries_analyses = Query_Analyses()
queries_findings = Query_Findings()


data_access = DBAccess(queries,queries_analyses, queries_findings, pool)
projects_repository = ProjectsRepository(data_access)
db_service = DBService(projects_repository)
analysis_service = AnalysisService(projects_repository)


def close_resources():
    pool.close()