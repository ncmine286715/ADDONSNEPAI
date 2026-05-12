// src/routes/api/extract-addon.ts (versão funcional com HTMLRewriter)
import { createFileRoute } from "@tanstack/react-router";

interface Extracted {
  title: string;
  short: string;
  description: string;
  image: string;
  downloads: string;
  author: string;
  category: string;
  tags: string[];
  version?: string;
}

async function scrapeMcpedl(url: string): Promise<Extracted> {
  const resp = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } });
  if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
  
  // HTMLRewriter para MCPEDL
  let title = "", image = "", author = "", downloads = "", category = "", version = "";
  const tags: string[] = [];
  let short = "", description = "";

  const rewriter = new HTMLRewriter()
    .on("h1.post-title", {
      element(el) { title = el.getAttribute("data-title") || (el.textContent || "").trim(); }
    })
    .on("div.post-thumb img", {
      element(el) { image = el.getAttribute("src") || ""; }
    })
    .on("a.author-link", {
      element(el) { author = (el.textContent || "").trim(); }
    })
    .on("span.download-count", {
      element(el) { downloads = (el.textContent || "").replace(/\D/g, ""); }
    })
    .on("div.post-categories a", {
      element(el) { if (!category) category = (el.textContent || "").trim(); }
    })
    .on("div.post-tags a", {
      element(el) { tags.push((el.textContent || "").trim()); }
    })
    .on("div.post-content p:first-child", {
      element(el) { short = (el.textContent || "").trim().substring(0, 140); }
    })
    .on("div.post-content", {
      element(el) {
        // Pegar todo o texto interno como descrição (limpo no final)
        const full = el.textContent || "";
        description = full.substring(0, 2000); // limitar
      }
    });

  await rewriter.transform(resp.clone()).text(); // Executa rewriter
  // HTMLRewriter não retorna resultados, temos que coletar via callbacks; aqui chamamos transform mas as variáveis são populadas.
  // Precisamos consumir o body. O HTMLRewriter é usado com resp.text() ou resp.arrayBuffer(); vamos usar.
  await resp.text(); // descartar
  
  return { title, short, description, image, downloads, author, category, tags, version };
}

const scrapers: Record<string, (url: string) => Promise<Extracted>> = {
  "mcpedl.com": scrapeMcpedl,
  // futuramente curseforge, etc.
};

export const Route = createFileRoute("/api/extract-addon")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let body: { url?: string };
        try { body = await request.json(); } catch { return Response.json({ error: "JSON inválido" }, { status: 400 }); }
        if (!body.url) return Response.json({ error: "URL obrigatória" }, { status: 400 });

        const urlObj = new URL(body.url);
        const domain = Object.keys(scrapers).find(d => urlObj.hostname.includes(d));
        if (!domain) return Response.json({ error: "Domínio não suportado. Use mcpedl.com" }, { status: 400 });

        try {
          const data = await scrapers[domain](body.url);
          return Response.json(data);
        } catch (err) {
          return Response.json({ error: `Falha ao extrair: ${(err as Error).message}` }, { status: 502 });
        }
      },
    },
  },
});
