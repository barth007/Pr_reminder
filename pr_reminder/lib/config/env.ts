// lib/config/env.ts
export const config = {
  API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
  APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
} as const