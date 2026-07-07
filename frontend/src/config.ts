// Next.js Route Handlers are co-located, so API_BASE_URL is empty string by default.
// This routes all requests to the same origin (local or deployed Vercel domain).
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';
