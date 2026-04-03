# FilingLens

**SEBI filings, decoded for Indian retail investors.**

Upload any quarterly result, annual report, or DRHP and get a plain-English briefing in 60 seconds — red flags, financials, management tone, and a clear verdict.

## Getting started

```bash
npm install
npm run dev
```

Open `localhost:5173`. You'll be prompted for an Anthropic API key on first use.

## Deploy to Vercel

1. Push this repo to GitHub
2. Import on vercel.com → Framework: Vite
3. No environment variables needed — the API key is stored per-user in their browser

## Tech stack

- React + Vite
- Recharts for trend charts
- PDF.js for client-side PDF extraction
- Anthropic Claude API (claude-sonnet-4-20250514) for analysis
- CSS Modules for styling

## How it works

1. User uploads a SEBI filing PDF
2. PDF.js extracts text client-side (no server, no upload)
3. Text is sent to Claude API with a structured prompt
4. Claude returns JSON analysis
5. React renders the report

All processing happens in the browser. Nothing is stored server-side.

## Disclaimer

For informational purposes only. Not investment advice.
