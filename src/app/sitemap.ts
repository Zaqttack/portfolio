const base = process.env.NEXT_PUBLIC_SITE_DOMAIN
  ? `https://${process.env.NEXT_PUBLIC_SITE_DOMAIN}`
  : 'http://localhost:3000';

export default function sitemap() {
  return [
    { url: base, lastModified: new Date() },
    { url: `${base}/projects`, lastModified: new Date() },
    { url: `${base}/writing`, lastModified: new Date() },
    { url: `${base}/experience`, lastModified: new Date() },
  ];
}
