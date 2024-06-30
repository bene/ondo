# ondo

Given my privileged situation of living in a flat equipped with [district cooling](https://www.wienenergie.at/ueber-uns/unternehmen/energie-klimaschutz/energieerzeugung/fernkaelte/), the desire for a Matter thermostat that supports [change over systems](https://www.wienenergie.at/faqs/was-ist-ein-change-over-system/) arose.

## Requirements
- Raspberry Pi or similar
- DHT22 or similar
- Relay module
- Optocoupler module

## Usage
Set the correct GPIO pins in `src/config.ts` and run the app. Use [pm2](https://pm2.keymetrics.io/) or Docker to run the app in the background. A matter setup code will be printed to the console.
