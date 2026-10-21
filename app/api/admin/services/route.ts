import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { getPool } from "@/lib/db";
import { z } from "zod";

export const runtime = "nodejs";

const schema = z.object({
  id: z.number().int().positive().optional(),
  code: z.string().min(2).max(64).optional(),
  name_en: z.string().min(2).max(160),
  name_am: z.string().max(160).optional().default(""),
  name_om: z.string().max(160).optional().default(""),
  category: z.string().max(64).optional().default("general"),
  base_price: z.number().nonnegative(),
  currency: z.string().max(8).optional().default("ETB"),
  description: z.string().max(2000).optional().default(""),
  active: z.boolean().optional().default(true),
  sort_order: z.number().int().optional().default(100)
});

export async function GET() {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const db = getPool();
  if (!db) return NextResponse.json({ error: "Database not configured." }, { status: 503 });

  const result = await db.query(
    `select * from services order by sort_order, id`
  );
  return NextResponse.json({ services: result.rows });
}

export async function POST(request: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const db = getPool();
  if (!db) return NextResponse.json({ error: "Database not configured." }, { status: 503 });

  try {
    const body = schema.parse(await request.json());
    if (body.id) {
      const result = await db.query(
        `update services set
           name_en=$1, name_am=$2, name_om=$3, category=$4,
           base_price=$5, currency=$6, description=$7, active=$8,
           sort_order=$9, updated_at=now()
         where id=$10 returning *`,
        [
          body.name_en,
          body.name_am || "",
          body.name_om || "",
          body.category || "general",
          body.base_price,
          body.currency || "ETB",
          body.description || "",
          body.active ?? true,
          body.sort_order ?? 100,
          body.id
        ]
      );
      if (!result.rowCount) return NextResponse.json({ error: "Not found." }, { status: 404 });
      return NextResponse.json({ service: result.rows[0] });
    }
    const code =
      body.code ||
      body.name_en
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "_")
        .replace(/^_|_$/g, "")
        .slice(0, 60);
    const result = await db.query(
      `insert into services
         (code, name_en, name_am, name_om, category, base_price, currency, description, active, sort_order)
       values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
       returning *`,
      [
        code,
        body.name_en,
        body.name_am || "",
        body.name_om || "",
        body.category || "general",
        body.base_price,
        body.currency || "ETB",
        body.description || "",
        body.active ?? true,
        body.sort_order ?? 100
      ]
    );
    return NextResponse.json({ service: result.rows[0] });
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
}
