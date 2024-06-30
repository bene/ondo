import { Hono } from "hono";

import { endpoint } from "./matter";
import { getMode, getTemperature } from "./physical";

export const app = new Hono();

app.get("/", async (c) => {
  const temperature = await getTemperature();
  const mode = await getMode();
  const { thermostat } = endpoint.state;

  return Response.json({
    mode,
    temperature,
    thermostat,
  });
});
