import { NS, Server } from "@ns";
import { dfsScan } from "/haxlib/utils";

const HAXSCRIPTS = ["hax/hgw", "hax/crack", "hax/scout"];

export type ScoutMeta = Server & {
  isHaxable: boolean,
  isHaxUploaded: boolean
}

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

  const meta = {
    isHaxable,
    isHaxUploaded,
    ...targetServer,
  };

  return meta;
}
