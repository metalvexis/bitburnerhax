import { NS, Server } from "@ns";

const PATH = "/hax";
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
  const WHITELIST_SERVERS = ["home", "home2", "home3", "darkweb"];
  const TARGET_SERVERS = ["n00dles"];

  ns.tprintf("%s", `Deploying to ${ns.args[0] ?? "root"}`);
  const knownServers = dfsScan(ns, [...WHITELIST_SERVERS], undefined, 0);
  ns.tprintf("Known: %s", knownServers.map((s) => s.hostname).join(", "));

  knownServers.map(async (s) => {
    // if (!TARGET_SERVERS.includes(s.hostname)) return;

    if (ns.getPlayer().skills.hacking < s.requiredHackingSkill) {
      ns.tprintf("%s %s", "Skipping", s.hostname);
      return;
    }

    ns.tprintf("%s %s", "Cracking", s.hostname);
    await ns.run(PATH + SCRIPTS.get("crack"), 1);

    Array.from(SCRIPTS).map((scr: [string, string]) => {
      const script = [PATH, scr[1]].join("/");
      ns.tprintf("Copying %s to %s", script, s.hostname);
      ns.scp(script, s.hostname);
    });

    ns.tprintf(
      "Running %s (%s GB) on %s (%s GB)",
      "HGW: " + SCRIPT_PATH.get("hgw"),
      ns.getScriptRam(SCRIPT_PATH.get("hgw") as string),
      s.hostname,
      s.maxRam-s.ramUsed,
    );

    const PID = await ns.exec(
      SCRIPT_PATH.get("hgw"),
      s.hostname,
      1
    );

    if (PID === 0) ns.tprintf("HGW FAILED");
  });
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
