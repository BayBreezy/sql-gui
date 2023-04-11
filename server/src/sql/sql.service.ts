import { BadRequestException, Injectable } from "@nestjs/common";
import { ConnectionDto, QueryDto } from "./dto";
import { knex } from "knex";

@Injectable()
export class SqlService {
  async connection(dto: ConnectionDto) {
    // check the client type and return the appropriate connection
    switch (dto.client.toLowerCase()) {
      case "mysql2":
      case "postgres":
        // return mysql connection
        const con = await this.getSQLConnection(dto);
        await con
          .transaction(async (trx) => {
            await trx.raw("select 1+1 as result");
          })
          .catch((error) => {
            throw new BadRequestException(error.message);
          })
          .finally(() => con.destroy());

        return "Connection successful";

      default:
        throw new BadRequestException("Invalid client type");
    }
  }

  async query(dto: QueryDto) {
    try {
      // check the client type and return the appropriate connection
      switch (dto.client.toLowerCase()) {
        case "mysql2":
          // return sql query
          const sqlCon = await this.getSQLConnection(dto);
          // return the query result
          return this.formatMysqlResult(await sqlCon.raw(dto.query));

        case "postgres":
          // return sql query
          const postgresCon = await this.getSQLConnection(dto);
          // return the query result
          return this.formatPostgresResult(await postgresCon.raw(dto.query));
      }
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  /**
   * Method to get a sql connection
   * @param dto - ConnectionDto
   * @returns  returns a sql connection
   */
  async getSQLConnection(dto: ConnectionDto) {
    try {
      // create a knex connection
      return knex({
        client: dto.client,
        connection: dto.connectionString,
        pool: {
          min: 2,
          max: 10,
        },
      });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  formatMysqlResult(result: any) {
    return result[0];
  }
  formatPostgresResult(result: any) {
    return result.rows;
  }
}
