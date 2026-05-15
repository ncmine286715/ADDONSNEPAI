import { MessageCircle } from "lucide-react";

// Substitua pelo ID do seu servidor Discord
const DISCORD_SERVER_ID = "1501873290413604929";

export function DiscordWidget() {
  return (
    <div className="brut p-4">
      <div className="flex items-center gap-2 mb-3">
        <MessageCircle className="size-5 text-indigo-500" />
        <h3 className="font-display text-xl">Discord</h3>
      </div>
      <iframe
        src={`https://discord.com/widget?id=${DISCORD_SERVER_ID}&theme=dark`}
        width="100%"
        height="300"
        allowTransparency
        frameBorder="0"
        sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"
        className="border-2 border-ink rounded-md"
        title="Discord Widget"
      />
      <a
        href={`https://discord.gg/${DISCORD_SERVER_ID}`}
        target="_blank"
        rel="noreferrer"
        className="mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-md bg-indigo-600 text-paper border-2 border-ink font-bold uppercase text-xs brut-press w-full justify-center"
      >
        <MessageCircle className="size-4" /> Entrar no servidor
      </a>
    </div>
  );
}
