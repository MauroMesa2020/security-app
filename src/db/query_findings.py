
class Query_Findings:
    def insert(self):
        return """
            INSERT INTO findings (
                analysis_id,
                name,
                description,
                severity,
                file_path,
                line_start,
                line_end,
                code_fragment,
                payload
            )
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
        """
