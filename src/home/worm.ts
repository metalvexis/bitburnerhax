import { NS, Server } from "@ns";
import { HAX_LIST, getScrHax } from "/haxlib/constants";
import { dfsScan } from "/haxlib/utils";

export async function main(ns: NS): Promise<void> {
  const WHITELIST_SERVERS = ["home", "darkweb"].concat(
    ns.getPurchasedServers()
  );

  let knownServers: Server[] = [];

  if (!ns.args[0]) {
    knownServers = knownServers.concat(
      dfsScan(ns, [...WHITELIST_SERVERS], undefined, 0)
    );

    ns.tprintf("Worming: %s", knownServers.map((victim) => victim.hostname).join(", "));
  } else {
    knownServers = [ns.getServer(ns.args[0] as string)];
  }

  for (const victim of knownServers) {
    // ns.tprintf("Cracking %s", victim.hostname);
    const PID = await ns.run(getScrHax(HAX_LIST.crack), 1, victim.hostname);
    await ns.asleep(100)
    if (PID <= 0) {
      ns.tprintf("Crack script failed on %s", victim.hostname);
    }
  }
}
