import json
from pathlib import Path
import psycopg
from psycopg import sql

CONN_STR = (
    "postgresql://neondb_owner:npg_kKtW2HFqxRm0@ep-curly-morning-aq7b07jm-pooler.c-8.us-east-1.aws.neon.tech/neondb"
    "?sslmode=require&channel_binding=require"
)

OUTPUT_DIR = Path(__file__).with_name("db_tables")


def fetch_tables():
    OUTPUT_DIR.mkdir(exist_ok=True)
    with psycopg.connect(CONN_STR) as conn:
        with conn.cursor() as cur:
            cur.execute(
                "SELECT table_schema, table_name "
                "FROM information_schema.tables "
                "WHERE table_type='BASE TABLE' "
                "AND table_schema NOT IN ('pg_catalog', 'information_schema') "
                "ORDER BY table_schema, table_name"
            )
            tables = cur.fetchall()

            for schema, table in tables:
                schema_dir = OUTPUT_DIR / schema
                schema_dir.mkdir(parents=True, exist_ok=True)
                query = sql.SQL("SELECT * FROM {}.{}")
                query = query.format(sql.Identifier(schema), sql.Identifier(table))
                cur.execute(query)
                columns = [desc.name for desc in cur.description]
                rows = cur.fetchall()
                table_data = [dict(zip(columns, row)) for row in rows]

                filename = schema_dir / f"{table}.json"
                with open(filename, "w", encoding="utf-8") as f:
                    json.dump(table_data, f, indent=2, default=str)

                print(f"Wrote {len(table_data)} rows to {filename}")


if __name__ == "__main__":
    fetch_tables()
