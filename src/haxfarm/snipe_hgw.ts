import { NS } from "@ns";
import { HGW } from "/haxlib/constants";
import { assert } from "/haxlib/utils";

export async function main(ns: NS): Promise<void> {
  assert(!!ns.args[0], "action required");
  assert(!!ns.args[1], "target required");

  const action = ns.args[0] as HGW;
  const target = ns.args[1] as string;
  const isHack = [HGW.hack].includes(action);
  const isGrow = [HGW.grow].includes(action);
  const isWeaken = [HGW.weaken].includes(action);
  const isAll = !isHack && !isGrow && !isWeaken;

  const flags = ns.flags([["t", 0]]) as { t: number };
  const threads = flags.t;

  if (isHack) {
    for (;;) {
      const victim = ns.getServer(target);
      await ns.hack(victim.hostname, { threads, stock: true });
      await ns.asleep(100)
    }
  }
  
  if (isGrow) {
    for (;;) {
      const victim = ns.getServer(target);
      await ns.grow(victim.hostname, { threads, stock: true });
      await ns.asleep(100)
    }
  }

  if (isWeaken) {
    for (;;) {
      const victim = ns.getServer(target);
      await ns.weaken(victim.hostname, { threads, stock: true });
      await ns.asleep(100)
    }
  }

  if (isAll) await autoHgw(ns, target, threads);
}

async function autoHgw(ns: NS, target: string, threads: number) {
  for (;;) {
    const victim = ns.getServer(target);
    if (victim.hackDifficulty >= victim.minDifficulty + 5) {
      await ns.weaken(victim.hostname, { threads, stock: true });
      continue;
    }

    if (victim.moneyAvailable < victim.moneyMax * 0.9) {
      await ns.grow(victim.hostname, { threads, stock: true });
      continue;
    }

    await ns.hack(victim.hostname, { threads, stock: true });
    await ns.asleep(100);
  }
}
