import { pgTable, varchar, integer, timestamp, jsonb, uuid } from 'drizzle-orm/pg-core';

// Define the Audit table
const audits = pgTable('audit', {
  id: uuid('id').primaryKey(),
  method: varchar('method', { length: 255 }),
  service_name: varchar('service_name', { length: 255 }),
  user_id: varchar('user_id', { length: 255 }),
  status_code: integer('status_code'),
  request_time: timestamp('request_time'),
  url: varchar('url', { length: 255 }),
  headers: jsonb('headers'),
  request_payload: jsonb('request_payload'),
  ip_address: varchar('ip_address', { length: 255 }),
  response_time: integer('response_time'),
  response_payload: jsonb('response_payload'),
  created: timestamp('created').defaultNow(),
  error_message: varchar('error_message', { length: 255 }),
});

export default audits;
