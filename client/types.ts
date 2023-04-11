import { decl } from "postcss";
import { InferType } from "yup";

export {};

declare global {
  type TConnect = InferType<typeof ConnectSchema>;
  type TConnectData = {
    connectionString: string;
    client: string;
  };
  type TTableDetails = {
    defaultValue?: string;
    type?: string;
    null?: string;
    name?: string;
  };
}
