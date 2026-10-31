# Idris Tour & Travel — Update package

This ZIP contains **only changed and newly added files**. Merge them into your existing project root (overwrite matching paths).

## What changed

### New files
- `src/lib/i18n/translations.ts` — English, Afaan Oromo, Amharic strings (content from your Oromo brief)
- `src/lib/i18n/context.tsx` — language context + localStorage overrides for admin edits
- `src/components/site/floating-contact.tsx` — fixed Call + WhatsApp buttons
- `src/routes/admin.tsx` — password-protected admin dashboard (default password: `idris2025`)
- `public/logo.png` + favicon/icon PNGs from your uploaded logo
- `public/manifest.webmanifest` — PWA installable (standalone, icons, theme)

### Updated files
- `src/routes/__root.tsx` — I18nProvider, PWA meta, logo favicons
- `src/routes/index.tsx` — FloatingContact
- `src/components/site/header.tsx` — logo image + language switcher (OM / AM / EN)
- `src/components/site/services.tsx` — passport types, required docs, COC, police clearance, medical, ILMS, tickets, Arab visas
- `src/components/site/footer.tsx` — phones, logo, multilingual footer
- `src/styles.css` — mobile-first tweaks, floating buttons, lang switcher, passport card, admin UI, safe-area

## How to apply
1. Unzip over the project root.
2. Ensure route tree picks up `/admin` (TanStack Router file-based: `src/routes/admin.tsx`).
3. Restart dev server.
4. Open site → language buttons top-right / mobile menu.
5. `/admin` → password `idris2025` → edit hero/services text per language (stored in browser localStorage).

## Contact numbers used
- +251 922 00 53 74 (Call + primary WhatsApp)
- +251 949 89 21 93

## Notes
- Default UI language: Afaan Oromo.
- Admin edits are client-side only (demo). For shared production content, wire the overrides to your existing DB/auth stack.
- PWA: existing Grok PWA plugin + this manifest/icons enable “Add to Home Screen”.
