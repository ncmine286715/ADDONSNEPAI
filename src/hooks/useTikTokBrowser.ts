import { useEffect, useState } from "react";

export type TikTokBlockerInfo = {
  detected: boolean;
  app: "TikTok" | "Instagram" | "Facebook" | "Other";
  isIOS: boolean;
  url: string;
};

const IAB_PATTERN =
  /Instagram|FBAN|FBAV|FB_IAB|musical_ly|TikTok|BytedanceWebview|ByteLocale|Snapchat|Twitter|LinkedInApp|Pinterest|reddit\/|MicroMessenger|Line\/|KAKAOTALK|Naver/i;

function detect(): Omit<TikTokBlockerInfo, "url"> {
  if (typeof navigator === "undefined") {
    return { detected: false, app: "Other", isIOS: false };
  }

  const ua = navigator.userAgent;
  const detected = IAB_PATTERN.test(ua);

  let app: TikTokBlockerInfo["app"] = "Other";
  if (/Instagram/i.test(ua)) app = "Instagram";
  else if (/FBAN|FBAV|FB_IAB/i.test(ua)) app = "Facebook";
  else if (/musical_ly|TikTok|BytedanceWebview/i.test(ua)) app = "TikTok";

  const isIOS = /iPhone|iPad|iPod/i.test(ua);

  // Só bloqueia oficialmente TikTok/Instagram/Facebook
  const officialDetected = detected && (app === "TikTok" || app === "Instagram" || app === "Facebook");

  return { detected: officialDetected, app, isIOS };
}

/**
 * Client-only hook para evitar problemas de hidratação/SSR.
 */
export function useTikTokBrowser(): TikTokBlockerInfo {
  const [state, setState] = useState<TikTokBlockerInfo>({
    detected: false,
    app: "Other",
    isIOS: false,
    url: "",
  });

  useEffect(() => {
    const d = detect();
    setState({
      ...d,
      url: window.location.href,
    });
  }, []);

  return state;
}

export function buildIntentRedirect(params: { url: string; isIOS: boolean }) {
  const { url, isIOS } = params;

  // iOS: tentativa de abrir em navegador externo (aproximação)
  // Android: intent://
  if (isIOS) {
    // Alguns dispositivos interpretam bem; se não funcionar, usuário ainda pode copiar/abrir.
    return `x-web-search://?q=${encodeURIComponent(url)}`;
  }

  // Android intent: abre no browser padrão
  return `intent://${url.replace(/^https?:\/\//, "")}#Intent;scheme=https;package=com.android.chrome;end`;
}
