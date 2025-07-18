import { NS, Server } from "@ns";
import {
  HGW,
  HAXFARM_LIST,
  HAXLIB_LIST,
  HAX_LIST,
  HAXFARM_RAM,
  getScrHax,
  getScrHaxFarm,
  getScrHaxLib,
  TARGET_HACK,
} from "./constants";

export function assert(cond: boolean, errMsg: string) {
  if (!cond) throw Error(errMsg);
}

export function isScriptsUploaded(ns: NS, host: string): boolean {
  const haxScripts = Array.from(Object.values(HAX_LIST));
  const isHaxUploaded = !haxScripts.some(
    (s) => !ns.fileExists(getScrHax(s), host)
  );

  const haxfarmScripts = Array.from(Object.values(HAXFARM_LIST));
  const isHaxfarmUploaded = !haxfarmScripts.some(
    (s) => !ns.fileExists(getScrHaxFarm(s), host)
  );

  const haxlibScripts = Array.from(Object.values(HAXLIB_LIST));
  const isHaxlibUploaded = !haxlibScripts.some(
    (s) => !ns.fileExists(getScrHaxLib(s), host)
  );

  return isHaxUploaded && isHaxfarmUploaded && isHaxlibUploaded;
}

export function uploadScripts(ns: NS, host: string): boolean {
  return ![
    ...Array.from(Object.values(HAX_LIST)).map((k) =>
      ns.scp(getScrHax(HAX_LIST[k]), host)
    ),

    ...Array.from(Object.values(HAXFARM_LIST)).map((k) =>
      ns.scp(getScrHaxFarm(HAXFARM_LIST[k]), host)
    ),

    ...Array.from(Object.values(HAXLIB_LIST)).map((k) =>
      ns.scp(getScrHaxLib(HAXLIB_LIST[k]), host)
    ),
  ].some((b) => !b);
}

export function getMaxScriptThreads(freeRam = 1, ramUse = 1) {
  return Math.floor(freeRam / ramUse);
}

export function dfsScan(
  ns: NS,
  exclude: string[],
  root?: string,
  currentDepth = 1
): Server[] {
  const unvisited = ns.scan(root).filter((s) => !exclude.includes(s));
  let list: Server[] = [];

  for (const s of unvisited) {
    exclude.push(s);

    list.push(ns.getServer(s));

    list = list.concat(dfsScan(ns, exclude, s, currentDepth + 1));
  }

  // ns.tprintf("%s", root?.padStart(currentDepth, "-"));
  return list;
}

// export async function waitForScript(
//   ns: NS,
//   scriptOrPID: (string | number)[],
//   hosts: string[]
// ) {
//   while (
//     hosts.map((h, idx) => ns.isRunning(scriptOrPID[idx], h)).includes(true)
//   ) {
//     await ns.asleep(5000);
//   }
//   ns.tprintf("Stopped waiting %s", scriptOrPID);
// }
export async function waitForScript(ns: NS, hostPidMap: Map<string, number[]>) {
  let isRunning = true;
  while (isRunning) {
    isRunning = hostPidMap.keys().some((k) => {
      const PIDs = hostPidMap.get(k);
      return PIDs.some((p) => ns.isRunning(p, k));
    });
    await ns.asleep(5000);
  }
}

export function roundUp(n: number) {
  return Math.max(1, Math.ceil(n));
}

export function getHgwRatio(ram: number, h: number, g: number, w: number) {
  const total = h + g + w;
  const ratioH = Math.floor(ram * (h / total));
  const ratioG = Math.floor(ram * (g / total));
  const ratioW = Math.floor(ram * (w / total));
  return { hack: ratioH, grow: ratioG, weaken: ratioW };
}

export function freeRam(ns: NS, host: string) {
  const s = ns.getServer(host);
  return s.maxRam - s.ramUsed;
}

export type BatchStats = {
  batchRamUse: number;
  hackThreads: number;
  hackRamUse: number;
  hackDiffIncr: number;
  growThreads: number;
  growRamUse: number;
  growDiffIncr: number;
  weakenHackThreads: number;
  weakenGrowThreads: number;
  hackTime: number;
  growTime: number;
  weakenTime: number;

  weakenHackRamUse: number;
  weakenGrowRamUse: number;
};

export function getBatchStats(
  ns: NS,
  target: string,
  hackPercent: number
): BatchStats {
  const hackThreads = roundUp(hackPercent / ns.hackAnalyze(target));
  const hackRamUse = roundUp(hackThreads * HAXFARM_RAM.remote_hack);
  const hackDiffIncr = ns.hackAnalyzeSecurity(hackThreads, target);

  const growThreads = roundUp(ns.growthAnalyze(target, hackPercent + 1));
  const growRamUse = roundUp(growThreads * HAXFARM_RAM.remote_grow);
  const growDiffIncr = ns.growthAnalyzeSecurity(growThreads, target);

  const weakenHackThreads = roundUp(hackDiffIncr / ns.weakenAnalyze(1));
  const weakenHackRamUse = roundUp(
    weakenHackThreads * HAXFARM_RAM.remote_weaken
  );
  const weakenGrowThreads = roundUp(growDiffIncr / ns.weakenAnalyze(1));
  const weakenGrowRamUse = roundUp(
    weakenGrowThreads * HAXFARM_RAM.remote_weaken
  );

  const hackTime = ns.getHackTime(target);
  const growTime = ns.getGrowTime(target);
  const weakenTime = ns.getWeakenTime(target);
  const batchRamUse = roundUp(
    hackRamUse + growRamUse + weakenGrowRamUse + weakenHackRamUse
  );

  return {
    batchRamUse,
    hackThreads,
    hackRamUse,
    hackDiffIncr,
    growThreads,
    growRamUse,
    growDiffIncr,
    weakenHackThreads,
    weakenGrowThreads,
    weakenHackRamUse,
    weakenGrowRamUse,
    hackTime,
    growTime,
    weakenTime,
  };
}
