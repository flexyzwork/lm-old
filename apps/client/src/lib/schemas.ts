import * as z from 'zod';

// Course Editor Schemas
export const courseSchema = z.object({
  courseTitle: z.string().min(1, 'Title is required'),
  courseDescription: z.string().min(1, 'Description is required'),
  courseCategory: z.string().min(1, 'Category is required'),
  coursePrice: z.string(),
  courseStatus: z.boolean(),
});

export type CourseFormData = z.infer<typeof courseSchema>;

// Chapter Schemas
export const chapterSchema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters'),
  content: z.string().min(10, 'Content must be at least 10 characters'),
  video: z.union([z.string(), z.instanceof(File)]).optional(),
});

export type ChapterFormData = z.infer<typeof chapterSchema>;

// Section Schemas
export const sectionSchema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
});

export type SectionFormData = z.infer<typeof sectionSchema>;

// Guest Checkout Schema
export const guestSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export type GuestFormData = z.infer<typeof guestSchema>;

// Notification Settings Schema
export const notificationSettingsSchema = z.object({
  courseNotifications: z.boolean(),
  emailAlerts: z.boolean(),
  smsAlerts: z.boolean(),
  notificationFrequency: z.enum(['immediate', 'daily', 'weekly']),
});

export type NotificationSettingsFormData = z.infer<typeof notificationSettingsSchema>;

// ✅ 역할 Enum
export const roleEnumZod = z.enum(['student', 'teacher']);

// ✅ 인증 제공자 Enum
export const providerEnumZod = z.enum(['email', 'google', 'github']);

// ✅ 공통 유저 필드 (Base Schema)
export const userSchema = z.object({
  id: z.string().uuid().optional(),
  provider: providerEnumZod.default('email'),
  provider_id: z.string().nullable().optional(),
  email: z.string().email().nullable().optional(),
  password: z.string().min(6).max(32).trim().optional(),
  role: z.array(roleEnumZod).default(['student']),
  name: z.string().min(2).max(50).optional(),
  picture: z.string().optional().nullable(),
  created_at: z.date().default(() => new Date()), // 생성 날짜
});

// ✅ 유저 CRUD 스키마 자동 생성 (명명 규칙 통일)
export const userSchemas = {
  Create: userSchema.omit({ id: true, role: true, created_at: true }),
  Update: userSchema.omit({ provider: true, provider_id: true, email: true, role: true, created_at: true }).partial(),
  Response: userSchema.omit({ password: true }),
};

export const authSchemas = userSchemas;

// ✅ 유저 타입 정의 (Zod 스키마를 기반으로 한 타입 추론)
export type User = z.infer<typeof userSchema>;

// ✅ NewUser 타입 (Insert용 타입: 일부 필드를 선택적으로 정의)
export type NewUser = Omit<User, 'id' | 'created_at'>; // id와 created_at은 제외

// ✅ API 요청/응답 타입
export type CreateUserDto = z.infer<typeof userSchemas.Create>;
export type UpdateUserDto = z.infer<typeof userSchemas.Update>;
export type UserResponseDto = z.infer<typeof userSchemas.Response>;
