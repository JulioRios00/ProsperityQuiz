/// <reference types="vite/client" />

interface Window {
  pixelId?: string;
}

interface ImportMetaEnv {
  readonly VITE_API_URL: string
  readonly VITE_API_TIMEOUT: string
  readonly VITE_GA4_ID: string
  readonly VITE_FB_PIXEL_ID: string
  readonly VITE_ANALYTICS_DASHBOARD_KEY: string
  readonly VITE_ANALYTICS_DASHBOARD_USER: string
  readonly VITE_ANALYTICS_DASHBOARD_PASSWORD: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
