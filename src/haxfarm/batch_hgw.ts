import { NS, Server } from "@ns";
import { assert, roundUp } from "/haxlib/utils";
import { HAXFARM_RAM } from "/haxlib/constants";

const TARGET_HACK = 0.1; // x% of max money

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
  //   ns.exec()
  // }
}

type BatchStats = {
  batchRamUse: number;
  hackThreads: number;
  hackRamUse: number;
  hackDiffIncr: number;
  growThreads: number;
  growRamUse: number;
  growDiffIncr: number;
  weakenHackThreads: number;
  weakenGrowThreads: number;
  hackTime: number;
  growTime: number;
  weakenTime: number;

  weakenHackRamUse: number;
  weakenGrowRamUse: number;
};

function getBatchStats(
  ns: NS,
  target: string,
  hackPercent: number
): BatchStats {
  const hackThreads = roundUp(hackPercent / ns.hackAnalyze(target));
  const hackRamUse = roundUp(hackThreads * HAXFARM_RAM.remote_hack);
  const hackDiffIncr = ns.hackAnalyzeSecurity(hackThreads, target);

  const growThreads = roundUp(ns.growthAnalyze(target, hackPercent + 1));
  const growRamUse = roundUp(growThreads * HAXFARM_RAM.remote_grow);
  const growDiffIncr = ns.growthAnalyzeSecurity(growThreads, target);

  const weakenHackThreads = roundUp(hackDiffIncr / ns.weakenAnalyze(1));
  const weakenHackRamUse = roundUp(
    weakenHackThreads * HAXFARM_RAM.remote_weaken
  );
  const weakenGrowThreads = roundUp(growDiffIncr / ns.weakenAnalyze(1));
  const weakenGrowRamUse = roundUp(
    weakenGrowThreads * HAXFARM_RAM.remote_weaken
  );

  const hackTime = ns.getHackTime(target);
  const growTime = ns.getGrowTime(target);
  const weakenTime = ns.getWeakenTime(target);
  const batchRamUse = roundUp(
    hackRamUse + growRamUse + weakenGrowRamUse + weakenHackRamUse
  );

  return {
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
  };
}
