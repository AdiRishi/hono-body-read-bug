import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { HTTPException } from 'hono/http-exception';
import { Env } from '..';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';

export const app = new Hono<{ Bindings: Env; }>();

app.use('*', cors());

app.onError((err, c) => {
  if (c.env.ENVIRONMENT === 'development') {
    console.error(err);
  }
  if (err instanceof HTTPException) {
    return err.getResponse();
  }
  return c.json({ error: err.message }, 500);
});

app.get('/ping', (c) => c.text('pong'));

app.post('/read-body', zValidator('json', z.object({})), async (c) => {
  const rawBody = await c.req.text();
  return c.json({ rawText: rawBody });
})
