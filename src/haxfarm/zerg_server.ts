import { NS } from "@ns";
import {
  getScrHax,
  getScrHaxFarm,
  HAXFARM_LIST,
  HAX_LIST,
} from "/haxlib/constants";
import { getMaxScriptThreads, waitForScript } from "/haxlib/utils";

export async function main(ns: NS): Promise<void> {
  const farms = ns.getPurchasedServers();

  if (ns.args[0] === "kill") {
    for (let f = 0; f < farms.length; f++) {
      ns.killall(farms[f]);
      await ns.asleep(500);
    }
    return;
  }

  const target = ns.args[0] as string;
  const task = ns.args[1] as string;
  const victim = ns.getServer(target);
  await ns.run(getScrHax(HAX_LIST.crack), 1, victim.hostname);
  await ns.asleep(1000);

  if (task === "weaken") {
    await zerg(ns, getScrHaxFarm(HAXFARM_LIST.remote_weaken), farms, victim.hostname)
    return;
  }

  if (task === "grow") {
    await zerg(ns, getScrHaxFarm(HAXFARM_LIST.remote_grow), farms, victim.hostname)
    return;
  }

  if (task === "hack") {
    await zerg(ns, getScrHaxFarm(HAXFARM_LIST.remote_hack), farms, victim.hostname)
    return;
  }
}

async function zerg(ns: NS, script: string, farms: string[], victim: string) {
  for (let f = 0; f < farms.length; f++) {
    const farmName = farms[f];
    const farm = ns.getServer(farmName);
    const maxThreads = getMaxScriptThreads(
      farm.maxRam - farm.ramUsed,
      ns.getScriptRam(script)
    );

    const PID = ns.exec(script, farmName, maxThreads, victim, maxThreads);

    if (!PID) {
      ns.tprintf("remote hack failed on %s", farmName);
      break;
    }

    await waitForScript(ns, PID, farmName);
  }
}
