import { NS, Server } from "@ns";
import { HAX_LIST, getScrHax } from "/haxlib/constants";
import { uploadScripts, getMaxScriptThreads, dfsScan } from "/haxlib/utils";

export async function main(ns: NS): Promise<void> {
  const WHITELIST_SERVERS = ["home", "darkweb"].concat(
    ns.getPurchasedServers()
  );

  // ns.tprintf("%s", `Deploying to ${ns.args[0] ?? "root"}`);
  let knownServers: Server[] = [];

  if (!ns.args[0]) {
    knownServers = knownServers.concat(
      dfsScan(ns, [...WHITELIST_SERVERS], undefined, 0)
    );
    ns.tprintf(
      "Known: %s",
      knownServers.map((victim) => victim.hostname).join(", ")
    );
  } else {
    knownServers = [ns.getServer(ns.args[0] as string)];
  }

  for (const victim of knownServers) {

    ns.tprintf("Deploying to %s", victim.hostname);
    const isBetterHaxSkill =
      ns.getPlayer().skills.hacking >= victim.requiredHackingSkill;
    const isPortsOpened = victim.openPortCount >= victim.numOpenPortsRequired;

    const isHaxable = isBetterHaxSkill || isPortsOpened;

    if (!isHaxable) {
      ns.tprintf("Cannot hax %s", victim.hostname);
      continue;
    }

    const isUploaded = uploadScripts(ns, victim.hostname);

    if (!isUploaded) {
      ns.tprintf("Upload failed %s", victim.hostname);
      continue;
    }

    const scriptHgw = getScrHax(HAX_LIST.hgw);
    const freeRam = victim.maxRam - victim.ramUsed;
    const hgwRam = ns.getScriptRam(scriptHgw);
    const maxHgwThreads = getMaxScriptThreads(freeRam, hgwRam);
    const hgwIsRunning = ns.scriptRunning(scriptHgw, victim.hostname);

    if (!hgwIsRunning && hgwRam > freeRam) {
      ns.tprintf(
        "Not enough RAM on %s %sThreads %sGb (%sThreads %sGB required)",
        victim.hostname,
        victim.cpuCores,
        freeRam,
        maxHgwThreads,
        hgwRam
      );
      continue;
    }

    if (hgwIsRunning) {
      ns.tprintf("HGW running failed %s", victim.hostname);
      continue;
    }

    const maxInstanceByRam = getMaxScriptThreads(victim.maxRam, hgwRam);

    const PID = ns.exec(
      scriptHgw,
      victim.hostname,
      maxInstanceByRam,
      victim.hostname
    );

    if (!PID) {
      ns.tprintf(
        "HGW Deploy failed: %s (%sGB)",
        victim.hostname,
        getMaxScriptThreads(victim.maxRam, hgwRam)
      );
      continue;
    }

    ns.tprintf("Haxxed: %s", victim.hostname);

    await ns.asleep(500);
  }
}
