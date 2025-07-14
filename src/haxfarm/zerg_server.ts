import { NS, Server } from "@ns";

const PATH = "/haxfarm";
const SCRIPTS = new Map([
  ["rename_farm", "rename_farm.js"],
  ["share_farm", "share_farm.js"],
  ["attack_server", "attack_server.js"],
  ["farm", "farm.js"],
]);

const SCRIPT_PATH = new Map<string, string>(
  Array.from(SCRIPTS).map((scr): [string, string] => {
    return [scr[0], [PATH, scr[1]].join("/")];
  })
);

export async function main(ns: NS): Promise<void> {
  const target = ns.args[0] as string;
  const task = ns.args[1] as string;
  const farms = ["home", ...ns.getPurchasedServers()];
  ns.run(SCRIPT_PATH.get("crack") as string, 1, target);
  await ns.asleep(1000);

  if (task === "weaken") {
    for (;;) {
      const server = ns.getServer(target);
      const currHackDiff = server.hackDifficulty;

      const res = await remotehgw(ns, target, task);

      if (!res) break;

      const newHackDiff = currHackDiff - res;

      if (newHackDiff <= server.minDifficulty + 2) {
        ns.tprintf("Stop attack to %s", target);
        break;
      }

      await ns.asleep(50);
    }
  }
}

function remotehgw(ns, s, t) {}