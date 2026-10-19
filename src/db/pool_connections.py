import os
from psycopg_pool import ConnectionPool

from dotenv import load_dotenv

load_dotenv() 


class PoolConnections:
    def __init__(self):
        self.pool = ConnectionPool(
            conninfo=os.environ["DATABASE_URL"],
            min_size=1,
            max_size=1,
            kwargs={"connect_timeout": 5},
            open=True,
        )

    def get_connection(self):
        return self.pool.connection()

    def close(self):
        print("Closing resources...")
        self.pool.close()
        print("Pool closed.")