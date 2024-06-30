import { Thermostat } from "@project-chip/matter.js/cluster";
import { serve } from "@hono/node-server";

import { app } from "./ui";
import { node, endpoint } from "./matter";
import { ensureState, getMode, getTemperature } from "./physical";

await node.bringOnline();

async function loop() {
  const mode = await getMode();
  const temperature = await getTemperature();

  if (endpoint.state.thermostat.systemMode === Thermostat.SystemMode.Off) {
    await ensureState("off");
    return;
  }

  await endpoint.set({
    thermostat: {
      localTemperature: temperature,
      systemMode:
        mode === "cool"
          ? Thermostat.SystemMode.Cool
          : Thermostat.SystemMode.Heat,
      controlSequenceOfOperation:
        mode === "cool"
          ? Thermostat.ControlSequenceOfOperation.CoolingOnly
          : Thermostat.ControlSequenceOfOperation.HeatingOnly,
    },
  });

  if (mode === "cool") {
    const setpoint = endpoint.state.thermostat.occupiedCoolingSetpoint;
    await ensureState(temperature > setpoint ? "on" : "off");
  } else {
    const setpoint = endpoint.state.thermostat.occupiedHeatingSetpoint;
    await ensureState(temperature < setpoint ? "on" : "off");
  }
}

// Run logic in loop
setInterval(loop, 10 * 1000);

// Start ui server
serve(app);
