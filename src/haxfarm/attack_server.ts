import { NS, Server } from "@ns";

const PATH = "/hax";
const SCRIPTS = new Map([
  ["crack", "crack.js"],
  ["hgw", "hgw.js"],
  ["scout", "scout.js"],
  ["remotehgw", "remotehgw.js"],
]);

const SCRIPT_PATH = new Map<string, string>(
  Array.from(SCRIPTS).map((scr): [string, string] => {
    return [scr[0], [PATH, scr[1]].join("/")];
  })
);

export async function main(ns: NS): Promise<void> {
  const target = ns.args[0] as string;
  const task = ns.args[1] as string;
  await ns.run(SCRIPT_PATH.get("crack"), 1, target);
  await ns.asleep(1000)
  
  if (task === "weaken") {
    for (;;) {
      const server = ns.getServer(target);
      const currHackDiff = server.hackDifficulty;

      const res = await remotehgw(ns, target, task)

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

async function remotehgw(ns: NS, target: string, task: string) {
  switch (task) {
    case "weaken":
      return await ns.weaken(target);
    case "grow":
      return await ns.grow(target);
    case "hack":
      return await ns.hack(target);
  }
  return null;
}
