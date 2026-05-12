// src/routes/api/notify-discord.ts
import { createFileRoute } from "@tanstack/react-router";
import { AddonSchema } from "@/lib/addons";
import { SITE_URL } from "@/lib/site";

export const Route = createFileRoute("/api/notify-discord")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        // Pega a variável de ambiente do Cloudflare
        const webhook = (globalThis as any).DISCORD_WEBHOOK;
        if (!webhook) {
          return new Response("Webhook não configurado no servidor", { status: 500 });
        }

        let body: unknown;
        try {
          body = await request.json();
        } catch {
          return new Response("JSON inválido", { status: 400 });
        }

        const parsed = AddonSchema.safeParse(body);
        if (!parsed.success) {
          return new Response("Dados inválidos: " + parsed.error.message, { status: 400 });
        }

        const addon = parsed.data;
        const pageUrl = `${SITE_URL}/addon/${addon.id}`;

        const embed = {
          content: "📦 **Novo Addon Publicado!**",
          embeds: [
            {
              title: addon.title,
              description: addon.short,
              url: pageUrl,
              color: 0xff5500,
              image: {
                url: addon.image || "https://placehold.co/600x300/111/fff?text=No+Image",
              },
              fields: [
                { name: "🔖 Categoria", value: addon.category, inline: true },
                { name: "📦 Versão", value: addon.version, inline: true },
                { name: "⭐ Avaliação", value: `${addon.rating}/5`, inline: true },
                { name: "📥 Downloads", value: String(addon.downloads), inline: true },
                { name: "👤 Autor", value: addon.author || "Desconhecido", inline: true },
                { name: "🏷️ Tags", value: addon.tags.join(", "), inline: false },
                { name: "🔗 Link", value: `[Acessar página](${pageUrl})`, inline: false },
              ],
              footer: {
                text: `Mine Addons News • ${new Date(addon.date).toLocaleDateString("pt-BR")}`,
              },
            },
          ],
        };

        try {
          const discordRes = await fetch(webhook, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(embed),
          });
          if (!discordRes.ok) {
            console.error("Erro Discord:", await discordRes.text());
            return new Response("Erro ao enviar para o Discord", { status: 502 });
          }
          return new Response("Mensagem enviada com sucesso!", { status: 200 });
        } catch (err) {
          console.error("Erro de rede:", err);
          return new Response("Erro de rede ao contactar o Discord", { status: 502 });
        }
      },
    },
  },
});
