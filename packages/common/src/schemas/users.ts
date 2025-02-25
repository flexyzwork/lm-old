import 'zod-openapi/extend';
import { z } from 'zod';
import { jsonb, pgEnum, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { InferInsertModel, InferSelectModel } from 'drizzle-orm';

// ✅ 역할 Enum
export const roleEnum = pgEnum('user_role', ['FREELANCER', 'CLIENT', 'ADMIN']);
export const roleEnumZod = z.enum(['FREELANCER', 'CLIENT', 'ADMIN']).openapi({ description: 'User role' });

// ✅ 인증 제공자 Enum
export const providerEnum = pgEnum('auth_provider', ['email', 'google', 'github']);
export const providerEnumZod = z
  .enum(['email', 'google', 'github'])
  .openapi({ description: 'Auth provider', example: 'google' });

// ✅ Drizzle ORM 유저 테이블
export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  provider: providerEnum('provider').notNull(),
  provider_id: text('provider_id'),
  email: text('email'),
  password: text('password'),
  roles: jsonb('roles').notNull().default(['FREELANCER']),
  name: text('name'),
  picture: text('picture'),
  created_at: timestamp('created_at').defaultNow(),
});

// ✅ 공통 유저 필드 (Base Schema)
const baseUserSchema = z.object({
  provider: providerEnumZod.default('email'),
  provider_id: z.string().nullable().optional(),
  email: z.string().email().nullable().optional().openapi({ example: 'user@example.com' }),
  password: z.string().min(6).max(32).trim().optional().openapi({ example: 'password123' }),
  roles: z.array(roleEnumZod).default(['FREELANCER']),
  name: z.string().min(2).max(50).optional().openapi({ example: '홍길동' }),
  picture: z.string().optional().nullable().openapi({ example: 'http://example.com/picture01.jpg' }),
});

// ✅ 유저 CRUD 스키마 자동 생성 (명명 규칙 통일)
export const userSchemas = {
  Create: baseUserSchema.omit({ roles: true }).openapi({ title: 'CreateUser' }),
  Update: baseUserSchema
    .omit({ provider: true, provider_id: true, email: true, roles: true })
    .partial()
    .openapi({ title: 'UpdateUser' }),
  Response: baseUserSchema
    .omit({ password: true })
    .extend({
      id: z.string().uuid().openapi({ example: 'b3f0a1c5-90e3-4cf5-9851-3c3db6d8a840' }),
      created_at: z.date().openapi({ example: '2025-02-10T12:34:56Z' }),
    })
    .openapi({ title: 'UserResponse' }),
};

export const authSchemas = userSchemas;

// ✅ 사용자 관련 타입 (Drizzle ORM & Zod)
export type User = InferSelectModel<typeof users>;
export type NewUser = InferInsertModel<typeof users>;

// ✅ API 요청/응답 타입
export type CreateUserDto = z.infer<typeof userSchemas.Create>;
export type UpdateUserDto = z.infer<typeof userSchemas.Update>;
export type UserResponseDto = z.infer<typeof userSchemas.Response>;
