import { NS } from "@ns";
import {
  HAX_LIST,
  HAXFARM_LIST,
  getScrHax,
  getScrHaxFarm,
} from "/haxlib/constants";
import { getMaxScriptThreads } from "/haxlib/utils";

enum HGW {
  hack = "hack",
  grow = "grow",
  weaken = "weaken",
}

export async function main(ns: NS): Promise<void> {
  const target = ns.args[0] as string;
  const freeRam = ns.getServerMaxRam("home") - ns.getServerUsedRam("home");
  // await ns.run(getScrHax(HAX_LIST.crack), 1, target);
  // await ns.asleep(500);

  const victim = ns.getServer(target);
  const flags = ns.flags([["t", 0]]) as { t: number };
  const threads = flags.t;

  for (;;) {
    if (victim.hackDifficulty >= victim.minDifficulty + 5) {
      // ns.tprintf("Weaken %s", target)

      await ns.weaken(victim.hostname, { threads, stock: true });

      await ns.asleep(500);
      continue;
    }

    if (victim.moneyAvailable < victim.moneyMax * 0.9) {
      // ns.tprintf("Grow %s", target)

      await ns.grow(victim.hostname, { threads, stock: true });

      await ns.asleep(500);
      continue;
    }

    await ns.hack(victim.hostname, { threads, stock: true });
    await ns.asleep(500);
  }
}
