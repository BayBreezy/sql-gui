import { Module } from "@nestjs/common";
import { SqlModule } from "./sql/sql.module";

@Module({
  imports: [SqlModule],
})
export class AppModule {}
