import { NS } from "@ns";
import {
  getScrHax,
  getScrHaxFarm,
  HAXFARM_LIST,
  HAX_LIST,
} from "/haxlib/constants";
import { getMaxScriptThreads } from "/haxlib/utils";

export async function main(ns: NS): Promise<void> {
  const target = ns.args[0] as string;
  const task = ns.args[1] as string;
  const victim = ns.getServer(target);
  await ns.run(getScrHax(HAX_LIST.crack), 1, target);
  await ns.asleep(1000);

  const farms = ns.getPurchasedServers();

  if (task === "kill") {
    for (let f = 0; f < farms.length; f++) {
      ns.killall(farms[f]);
      await ns.asleep(500);
    }
    return;
  }

  if (task === "weaken") {
    for (let f = 0; f < farms.length; f++) {
      const farmName = farms[f];
      ns.killall(farmName);
      const farm = ns.getServer(farmName);
      const maxThreads = getMaxScriptThreads(
        farm.maxRam - farm.ramUsed,
        ns.getScriptRam(getScrHaxFarm(HAXFARM_LIST.remote_weaken))
      );

      const PID = ns.exec(
        getScrHaxFarm(HAXFARM_LIST.remote_weaken),
        farmName,
        maxThreads,
        victim.hostname,
        maxThreads
      );

      await ns.asleep(500);

      if (!PID) {
        ns.tprintf("remote weaken failed on %s", farmName);
      }
    }
    return;
  }

  if (task === "grow") {
    for (let f = 0; f < farms.length; f++) {
      const farmName = farms[f];
      ns.killall(farmName);
      const farm = ns.getServer(farmName);
      const maxThreads = getMaxScriptThreads(
        farm.maxRam - farm.ramUsed,
        ns.getScriptRam(getScrHaxFarm(HAXFARM_LIST.remote_grow))
      );

      const PID = ns.exec(
        getScrHaxFarm(HAXFARM_LIST.remote_grow),
        farmName,
        maxThreads,
        victim.hostname,
        maxThreads
      );

      await ns.asleep(500);

      if (!PID) {
        ns.tprintf("remote grow failed on %s", farmName);
      }
    }
    return;
  }

  if (task === "hack") {
    for (let f = 0; f < farms.length; f++) {
      const farmName = farms[f];
      ns.killall(farmName);
      const farm = ns.getServer(farmName);
      const maxThreads = getMaxScriptThreads(
        farm.maxRam - farm.ramUsed,
        ns.getScriptRam(getScrHaxFarm(HAXFARM_LIST.remote_hack))
      );

      const PID = ns.exec(
        getScrHaxFarm(HAXFARM_LIST.remote_hack),
        farmName,
        maxThreads,
        victim.hostname,
        maxThreads
      );

      await ns.asleep(500);

      if (!PID) {
        ns.tprintf("remote hack failed on %s", farmName);
      }
    }
    return;
  }
}
