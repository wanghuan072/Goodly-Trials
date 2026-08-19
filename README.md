# Goodly Trials Wiki & Field Archive

An SEO-first, source-conscious Goodly Trials wiki built with Next.js App Router. It combines verified unit and item data with guides, clearly labeled editorial build notes, ranking methodology, and patch impact.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open the local URL printed by Next.js. Set `NEXT_PUBLIC_SITE_URL` to the canonical production origin before deployment.

Content data lives under `src/data/game/`; route files stay small in `src/app/`; full page implementations live in `src/page/`. See `docs/content-and-seo.md` before adding records or editorial recommendations.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
