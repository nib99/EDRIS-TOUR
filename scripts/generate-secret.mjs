import crypto from "node:crypto";
console.log("ADMIN_SESSION_SECRET=" + crypto.randomBytes(48).toString("base64url"));
console.log("ADMIN_PASSWORD=" + crypto.randomBytes(18).toString("base64url"));
