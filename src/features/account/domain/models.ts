import { z } from 'zod';
export const normalizeEmail = (value: string) => value.trim().toLowerCase();
export const normalizePhone = (value: string) => value.replace(/[\s()-]/g, '');
export const validPhone = (value: string) =>
  /^\+?[0-9]{7,15}$/.test(normalizePhone(value));
export const profileInputSchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().transform(normalizeEmail).pipe(z.email().max(254)),
  phone: z.string().transform(normalizePhone).refine(validPhone),
  avatar: z.enum(['red', 'charcoal', 'white']).default('red'),
});
export type ProfileInput = z.input<typeof profileInputSchema>;
export const profileSchema = profileInputSchema.extend({
  id: z.string().min(1),
  createdAt: z.string().datetime(),
});
export type DemoProfile = z.infer<typeof profileSchema>;
export const quoteInputSchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.email().max(254),
  phone: z.string().refine(validPhone),
  serviceId: z.string().min(1),
  message: z.string().trim().min(5).max(3000),
  projectId: z.string().optional(),
});
export type QuoteInput = z.infer<typeof quoteInputSchema>;
export const quoteSchema = quoteInputSchema.extend({
  id: z.string(),
  reference: z.string(),
  createdAt: z.string().datetime(),
  status: z.enum([
    'Local demo • Not submitted',
    'Draft',
    'Submitted (Demo)',
    'Cancelled (Demo)',
  ]),
  form: z.record(z.string(), z.string()).optional(),
  step: z.number().int().min(0).max(3).optional(),
});
export type DemoQuote = z.infer<typeof quoteSchema>;
export const notificationSchema = z.object({
  id: z.string(),
  title: z.string(),
  body: z.string(),
  createdAt: z.string().datetime(),
  read: z.boolean(),
  quoteId: z.string().optional(),
});
export type DemoNotification = z.infer<typeof notificationSchema>;
export interface DemoSnapshot {
  profile: DemoProfile | null;
  savedProjects: readonly string[];
  quotations: readonly DemoQuote[];
  notifications: readonly DemoNotification[];
  notificationsEnabled: boolean;
}
export const emptySnapshot: DemoSnapshot = {
  profile: null,
  savedProjects: [],
  quotations: [],
  notifications: [],
  notificationsEnabled: true,
};
