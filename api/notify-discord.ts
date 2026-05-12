// src/routes/api/notify-discord.ts
import { createFileRoute } from "@tanstack/react-router";
import { AddonSchema } from "@/lib/addons";
import { ADDONS } from "@/lib/addons"; // array atual de addons
import { SITE_URL } from "@/lib/site";

export const Route = createFileRoute("/api/notify-discord")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const webhook = (globalThis as any).DISCORD_WEBHOOK || process.env.DISCORD_WEBHOOK;
        if (!webhook) {
          return new Response("Webhook não configurado", { status: 500 });
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

        // Verifica se já existe (opcional)
        const exists = ADDONS.some((a) => a.id === addon.id);
        // Se quiser pular se já existe, descomente:
        // if (exists) return new Response("Addon já existente, ignorado", { status: 200 });

        const pageUrl = `${SITE_URL}/addon/${addon.id}`;

        const embed = {
          content: "📦 **Novo Addon Publicado!**",
          embeds: [
            {
              title: addon.title,
              description: addon.short,
              url: pageUrl,
              color: 0xff5500,
              image: { url: addon.image || "https://placehold.co/600x300/111/fff?text=No+Image" },
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

        const discordRes = await fetch(webhook, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(embed),
        });

        if (!discordRes.ok) {
          console.error("Erro ao enviar para o Discord:", await discordRes.text());
          return new Response("Falha ao enviar para o Discord", { status: 500 });
        }

        return new Response("Notificação enviada com sucesso!", { status: 200 });
      },
    },
  },
});
