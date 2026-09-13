import type { MetadataRoute } from "next";
export default function robots(): MetadataRoute.Robots {
  const site = process.env.NEXT_PUBLIC_SITE_URL;
  return { rules: { userAgent: "*", allow: site ? "/" : undefined, disallow: site ? ["/admin", "/api/"] : "/" }, sitemap: site ? `${site.replace(/\/$/, "")}/sitemap.xml` : undefined };
}
