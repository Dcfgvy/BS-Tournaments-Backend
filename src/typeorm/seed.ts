import { DataSource } from "typeorm";
import { dataSourceOptions } from "./data-source";
import { runSeeders } from "typeorm-extension";
import { appConfig } from "../utils/appConfigs";

const dataSource = new DataSource(dataSourceOptions);
dataSource.initialize().then(async () => {
  await dataSource.synchronize(true);
  
  console.log('Truncating database...');
  await dataSource.query(`
    CREATE OR REPLACE FUNCTION truncate_tables(username IN VARCHAR) RETURNS void AS $$
    DECLARE
        statements CURSOR FOR
            SELECT tablename FROM pg_tables
            WHERE tableowner = username AND schemaname = 'public';
    BEGIN
        FOR stmt IN statements LOOP
            EXECUTE 'TRUNCATE TABLE ' || quote_ident(stmt.tablename) || ' CASCADE;';
        END LOOP;
    END;
    $$ LANGUAGE plpgsql;

    SELECT truncate_tables('${appConfig.DB_USER}');
  `);

  await runSeeders(dataSource);
  process.exit();
})