// scripts/notify-discord.ts
import fs from "node:fs";
import path from "node:path";
import { z } from "zod";
import { AddonSchema } from "../src/lib/addons";
import { SITE_URL } from "../src/lib/site";

// ── Lê variáveis de ambiente ──────────────────────────────────────
const WEBHOOK_URL = process.env.DISCORD_WEBHOOK;
if (!WEBHOOK_URL) {
  console.error("❌ Defina DISCORD_WEBHOOK no ambiente.");
  process.exit(1);
}

const DATA_PATH = path.resolve(__dirname, "../src/data/addons.json");
const SNAPSHOT_PATH = path.resolve(__dirname, "../.last-addons-snapshot.json");

// ── Carrega addons válidos ────────────────────────────────────────
function loadAddons(): z.infer<typeof AddonSchema>[] {
  const raw = JSON.parse(fs.readFileSync(DATA_PATH, "utf-8"));
  const list = z.array(AddonSchema).safeParse(raw);
  if (!list.success) {
    console.error("❌ addons.json inválido:", list.error.issues);
    process.exit(1);
  }
  return list.data;
}

// ── Lê snapshot anterior (se existir) ─────────────────────────────
function loadSnapshot(): Set<string> {
  if (!fs.existsSync(SNAPSHOT_PATH)) return new Set();
  const raw = fs.readFileSync(SNAPSHOT_PATH, "utf-8");
  try {
    const ids = JSON.parse(raw) as string[];
    return new Set(ids);
  } catch {
    return new Set();
  }
}

// ── Salva novo snapshot ───────────────────────────────────────────
function saveSnapshot(ids: string[]) {
  fs.writeFileSync(SNAPSHOT_PATH, JSON.stringify(ids, null, 2));
}

// ── Monta payload para o Discord (embed bonito) ──────────────────
function buildEmbed(addon: z.infer<typeof AddonSchema>) {
  const pageUrl = `${SITE_URL}/addon/${addon.id}`;
  return {
    content: "📦 **Novo Addon Publicado!**",
    embeds: [
      {
        title: addon.title,
        description: addon.short,
        url: pageUrl,
        color: 0xff5500, // laranja brutalista
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
}

// ── Envia para o Discord ──────────────────────────────────────────
async function sendDiscord(payload: any) {
  const res = await fetch(WEBHOOK_URL!, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`Discord respondeu ${res.status}: ${await res.text()}`);
}

// ── Main ──────────────────────────────────────────────────────────
(async () => {
  console.log("🔎 Lendo addons.json...");
  const addons = loadAddons();
  const prevIds = loadSnapshot();
  const currentIds = new Set(addons.map((a) => a.id));

  const newAddons = addons.filter((a) => !prevIds.has(a.id));

  if (newAddons.length === 0) {
    console.log("✅ Nenhum addon novo encontrado.");
    saveSnapshot(Array.from(currentIds));
    process.exit(0);
  }

  console.log(`📢 Enviando ${newAddons.length} addon(s) para o Discord...`);
  for (const addon of newAddons) {
    const payload = buildEmbed(addon);
    try {
      await sendDiscord(payload);
      console.log(`   ✔️ ${addon.title} → Discord`);
    } catch (err) {
      console.error(`   ❌ Falha ao enviar ${addon.title}:`, err);
    }
  }

  saveSnapshot(Array.from(currentIds));
  console.log("✨ Pronto!");
})();
