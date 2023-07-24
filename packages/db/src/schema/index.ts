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

export const users = pgTable("users", {
  ...defaultField,
  username: text("username").unique(),
  hashedPassword: text("hashed_password").notNull(),
});

export const sessions = pgTable("sessions", {
  ...defaultField,
  userId: uuid("user_id")
    .references(() => users.id, {
      onDelete: "cascade",
    })
    .notNull(),
  sessionToken: text("session_token").notNull(),
});

export const usersRelations = relations(users, ({ many }) => ({
  sessions: many(sessions),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
}));
