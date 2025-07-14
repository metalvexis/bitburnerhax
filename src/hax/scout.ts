import { NS, Server } from "@ns";

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
  servers.map(async (s) => {
    ns.tprintf(JSON.stringify(await scout(ns, s.hostname)));
  });
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

function dfsScan(
  ns: NS,
  visited: string[],
  root?: string,
  currentDepth = 1
): Server[] {
  const unvisited = ns.scan(root).filter((s) => !visited.includes(s));
  let list: Server[] = [];

  for (const s of unvisited) {
    visited.push(s);

    list.push(ns.getServer(s));

    list = list.concat(dfsScan(ns, visited, s, currentDepth + 1));
  }

  // ns.tprintf("%s", root?.padStart(currentDepth, "-"));
  return list;
}
