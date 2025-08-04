import { pgTable, text, integer, serial } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const users = pgTable("users", {
  id: integer("id").primaryKey(),
  avatar: text("avatar"),
  username: text("username").notNull().unique(),
  email: text("email").unique(),
  name: text("name"),
  twitter_username: text("twitter_username"),
  created_at: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  storage_used: integer("storage_used").default(0),
  storage_limit: integer("storage_limit").default(1024 * 1024 * 1024 * 1),
});

export const files = pgTable("files", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  size: integer("size").notNull(),
  key: text("key").notNull(),
  uploadedAt: text("uploadedAt").default(sql`CURRENT_TIMESTAMP`),
  userId: integer("userId").references(() => users.id, { onDelete: "cascade" }),
});
