import { Test, TestingModule } from "@nestjs/testing";
import { SqlService } from "../sql.service";
import { createMock, DeepMocked } from "@golevelup/ts-jest";

describe("SqlService", () => {
  let service: DeepMocked<SqlService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: SqlService,
          useValue: createMock<SqlService>(),
        },
      ],
    }).compile();

    service = module.get<DeepMocked<SqlService>>(SqlService);
    // clean up
    jest.clearAllMocks();
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("when the `connection` method is called", () => {
    it("should return a string if `mysql` is the client", async () => {
      // mock the `connection` method to return a string
      service.connection.mockResolvedValue("MySQL connection successful");

      // call the `connection` method
      const result = await service.connection({
        client: "mysql",
        connectionString: "some connection string",
      });
      expect(result).toBe("MySQL connection successful");
    });

    it("should return a string if `postgres` is the client", async () => {
      // mock the `connection` method to return a string
      service.connection.mockResolvedValue("Postgres connection successful");

      // call the `connection` method
      const result = await service.connection({
        client: "postgres",
        connectionString: "some connection string",
      });
      expect(result).toBe("Postgres connection successful");
      expect(service.connection).toHaveBeenCalledTimes(1);
      expect(service.connection).toHaveBeenCalledWith({
        client: "postgres",
        connectionString: "some connection string",
      });
    });
  });
});
