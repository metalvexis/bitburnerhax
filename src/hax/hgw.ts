import { NS, Server } from "@ns";

export async function main(ns: NS): Promise<void> {
  await hgw(ns);
}
export async function hgw(ns: NS): Promise<void> {
  const server: Server = ns.getServer((ns.args[0] as string) ?? undefined);

  const player = ns.getPlayer();
  if (server && server.hackDifficulty + 5 >= server.minDifficulty) {
    await ns.weaken(server.hostname);
    ns.tprintf('%s', `Weaken ${server.hostname}`)
  }

  if (server && server.moneyAvailable > server.moneyMax * 0.25) {
    await ns.grow(server.hostname);
    ns.tprintf('%s', `Grow ${server.hostname}`)
  }

  if (server && player.skills.hacking >= server.requiredHackingSkill) {
    await ns.hack(server.hostname);
    ns.tprintf('%s', `Hack ${server.hostname}`)
  }
}
