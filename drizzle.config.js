import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/db/schema.js",
  out: "./data/migrations",
  dbCredentials: {
    url: "file:./data/app.db",
  },
  dialect: "sqlite",
  verbose: true,
  strict: true,
});
