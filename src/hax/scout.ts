import { NS, Server } from "@ns";
import { TARGET_HACK } from "/haxlib/constants";
import { dfsScan, getBatchStats, BatchStats, getHgwRatio } from "/haxlib/utils";

const HAXSCRIPTS = ["hax/hgw", "hax/crack", "hax/scout"];

type PlayerHax = {
  isHaxable: boolean,
  isHaxUploaded: boolean
};

export type ScoutMeta = Server & BatchStats & PlayerHax;

export function main(ns: NS) {
  ns.clearLog();
  const targetHost: string | null = (ns.args[0] as string) || null;
  ns.tprintf("%s", `Scouting: ${targetHost}`);

  if (targetHost) {
    const s = scout(ns, targetHost);
    ns.tprintf("%s", JSON.stringify(s, null, " "));
    return;
  }

  ns.tprintf("[%s]", scoutAll(ns).map((s) => JSON.stringify(s)).join(","));
}

export function scoutAll(ns: NS): ScoutMeta[] {
  const WHITELIST_SERVERS = ["home", "darkweb"].concat(
    ns.getPurchasedServers()
  );
  const servers = dfsScan(ns, WHITELIST_SERVERS);
  const scouted: ScoutMeta[] = [];
  for (const s of servers) {
    const meta = scout(ns, s.hostname);
    scouted.push(meta);
  }
  return scouted
}

export function scout(ns: NS, target: string): ScoutMeta {
  const targetServer = ns.getServer(target);
  const player = ns.getPlayer();
  const isBetterHaxSkill =
    player.skills.hacking >= (targetServer.requiredHackingSkill ?? 0);
  const isPortsOpened =
    targetServer.openPortCount >= targetServer.numOpenPortsRequired;
  const isHaxable = isBetterHaxSkill || isPortsOpened;
  const isHaxUploaded = !HAXSCRIPTS.some(
    (scr) => !ns.fileExists(`${scr}.js`, target)
  );
  const batchStats = getBatchStats(ns, target, TARGET_HACK)

  const meta = {
    isHaxable,
    isHaxUploaded,
    ...targetServer,
    ...batchStats
  };  
  // const a = getHgwRatio(512, 1, 2, 3);

  // ns.tprint(JSON.stringify(a))
  
  // const b = getHgwRatio(512, 1, 3, 7);

  // ns.tprint(JSON.stringify(b))
  
  // const c = getHgwRatio(512, 2, 0, 4);

  // ns.tprint(JSON.stringify(c))
  return meta;
}
