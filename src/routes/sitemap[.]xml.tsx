import { createFileRoute } from "@tanstack/react-router";
import { ADDONS } from "@/lib/addons";
import { SITE_URL } from "@/lib/site";

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: () => {
        const staticUrls = [
          { loc: `${SITE_URL}/`, priority: "1.0" },
          { loc: `${SITE_URL}/ncmine`, priority: "0.8" },
        ];
        const addonUrls = ADDONS.map((a) => ({
          loc: `${SITE_URL}/addon/${a.id}`,
          lastmod: a.date,
          priority: "0.7",
        }));
        const all = [...staticUrls, ...addonUrls];
        const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${all
  .map(
    (u) =>
      `  <url><loc>${u.loc}</loc>${"lastmod" in u && u.lastmod ? `<lastmod>${u.lastmod}</lastmod>` : ""}<priority>${u.priority}</priority></url>`
  )
  .join("\n")}
</urlset>`;
        return new Response(xml, {
          headers: { "Content-Type": "application/xml; charset=utf-8" },
        });
      },
    },
  },
});
