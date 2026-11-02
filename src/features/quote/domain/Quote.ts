import { validEmail } from '../../auth/domain/AuthRepository';
import { validPhone, type DemoQuote } from '../../account/domain/models';
import { solutionFixtures } from '../../../mocks/fixtures/solutions';
export type QuoteStatus = 'Draft' | 'Submitted (Demo)' | 'Cancelled (Demo)';
export interface QuoteFormData {
  solutionId: string;
  projectId: string;
  title: string;
  description: string;
  location: string;
  budget: string;
  completionDate: string;
  additional: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  contactMethod: string;
}
export type QuoteRequest = DemoQuote;
export type QuoteDraft = DemoQuote & { status: 'Draft' };
export interface QuoteRepository {
  saveQuoteDraft(
    form: QuoteFormData,
    id: string,
    step: number,
  ): Promise<DemoQuote>;
  submitQuote(form: QuoteFormData, id: string): Promise<DemoQuote>;
  deleteQuotation(id: string): Promise<void>;
}
export const emptyQuoteForm: QuoteFormData = {
  solutionId: '',
  projectId: '',
  title: '',
  description: '',
  location: '',
  budget: '',
  completionDate: '',
  additional: '',
  name: '',
  company: '',
  email: '',
  phone: '',
  contactMethod: 'Email',
};
export function validateQuoteStep(
  form: QuoteFormData,
  step: number,
): string | null {
  if (Object.values(form).some(value => value.length > 3000))
    return 'Keep each field within 3000 characters.';
  if (step === 0 && !solutionFixtures.some(s => s.id === form.solutionId))
    return 'Select a solution to continue.';
  if (step === 1) {
    if (
      !form.title.trim() ||
      form.description.trim().length < 5 ||
      !form.location.trim()
    )
      return 'Enter a project title, description (at least 5 characters), and location.';
    if (
      form.completionDate &&
      (!/^\d{4}-\d{2}-\d{2}$/.test(form.completionDate) ||
        Number.isNaN(Date.parse(form.completionDate)) ||
        new Date(form.completionDate).toISOString().slice(0, 10) !==
          form.completionDate)
    )
      return 'Enter a valid completion date as YYYY-MM-DD.';
  }
  if (
    step === 2 &&
    (form.name.trim().length < 2 ||
      form.name.length > 80 ||
      !validEmail(form.email) ||
      form.email.length > 254 ||
      !validPhone(form.phone) ||
      !['Email', 'Phone', 'WhatsApp'].includes(form.contactMethod))
  )
    return 'Enter your full name, valid email, phone (7–15 digits), and preferred contact method.';
  return null;
}
export function validateQuote(form: QuoteFormData) {
  for (let step = 0; step < 3; step++) {
    const error = validateQuoteStep(form, step);
    if (error) return error;
  }
  return null;
}
