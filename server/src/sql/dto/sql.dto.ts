import { IsNotEmpty, IsString, Matches } from "class-validator";

export class ConnectionDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^(mysql2)$|^(postgres$)/gi)
  client: string;

  @IsString()
  @IsNotEmpty()
  connectionString: string;
}

export class QueryDto extends ConnectionDto {
  @IsString()
  @IsNotEmpty()
  query: string;
}
