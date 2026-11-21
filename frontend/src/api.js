export const API_BASE_URL = (
  import.meta.env.VITE_API_URL ||
  'https://ai-research-agentbackend.vercel.app'
).replace(/\/$/, '');