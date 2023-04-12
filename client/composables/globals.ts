import { FetchOptions } from "ofetch";

export const useAPIUrl = () => {
  const {
    public: { API },
  } = useRuntimeConfig();

  return API;
};

export const useApiClient = () => {
  const baseURL = useAPIUrl();

  return async <T>(url: string, options: FetchOptions = {}) => {
    try {
      const apiFetch = $fetch.create<T>({
        ...options,
        baseURL,
      });
      return await apiFetch<T>(url);
    } catch (error: any) {
      throw error.data;
    }
  };
};

export const useSetConnections = (data: TConnectData) => {
  localStorage.setItem(CONN_KEY, data.connectionString);
  localStorage.setItem(CLIENT_KEY, data.client);
};
export const useGetConnections = (): TConnectData | undefined => {
  const connectionString = localStorage.getItem(CONN_KEY);
  const client = localStorage.getItem(CLIENT_KEY);
  return connectionString && client ? { connectionString, client } : undefined;
};

export const useClearConnections = () => {
  localStorage.removeItem(CONN_KEY);
  localStorage.removeItem(CLIENT_KEY);
};

export const useToast = () => {
  const { $toast } = useNuxtApp();
  return $toast;
};

export const useQueries = () => {
  const apiClient = useApiClient();

  /**
   * Get all the databases
   */
  const getDbs = async () => {
    const connectionData = useGetConnections();
    if (!connectionData) return [];
    const res = await apiClient<any[]>("/sql/query", {
      method: "POST",
      body: {
        ...connectionData,
        query:
          connectionData.client == "mysql2"
            ? "SHOW DATABASES;"
            : 'SELECT datname as "Database" FROM pg_database WHERE datistemplate = false;',
      },
    });
    return res.map((r) => r.Database);
  };

  /**
   * Method used to create a db
   * @param db - the db name
   */
  const createDb = async (db: string) => {
    const connectionData = useGetConnections();
    if (!connectionData) return [];
    const res = await apiClient<any[]>("/sql/query", {
      method: "POST",
      body: {
        ...connectionData,
        query: `CREATE DATABASE ${db};`,
      },
    });
    return res;
  };
  /**
   * Method used to delete a db
   * @param db - the db name
   */
  const deleteDB = async (db: string) => {
    const connectionData = useGetConnections();
    if (!connectionData) return [];
    const res = await apiClient<any[]>("/sql/query", {
      method: "POST",
      body: {
        ...connectionData,
        query: `DROP DATABASE ${db};`,
      },
    });
    return res;
  };

  const getTables = async (db: string) => {
    const connectionData = useGetConnections();
    if (!connectionData) return [];
    const res = await apiClient<any[]>("/sql/query", {
      method: "POST",
      body: {
        ...connectionData,
        connectionString: `${connectionData.connectionString}/${db}`,
        query:
          connectionData.client == "mysql2"
            ? "SHOW TABLES;"
            : `SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_type = 'BASE TABLE';`,
      },
    });
    return connectionData.client == "mysql2"
      ? res.map((r) => {
          return { table_name: r["Tables_in_" + db] };
        })
      : res.map((r) => {
          return { table_name: r.table_name };
        });
  };

  const getTableDetails = async (db: string, table: string) => {
    const connectionData = useGetConnections();
    if (!connectionData) return [];
    const res = await apiClient<any[]>("/sql/query", {
      method: "POST",
      body: {
        ...connectionData,
        connectionString: `${connectionData.connectionString}/${db}`,
        query:
          connectionData.client == "mysql2"
            ? `SHOW COLUMNS 
              FROM ${table};`
            : `  SELECT * 
  FROM information_schema.columns 
  WHERE table_name = '${table}'
  AND table_schema = 'public'`,
      },
    });
    // fomrat based on results from mysql2 vs postgres
    return connectionData.client == "mysql2"
      ? (res.map((r) => {
          return {
            defaultValue: r.Default,
            type: r.Type,
            null: r.Null,
            name: r.Field,
          };
        }) as TTableDetails[])
      : (res.map((r) => {
          return {
            defaultValue: r.column_default,
            type: r.data_type,
            null: r.is_nullable,
            name: r.column_name,
          };
        }) as TTableDetails[]);
  };

  return { getDbs, getTables, getTableDetails, createDb, deleteDB };
};
