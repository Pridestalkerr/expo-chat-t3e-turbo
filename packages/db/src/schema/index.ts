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
  username: text("username").unique().notNull(),
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

export const channels = pgTable("channels", {
  ...defaultField,
  initiatorId: uuid("initiator_id")
    .references(() => users.id, {
      onDelete: "cascade",
    })
    .notNull(),
  recipientId: uuid("recipient_id")
    .references(() => users.id, {
      onDelete: "cascade",
    })
    .notNull(),
});

export const messages = pgTable("messages", {
  ...defaultField,
  channelId: uuid("channel_id")
    .references(() => channels.id, {
      onDelete: "cascade",
    })
    .notNull(),
  senderId: uuid("sender_id")
    .references(() => users.id, {
      onDelete: "cascade",
    })
    .notNull(),
  content: text("content").notNull(),
});

export const channelsRelations = relations(channels, ({ many }) => ({
  messages: many(messages),
}));

export const messagesRelations = relations(messages, ({ one }) => ({
  channel: one(channels, {
    fields: [messages.channelId],
    references: [channels.id],
  }),
  sender: one(users, {
    fields: [messages.senderId],
    references: [users.id],
  }),
}));

export const usersRelations = relations(users, ({ many }) => ({
  sessions: many(sessions),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
}));
