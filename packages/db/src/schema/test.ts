import {
  pgTable,
  uuid,
  text,
  timestamp,
  // uniqueIndex,
  // boolean,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// timestamp with timezone helper
const timestampTZ = (name: string) => {
  return timestamp(name, {
    withTimezone: true,
    // ...opts,
  });
};

export const defaultField = {
  id: uuid("id").primaryKey().defaultRandom(),
  createdAt: timestampTZ("created_at").defaultNow(),
  updatedAt: timestampTZ("updated_at"), // null at first, must be updated manually sadly
};

// probably not needed if AUTH API is alright
// dont need sessions either
export const users = pgTable("users", {
  ...defaultField,
  username: text("username").unique().notNull(), //
});

export const projects = pgTable("projects", {
  ...defaultField,
  name: text("name").unique().notNull(),
  description: text("description").notNull(), // this is not enough to get relevant data
  location: text("location").notNull(),
  type: text("type").$type<"hybrid" | "remote" | "onsite">().notNull(),
});

export const requirements = pgTable("requirements", {
  ...defaultField,
  projectId: uuid("project_id")
    .references(() => projects.id, {
      onDelete: "cascade",
    })
    .notNull(),
  tag: uuid("tag")
    .references(() => tags.id, {
      onDelete: "cascade",
    })
    .notNull(),
  experience: text("experience").notNull(),
  description: text("description").notNull(),
});

export const tag = pgTable("tags", {
  ...defaultField,
  name: text("name").unique().notNull(),
  description: text("description").notNull(),
});
