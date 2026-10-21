
declare module "pg" {
  export class Pool {
    constructor(config?: {
      connectionString?: string;
      ssl?: boolean | { rejectUnauthorized?: boolean };
      max?: number;
      idleTimeoutMillis?: number;
      connectionTimeoutMillis?: number;
    });

    query(
      text: string,
      values?: unknown[]
    ): Promise<{
      rows: any[];
      rowCount: number | null;
    }>;

    connect(): Promise<{
      query(
        text: string,
        values?: unknown[]
      ): Promise<{
        rows: any[];
        rowCount: number | null;
      }>;
      release(): void;
    }>;

    end(): Promise<void>;
  }
}
