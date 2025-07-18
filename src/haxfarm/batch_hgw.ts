import { NS, Server } from "@ns";
import { TARGET_HACK } from "/haxlib/constants";
import { assert, freeRam, getBatchStats } from "/haxlib/utils";


export async function main(ns: NS): Promise<void> {
  assert(!!ns.args[0], "target required");
  // assert(!!ns.args[1], "action required");
  const target = ns.args[0] as string;

  // const flags = ns.flags([["t", 0]]) as { t: number };

  // const farmNames = ns.getPurchasedServers();
  const farmNames = ["home"];
  const {
    batchRamUse,
    hackThreads,
    hackRamUse,
    hackDiffIncr,
    growThreads,
    growRamUse,
    growDiffIncr,
    weakenHackThreads,
    weakenGrowThreads,
    weakenHackRamUse,
    weakenGrowRamUse,
    hackTime,
    growTime,
    weakenTime,
  } = getBatchStats(ns, target, TARGET_HACK);

  ns.tprintf(
    "%s",
    JSON.stringify(
      {
        batchRamUse,
        hack: {
          hackThreads,
          hackRamUse,
          hackDiffIncr,
        },
        grow: {
          growThreads,
          growRamUse,
          growDiffIncr,
        },
        weaken: {
          weakenHackThreads,
          weakenGrowThreads,
          weakenHackRamUse,
          weakenGrowRamUse,
        },
        timing: {
          hackTime,
          growTime,
          weakenTime,
        },
      },
      null,
      2
    )
  );
  // for (const f of farmNames) {
  //   const free = freeRam(ns, f);
  //   if (batchRamUse > free) {
  //     ns.tprintf("Not enough ram: %s", f);
  //     break;
  //   }

  //   const endTime = Math.max(hackTime, growTime, weakenTime);
  //   const hackStartTime = endTime - hackTime;
  //   const growStartTime = endTime - growTime;
  //   const weakenStartTime = endTime - weakenTime;

  // }
}