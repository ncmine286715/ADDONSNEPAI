import { MessageCircle } from "lucide-react";

// Substitua pelo código de convite do seu servidor
const DISCORD_INVITE = "7vHysxHrTr";

export function DiscordWidget() {
  return (
    <div className="brut p-4">
      <div className="flex items-center gap-2 mb-3">
        <MessageCircle className="size-5 text-indigo-500" />
        <h3 className="font-display text-xl">Discord</h3>
      </div>
      <p className="text-sm text-muted-foreground mb-4">
        Participe da nossa comunidade para novidades, suporte e conversar sobre add-ons.
      </p>
      <a
        href={`https://discord.gg/${DISCORD_INVITE}`}
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center justify-center gap-2 w-full px-4 py-2 rounded-md bg-indigo-600 text-paper border-2 border-ink font-bold uppercase text-xs brut-press transition hover:bg-indigo-700"
      >
        <MessageCircle className="size-4" /> Entrar no servidor
      </a>
    </div>
  );
}
