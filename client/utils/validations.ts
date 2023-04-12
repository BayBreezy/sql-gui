import { object, string, number } from "yup";

export const ConnectSchema = object({
  host: string().required("Host is required").min(3, "Host must be at least 3 characters"),
  port: number()
    .required("Port is required")
    .typeError("Port must be a number")
    .min(1, "Port must be 1 or more")
    .max(65535, "Port must be 65535 or less"),
  user: string(),
  password: string(),
});

export const CreateDbSchema = object({
  name: string()
    .required("Database name is required")
    .min(3, "Database name must be at least 3 characters"),
});
