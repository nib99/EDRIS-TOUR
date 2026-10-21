declare module "pg" {
  export interface QueryResultRow {
    [column: string]: unknown;
  }
  export interface QueryResult<R extends QueryResultRow = QueryResultRow> {
    rows: R[];
    rowCount: number | null;
    command: string;
  }
  export interface PoolConfig {
    connectionString?: string;
    max?: number;
    idleTimeoutMillis?: number;
  }
  export class Pool {
    constructor(config?: PoolConfig);
    query<R extends QueryResultRow = QueryResultRow>(
      text: string,
      values?: unknown[]
    ): Promise<QueryResult<R>>;
    end(): Promise<void>;
  }
}
