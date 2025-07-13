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
  const WHITELIST_SERVERS = ["home", "darkweb"].concat(ns.getPurchasedServers());

  ns.tprintf("%s", `Deploying to ${ns.args[0] ?? "root"}`);
  let knownServers: Server[] = [];

  if (!ns.args[0]) {
    knownServers = knownServers.concat(
      dfsScan(ns, [...WHITELIST_SERVERS], undefined, 0)
    );
    ns.tprintf("Known: %s", knownServers.map((s) => s.hostname).join(", "));
  } else {
    knownServers = [ns.getServer(ns.args[0] as string)];
  }

  knownServers.map(async (s) => {
    if (!s.hasAdminRights) {
      await ns.run(SCRIPT_PATH.get("crack"), 1, s.hostname);
    }

    const isBetterHaxSkill = ns.getPlayer().skills.hacking >= s.requiredHackingSkill;
    const isPortsOpened = s.openPortCount >= s.numOpenPortsRequired;

    const isHaxable = isBetterHaxSkill || isPortsOpened;
    
    if (!isHaxable) {
      ns.tprintf("%s %s", "Cannot hack ", s.hostname);
      return;
    }

    // ns.tprintf("Copying hax to %s", s.hostname);
    Array.from(SCRIPTS).map((scr: [string, string]) => {
      const script = [PATH, scr[1]].join("/");
      ns.scp(script, s.hostname);
    });


    const scriptHgw = SCRIPT_PATH.get("hgw") as string;
    const freeRam = s.maxRam - s.ramUsed;
    const hgwRam = ns.getScriptRam(scriptHgw);
    const maxHgwThreads = getMaxUsableRam(freeRam, hgwRam);
    const hgwIsRunning = ns.scriptRunning(scriptHgw, s.hostname)


    if (!hgwIsRunning && hgwRam > freeRam) {
      ns.tprintf("Not enough RAM on %s %sThreads %sGb (%sThreads %sGB required)", s.hostname, s.cpuCores, freeRam, maxHgwThreads, hgwRam)
      return;
    }
  
    // ns.tprintf(
    //   "Running %s (%s GB) on %s (%s GB)",
    //   "HGW: " + scriptHgw,
    //   ns.getScriptRam(scriptHgw),
    //   s.hostname,
    //   s.maxRam - s.ramUsed
    // );

    if (hgwIsRunning) ns.killall(s.hostname, true);

    const PID = await ns.exec(
        scriptHgw,
        s.hostname,
        getMaxUsableRam(s.maxRam, hgwRam),
        s.hostname
      );

    if (!PID) {
      ns.tprintf("HGW Deploy failed: %s", s.hostname);
      return;
    }

    ns.tprintf("Haxxed: %s", s.hostname);
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

function getMaxUsableRam(free: number, use = 1) {
  return parseInt(`${free/use}`)
}