
class Query_Analyses:
    def insert(self):
        return """
            INSERT INTO analyses (
                id,
                project_id,
                analysis_type,
                summary,
                raw_payload
            )
            VALUES (%s, %s, %s, %s, %s)
            RETURNING id
        """
