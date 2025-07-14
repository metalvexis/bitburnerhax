import { NS, Server } from "@ns";

const PATH = "hax";
const SCRIPTS = new Map([
  ["crack", "crack.js"],
  ["hgw", "hgw.js"],
  ["scout", "scout.js"],
]);
const SCRIPT_PATH = new Map<string, string>(
  Array.from(SCRIPTS).map((scr): [string, string] => {
    return [scr[0], [PATH, scr[1]].join("/")];
  })
);

export async function main(ns: NS): Promise<void> {
  const WHITELIST_SERVERS = ["home", "darkweb"].concat(
    ns.getPurchasedServers()
  );

  ns.tprintf("%s", `Autocracking from ${ns.args[0] ?? "root"}`);
  let knownServers: Server[] = [];

  if (!ns.args[0]) {
    knownServers = knownServers.concat(
      dfsScan(ns, [...WHITELIST_SERVERS], undefined, 0)
    );
  } else {
    knownServers = [ns.getServer(ns.args[0] as string)];
  }

  knownServers.map(async (s) => {
    ns.tprintf("Cracking %s", s.hostname);
    const PID = await ns.run(SCRIPT_PATH.get("crack"), 1, s.hostname);
    await ns.asleep(1000)
    if (PID <= 0) {
      ns.tprintf("Crack script failed on %s", s.hostname);
    }
  });

  ns.tprintf("%s", `Autocracking Done`);
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

  return list;
}
