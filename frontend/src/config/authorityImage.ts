/**
 * AI-generated portrait of "Mestra Renata Alves" via Pollinations.ai.
 * Fixed seed = consistent image across all renders.
 *
 * To replace with a custom image:
 *   1. Generate your image (Midjourney / DALL-E / Stable Diffusion)
 *   2. Save to frontend/public/images/mestra-renata.jpg
 *   3. Change AUTHORITY_IMAGE_URL to "/images/mestra-renata.jpg"
 */

const PROMPT = [
  'professional Brazilian woman 43 years old',
  'spiritual numerologist therapist',
  'warm empathetic confident smile',
  'soft natural lighting',
  'elegant blouse cream and gold tones',
  'portrait close-up direct eye contact',
  'photorealistic high quality',
  'clean background soft bokeh',
].join(' ');

export const AUTHORITY_IMAGE_URL =
  `https://image.pollinations.ai/prompt/${encodeURIComponent(PROMPT)}` +
  `?seed=4721&width=512&height=640&nologo=true&enhance=true`;

export const AUTHORITY_NAME = 'Mestra Renata Alves';
export const AUTHORITY_TITLE = 'Numeróloga & Terapeuta Vibracional';
