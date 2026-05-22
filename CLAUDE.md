# Thaumary AI — Project Context

## Quick Start
```bash
cd C:\Users\Administrator\Desktop\ai-prompt-site
npm run dev
# → http://localhost:3000/en
```

## Tech Stack
- Next.js 16.2.6 (webpack mode, SWC WASM fallback — native bindings broken on this machine)
- React 19.2.4 + Tailwind CSS 4 + next-intl 4.12 (i18n: en/zh/ja/ko)
- Supabase (project: epypxxzmwskhbycbhuey, db: ai-prompt-site)
- Deployed on Vercel (gh → zhinv7110/promptai → promptai-eta.vercel.app)

## Environment
```
NEXT_PUBLIC_SUPABASE_URL=https://epypxxzmwskhbycbhuey.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_mbU-AU62hzaFExIiS5tOKw_pYjlp7Gt
ADMIN_PASSWORD=admin123
```

## i18n Architecture (v2 — Multilingual)

### Locales: en, zh, ja, ko
- **Single source of truth**: `src/i18n/routing.ts` defines all locales
- **middleware**: `src/proxy.ts` (custom, not next-intl middleware) — detects locale from cookie → Accept-Language header → default (en)
- **UI translations**: `messages/{locale}.json` — next-intl format, covers nav/footer/home/tools/common/meta
- **DB content**: `_en`/`_zh`/`_ja`/`_ko` column suffix pattern
  - `localizedField(item, field, locale)` — tries `${field}_${locale}` → `${field}_en` → `''`
  - Core `prompt_text` is NEVER translated
- **Language switcher**: Globe icon dropdown in nav, shows native names (English/中文/日本語/한국어)

### TypeScript notes
- `localizedField` accepts `item: any` (TypeScript concrete interfaces like `BlogPost` don't satisfy `Record<string, unknown>` index signatures)
- Locale-aware helpers: `localizedField()`, `localizedLabel()`, `ogLocale()`, `languageName()` in `src/lib/i18n-utils.ts`
- `Locale` type exported from `@/i18n/routing`

## Route Map

### Public Pages (30+ — all locale-prefixed)
- /[locale] — Homepage (Hero + Featured + Trending + Categories + LatestArticles)
- /[locale]/prompt-library — Prompt listing (search, category/model filters, pagination)
- /[locale]/prompt-library/[slug] — Prompt detail (breadcrumb, info cards, usage tips, related)
- /[locale]/blog — Blog listing
- /[locale]/blog/[slug] — Blog detail (TOC, FAQ schema, related articles)
- /[locale]/categories/[slug] — Category page
- /[locale]/tags/[slug] — Tag page
- /[locale]/search?q= — Search results (prompts + blog)
- /[locale]/about, /pricing, /tools

### Tools (6)
- /prompt-generator, /prompt-enhancer, /style-generator, /image-analyzer, /negative-prompt, /tools

### Auth & Dashboard
- /login, /register — OAuth (Google/GitHub/Discord) + Email Magic Link + Guest
- /dashboard + /favorites, /history, /collections, /settings

### Admin (password: admin123)
- /admin + /prompts CRUD + /blog CRUD + /import

## Key Files
| File | Purpose |
|---|---|
| `src/i18n/routing.ts` | Locale definitions (en/zh/ja/ko) |
| `src/proxy.ts` | Custom i18n middleware (cookie → Accept-Language → default) |
| `src/lib/i18n-utils.ts` | `localizedField`, `localizedLabel`, `ogLocale`, `languageName` |
| `src/lib/metadata.ts` | SEO — `canonicalUrl()`, `alternateUrls()`, `ogMetadata()` |
| `src/lib/data.ts` | Supabase data layer (queries include _ja/_ko fields) |
| `messages/{en,zh,ja,ko}.json` | UI translation files |

## Database
- **7 new columns added** via `supabase/migrations/007_multilingual.sql`:
  - prompts: `description_ja`, `description_ko`
  - blog_posts: `title_ja`, `title_ko`, `excerpt_ja`, `excerpt_ko`, `content_ja`, `content_ko`
  - categories: `name_ja`, `name_ko`
  - collections: `name_ja`, `name_ko`, `description_ja`, `description_ko`
  - tags: `name_ja`, `name_ko`
- **Run this migration** on the Supabase dashboard SQL editor before ja/ko content appears

## Vercel Deploy
- Auto-deploy: `git push origin main` → triggers Vercel GitHub integration
- Direct: `vercel --prod`
- Current production: https://promptai-eta.vercel.app

## What's Done (i18n v2)
- [x] i18n routing: en/zh/ja/ko in routing.ts, proxy.ts, request.ts
- [x] UI translations: ja.json + ko.json (full 6 namespaces)
- [x] DB utilities: localizedField() with English fallback chain
- [x] SEO: hreflang alternates, per-locale OG metadata, canonical URLs
- [x] Language switcher: Globe icon dropdown with native locale names
- [x] Vercel deploy: build passes, all 4 locales return 200
- [x] Content display: 9 UI files migrated to localizedField()

## What's Pending (for next session)
- [ ] **Run DB migration**: Execute `supabase/migrations/007_multilingual.sql` in Supabase SQL editor
- [ ] **ja/ko content**: Add Japanese and Korean descriptions for prompts, blog posts, categories
- [ ] **Admin panel**: Update admin CRUD to support _ja/_ko fields in forms
- [ ] **Tool pages**: Migrate prompt-generator, prompt-enhancer, style-generator, image-analyzer, negative-prompt to use localizedField() for UI text (these currently have hardcoded en/zh)
- [ ] **Dashboard pages**: 5 dashboard pages behind auth (lower priority)
- [ ] **Explanation generation**: Add ja/ko support in `src/lib/language.ts`
- [ ] **Sitemap**: Verify sitemap includes all 4 locale paths
- [ ] **Future locales**: es, pt, de — add to routing.ts → new migration → new message files

## Known Issues
- SWC native bindings broken (Node 25 + Windows) → WASM fallback works
- Admin login uses simple password (not JWT validation on refresh)
- Some OAuth providers (Apple/X) not configured
- `vercel list` returns preview deployments mixed with production — use `vercel inspect --prod` (may fail without project link)
