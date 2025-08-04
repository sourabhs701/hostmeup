CREATE TABLE "files" (
	"id" integer PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"size" integer NOT NULL,
	"key" text NOT NULL,
	"uploadedAt" text DEFAULT CURRENT_TIMESTAMP,
	"userId" integer
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" integer PRIMARY KEY NOT NULL,
	"avatar" text,
	"username" text NOT NULL,
	"email" text,
	"name" text,
	"twitter_username" text,
	"created_at" text DEFAULT CURRENT_TIMESTAMP,
	"storage_used" integer DEFAULT 0,
	"storage_limit" integer DEFAULT 1073741824,
	CONSTRAINT "users_username_unique" UNIQUE("username"),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "files" ADD CONSTRAINT "files_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;