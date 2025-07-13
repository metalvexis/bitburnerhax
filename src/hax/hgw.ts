import { NS, Server } from "@ns";

export async function main(ns: NS): Promise<void> {
  for (;;) {
    // ns.tprint(`Triggering hax`)
    try {
      await hgw(ns, ns.args[0]);
    } catch (error) {
      break;
    }
    await ns.asleep(50);
  }
}
export async function hgw(ns: NS, targetHost: string): Promise<void> {
  const server: Server = ns.getServer(targetHost);

  if (server && server.hackDifficulty >= server.minDifficulty + 5) {
    await ns.weaken(server.hostname);
    return;
    // ns.tprintf('%s', `Weaken ${server.hostname}`)
  }

  if (server && server.moneyAvailable > server.moneyMax * 0.25) {
    await ns.grow(server.hostname);
    return;
    // ns.tprintf('%s', `Grow ${server.hostname}`)
  }

  try {
    await ns.hack(server.hostname);
  } catch (error) {
    ns.tprintf(
      "HGW deploy failed on %s: %s",
      server.hostname,
      JSON.stringify(error, null, "")
    );
    throw error;
  }
}
