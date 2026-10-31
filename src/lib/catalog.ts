export const PHONES = [
  { display: "+251 922 00 53 74", tel: "+251922005374" },
  { display: "+251 949 89 21 93", tel: "+251949892193" },
] as const;

export const OWNER_NAME = "Idris Mohammed";

export const SERVICE_IDS = [
  "passport",
  "coc",
  "police",
  "medical",
  "ilms",
  "ticket",
  "visa",
] as const;
export type ServiceId = (typeof SERVICE_IDS)[number];

export const PASSPORT_SPEEDS = ["urgent_2", "urgent_5", "normal"] as const;
export type PassportSpeed = (typeof PASSPORT_SPEEDS)[number];

export const STATUSES = [
  "new",
  "contacted",
  "documents_pending",
  "in_progress",
  "completed",
  "cancelled",
] as const;
export type InquiryStatus = (typeof STATUSES)[number];

export const ACTIVE_STATUSES: InquiryStatus[] = [
  "contacted",
  "documents_pending",
  "in_progress",
];

export const PAYMENT_STATUSES = ["unpaid", "partial", "paid", "refunded"] as const;
export type PaymentStatus = (typeof PAYMENT_STATUSES)[number];

export const CHECK_STATES = ["missing", "received", "verified"] as const;
export type CheckState = (typeof CHECK_STATES)[number];

export const DOC_KEYS = [
  "birth_certificate",
  "identity_card",
  "national_id",
  "photos",
  "coc_original",
  "passport_copy",
  "travel_dates",
  "supporting_letter",
  "host_letter",
] as const;
export type DocKey = (typeof DOC_KEYS)[number];

export const CHECKLIST: Record<ServiceId, readonly DocKey[]> = {
  passport: ["birth_certificate", "identity_card", "national_id", "photos"],
  coc: ["coc_original", "identity_card", "photos"],
  police: ["identity_card", "national_id", "photos"],
  medical: ["identity_card", "passport_copy"],
  ilms: ["identity_card", "national_id", "photos", "supporting_letter"],
  ticket: ["passport_copy", "travel_dates"],
  visa: ["passport_copy", "photos", "identity_card", "host_letter"],
};

export const JOURNEY = [
  "inquiry",
  "checklist",
  "application",
  "payment",
  "receipt",
  "staff",
  "tracking",
  "completion",
] as const;
export type JourneyId = (typeof JOURNEY)[number];

export function isServiceId(value: string): value is ServiceId {
  return (SERVICE_IDS as readonly string[]).includes(value);
}

export function isStatus(value: string): value is InquiryStatus {
  return (STATUSES as readonly string[]).includes(value);
}

export function isPaymentStatus(value: string): value is PaymentStatus {
  return (PAYMENT_STATUSES as readonly string[]).includes(value);
}

export function isCheckState(value: string): value is CheckState {
  return (CHECK_STATES as readonly string[]).includes(value);
}

export function isPassportSpeed(value: string): value is PassportSpeed {
  return (PASSPORT_SPEEDS as readonly string[]).includes(value);
}

const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

export function makeReference(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(6));
  let out = "ETT-";
  for (const byte of bytes) out += ALPHABET[byte % ALPHABET.length];
  return out;
}

export function phoneKey(input: string): string {
  const digits = input.replace(/\D/g, "");
  if (digits.length >= 12 && digits.startsWith("251")) return digits.slice(-9);
  if (digits.length >= 10 && digits.startsWith("0")) return digits.slice(-9);
  if (digits.length > 9) return digits.slice(-9);
  return digits;
}

export function phonesMatch(a: string, b: string): boolean {
  const left = phoneKey(a);
  const right = phoneKey(b);
  return left.length >= 9 && left === right;
}

export function journeyIndex(status: InquiryStatus): number {
  switch (status) {
    case "new":
      return 0;
    case "contacted":
      return 1;
    case "documents_pending":
      return 2;
    case "in_progress":
      return 5;
    case "completed":
      return 7;
    case "cancelled":
      return -1;
  }
}
