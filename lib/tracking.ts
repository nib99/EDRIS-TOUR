import crypto from "node:crypto";

export function generateTrackingToken() {
  return crypto.randomBytes(18).toString("base64url");
}

/** Human-friendly short code for customers (e.g. EDR-A7K2M9) */
export function generateShortCode() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let out = "EDR-";
  const bytes = crypto.randomBytes(6);
  for (let i = 0; i < 6; i++) out += alphabet[bytes[i]! % alphabet.length];
  return out;
}
