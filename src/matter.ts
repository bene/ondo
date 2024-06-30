import "@project-chip/matter-node.js";

import {
  ThermostatDevice,
  ThermostatRequirements,
} from "@project-chip/matter.js/devices/ThermostatDevice";
import { Thermostat } from "@project-chip/matter.js/cluster";
import { Level, Logger } from "@project-chip/matter.js/log";
import { ServerNode } from "@project-chip/matter.js/node";

import { getMode, getTemperature } from "./physical";

Logger.level = Level.INFO;

export const node = await ServerNode.create({
  productDescription: {
    name: "Ondo Change Over",
    deviceType: ThermostatDevice.deviceType,
  },
  basicInformation: {
    vendorName: "SolidLabs",
    productName: "Ondo Change Over",
    productLabel: "Ondo Change Over",
    nodeLabel: "Ondo Change Over",
  },
});

const OndoThermostat = ThermostatDevice.with(
  ThermostatRequirements.ThermostatServer.with(
    Thermostat.Feature.Heating,
    Thermostat.Feature.Cooling,
  ),
);

const temperature = await getTemperature();
const mode = await getMode();

export const endpoint = await node.add(OndoThermostat, {
  thermostat: {
    remoteSensing: {
      localTemperature: true,
    },
    localTemperature: temperature,
    systemMode:
      mode === "cool" ? Thermostat.SystemMode.Cool : Thermostat.SystemMode.Heat,
    controlSequenceOfOperation:
      mode === "cool"
        ? Thermostat.ControlSequenceOfOperation.CoolingOnly
        : Thermostat.ControlSequenceOfOperation.HeatingOnly,
  },
});
