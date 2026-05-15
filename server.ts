// server.ts
import { createStartHandler } from '@tanstack/react-start';
import { getRouterManifest } from './src/router';

const handler = createStartHandler({
  getRouterManifest,
  async onError(error) {
    console.error('Server error:', error);
  },
});

export default {
  async fetch(request: Request, env: any, ctx: any) {
    const response = await handler(request, env, ctx);
    const headers = new Headers(response.headers);
    headers.set(
      'Content-Security-Policy',
      "frame-src https://discord.com https://*.discord.com;"
    );
    return new Response(response.body, {
      status: response.status,
      headers,
    });
  },
};
