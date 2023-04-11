import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { PORT } from "./common/constants";
import { Logger, ValidationPipe } from "@nestjs/common";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // add validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      stopAtFirstError: true,
    }),
  );
  // add cors
  app.enableCors({
    origin: "http://localhost:3000",
  });
  await app.listen(PORT);

  Logger.log(`Server running on http://localhost:${PORT}`, "Bootstrap");
}
bootstrap();
