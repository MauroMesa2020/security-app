
class Query_Projects:
    def insert(self):
        return """
            INSERT INTO projects (
                id, owner, url, path,
                last_static_analysis, last_dynamic_analysis
            )
            VALUES (%s, %s, %s, %s, %s, %s)
            RETURNING *
        """

    def delete(self):
        return "DELETE FROM projects WHERE id = %s"

    def update_last_analysis(self, analysis_type):
        if analysis_type == "static":
            return """
                UPDATE projects
                SET last_static_analysis = NOW()
                WHERE id = %s
            """

        if analysis_type == "dynamic":
            return """
                UPDATE projects
                SET last_dynamic_analysis = NOW()
                WHERE id = %s
            """

        raise ValueError(f"Unsupported analysis type: {analysis_type}")

    def get_all(self):
        return """
            SELECT
                id,
                owner,
                url,
                path,
                last_static_analysis,
                last_dynamic_analysis,
                created_at
            FROM projects
            ORDER BY created_at DESC;
        """

    def get_by_id(self):
        return "SELECT * FROM projects WHERE id = %s"

    def get_all_static(self):
        return """
            SELECT * FROM projects
            WHERE last_static_analysis IS NOT NULL
        """

    def get_all_dynamic(self):
        return """
            SELECT * FROM projects
            WHERE last_dynamic_analysis IS NOT NULL
        """

    def get_by_owner(self):
        return "SELECT * FROM projects WHERE owner = %s"

    def get_by_path(self):
        return "SELECT * FROM projects WHERE path = %s"

    def update_last_dynamic_analysis(self):
        return """
            UPDATE projects
            SET last_dynamic_analysis = NOW()
            WHERE id = %s
        """


    def update_last_static_analysis(self):
        return """
            UPDATE projects
            SET last_static_analysis = NOW()
            WHERE id = %s
        """