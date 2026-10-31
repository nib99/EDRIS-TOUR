#!/usr/bin/env node
/**
 * Print production secrets for the Edris owner desk.
 * Paste them into the host environment. Do not commit the output.
 *
 *   OWNER_PASSWORD  — the only password that opens /admin
 *   SESSION_SECRET  — HMAC key for the HttpOnly owner cookie
 *
 * When OWNER_PASSWORD is set it overrides any password saved in the database.
 */
import { randomBytes } from "node:crypto";

const ownerPassword = randomBytes(18).toString("base64url");
const sessionSecret = randomBytes(32).toString("base64url");

process.stdout.write(
  [
    "# Edris Tour & Travel — owner desk",
    "# Set both values on the host before real customer files are stored.",
    `OWNER_PASSWORD=${ownerPassword}`,
    `SESSION_SECRET=${sessionSecret}`,
    "",
  ].join("\n"),
);
