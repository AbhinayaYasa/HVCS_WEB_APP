export const SERVICE_REQUEST_CATEGORIES = [
  'Personal',
  'Delivery',
  'Transportation',
] as const;

export type ServiceRequestCategory = (typeof SERVICE_REQUEST_CATEGORIES)[number];

export interface ServiceRequestCreate {
  category: ServiceRequestCategory;
  name: string;
  email: string;
  phone: string;
  details: string;
}
