import { Test, TestingModule } from "@nestjs/testing";
import { SqlController } from "../sql.controller";
import { createMock, DeepMocked } from "@golevelup/ts-jest";
import { SqlService } from "../sql.service";

describe("SqlController", () => {
  let controller: SqlController;
  let service: DeepMocked<SqlService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SqlController],
      providers: [
        {
          provide: SqlService,
          useValue: createMock<SqlService>(),
        },
      ],
    }).compile();

    controller = module.get<SqlController>(SqlController);
    service = module.get<DeepMocked<SqlService>>(SqlService);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  describe("when the `connection` endpoint is called", () => {
    it("should return a string if the connection was ok", async () => {
      // mock the `connection` method to return a string
      (service.connection as any).mockResolvedValue("Connection successful");

      // call the `connection` method
      const mResults = await controller.connection({
        client: "mysql",
        connectionString: "some connection string",
      });
      const pResults = await controller.connection({
        client: "postgres",
        connectionString: "some connection string",
      });
      expect(mResults).toBe("Connection successful");
      expect(pResults).toBe("Connection successful");
      expect(service.connection).toHaveBeenCalledTimes(2);
    });
  });
});
