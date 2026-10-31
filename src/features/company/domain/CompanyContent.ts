export interface CompanyContent {
  introduction: string;
  expertise: string;
  quality: string;
  contact: {
    email: string;
    phone: string;
    telephoneUrl: string;
    address: string;
    hours: string[];
    whatsappUrl: string;
    mapsUrl: string;
  };
  clients: { name: string; imageId: string }[];
  testimonials: {
    id: string;
    name: string;
    role: string;
    quote: string;
    imageId?: string;
  }[];
  faqs: { id: string; question: string; answer: string }[];
}
