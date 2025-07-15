import { NS, Server } from "@ns";
import {
  HGW,
  HAXFARM_LIST,
  HAXLIB_LIST,
  HAX_LIST,
  getScrHax,
  getScrHaxFarm,
  getScrHaxLib,
} from "./constants";

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

export async function waitForScript(ns: NS, scriptOrPID: (string | number)[], hosts: string[]) {
  while(hosts.map((h,idx) => ns.isRunning(scriptOrPID[idx], h)).includes(true)) {
    ns.tprintf("Waiting")
    await ns.asleep(5000);
  }
  ns.tprintf("Stopped waiting %s", scriptOrPID)
}