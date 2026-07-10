const base = process.env.NEXT_PUBLIC_SITE_DOMAIN
  ? `https://${process.env.NEXT_PUBLIC_SITE_DOMAIN}`
  : 'http://localhost:3000';

export default function robots() {
  return {
    rules: [{ userAgent: '*' }],
    sitemap: `${base}/sitemap.xml`,
  };
}
