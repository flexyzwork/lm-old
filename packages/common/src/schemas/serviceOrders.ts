import { pgTable, uuid, text, timestamp } from 'drizzle-orm/pg-core';
import { services } from './services';
import { clients } from './clients';
import { freelancers } from './freelancers';

// service_orders (클라이언트가 프리랜서 서비스 요청)
export const serviceOrders = pgTable('service_orders', {
  id: uuid('id').defaultRandom().primaryKey(), // ✅ UUID 자동 생성
  client_id: uuid('client_id')
    .references(() => clients.id)
    .notNull(),
  service_id: uuid('service_id')
    .references(() => services.id)
    .notNull(),
  freelancer_id: uuid('freelancer_id')
    .references(() => freelancers.id)
    .notNull(),
  status: text('status').notNull().default('PENDING'), // 'PENDING', 'ACCEPTED', 'COMPLETED'
  created_at: timestamp('created_at').defaultNow(),
});
