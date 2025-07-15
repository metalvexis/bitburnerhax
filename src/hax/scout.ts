import { NS, Server } from "@ns";
import { dfsScan } from "/haxlib/utils";

const HAXSCRIPTS = ["hax/hgw", "hax/crack", "hax/scout"];

export async function main(ns: NS) {
  ns.clearLog();
  const targetHost: string | null = (ns.args[0] as string) || null;
  ns.tprintf("%s", `Scouting: ${targetHost}`);

  if (targetHost) {
    const s = await scout(ns, targetHost);
    ns.tprintf("%s", JSON.stringify(s, null, " "));
    return;
  }

  const WHITELIST_SERVERS = ["home", "darkweb"].concat(
    ns.getPurchasedServers()
  );
  const servers = dfsScan(ns, WHITELIST_SERVERS);
  const scouted: string[] = [];
  for (const s of servers) {
    const meta = await scout(ns, s.hostname);
    scouted.push(JSON.stringify(meta));
  }

  ns.tprintf("[%s]", scouted.join(","));
}

async function scout(ns: NS, target: string) {
  const targetServer = ns.getServer(target);
  const player = ns.getPlayer();
  const isBetterHaxSkill =
    player.skills.hacking >= (targetServer.requiredHackingSkill ?? 0);
  const isPortsOpened =
    targetServer.openPortCount >= targetServer.numOpenPortsRequired;
  const isHaxable = isBetterHaxSkill || isPortsOpened;
  const isMissingHax = HAXSCRIPTS.some(
    (scr) => !ns.fileExists(`${scr}.js`, target)
  );

  const meta = {
    isHaxable,
    isMissingHax,
    ...targetServer,
  };

  return meta;
}
