import type { CheckState, InquiryStatus, PaymentStatus, ServiceId } from "@/lib/catalog";

export type InquirySummary = {
  id: string;
  reference: string;
  fullName: string;
  phone: string;
  service: ServiceId | string;
  passportSpeed: string | null;
  destination: string | null;
  status: InquiryStatus | string;
  paymentStatus: PaymentStatus | string;
  assignedStaff: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ChecklistItem = {
  id: number;
  docKey: string;
  state: CheckState | string;
};

export type StatusEvent = {
  id: number;
  fromStatus: string | null;
  toStatus: string;
  note: string | null;
  createdAt: string;
};

export type InquiryDetail = InquirySummary & {
  email: string | null;
  city: string | null;
  language: string;
  travelDate: string | null;
  message: string | null;
  internalNotes: string;
  paymentAmount: string | null;
  paymentCurrency: string;
  paymentMethod: string | null;
  receiptNumber: string | null;
  receiptIssuedAt: string | null;
  applicationRef: string | null;
  applicationAuthority: string | null;
  applicationSubmittedAt: string | null;
  contactedAt: string | null;
  completedAt: string | null;
  checklist: ChecklistItem[];
  events: StatusEvent[];
};

export type Metrics = {
  newCount: number;
  active: number;
  completed: number;
  total: number;
};

export type PublicTrack = {
  reference: string;
  fullName: string;
  service: string;
  passportSpeed: string | null;
  destination: string | null;
  status: string;
  paymentStatus: string;
  paymentAmount: string | null;
  paymentCurrency: string;
  receiptNumber: string | null;
  applicationRef: string | null;
  applicationAuthority: string | null;
  assignedStaff: string | null;
  createdAt: string;
  updatedAt: string;
  checklist: ChecklistItem[];
  events: Array<Pick<StatusEvent, "id" | "toStatus" | "createdAt">>;
};
