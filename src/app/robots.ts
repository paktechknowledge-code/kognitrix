import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/services", "/pricing", "/docs", "/about", "/contact", "/login", "/signup"],
        disallow: ["/dashboard/", "/api/", "/_next/", "/admin/"],
      },
    ],
    sitemap: "https://kognitrix.com/sitemap.xml",
    host: "https://kognitrix.com",
  };
}
