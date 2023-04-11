import { Body, Controller, Post } from "@nestjs/common";
import { SqlService } from "./sql.service";
import { ConnectionDto, QueryDto } from "./dto";

@Controller("sql")
export class SqlController {
  constructor(private sqlService: SqlService) {}

  @Post("connection")
  async connection(@Body() dto: ConnectionDto) {
    return this.sqlService.connection(dto);
  }

  @Post("query")
  async query(@Body() dto: QueryDto) {
    return this.sqlService.query(dto);
  }
}
