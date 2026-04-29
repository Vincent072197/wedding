import { Pool, QueryResult, QueryResultRow } from "pg";
let _pool: Pool | null = null;
function getPool(): Pool {
  if (!_pool) {
    _pool = new Pool({ connectionString: process.env.DATABASE_URL });
  }
  return _pool;
}

const db = {
  query: <T extends QueryResultRow = any>(
    text: string,
    values?: any[],
  ): Promise<QueryResult<T>> => getPool().query<T>(text, values),
  end: () => getPool().end(),
};

export default db;
