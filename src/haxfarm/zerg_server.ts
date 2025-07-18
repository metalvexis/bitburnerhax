import { NS } from "@ns";
import {
  getScrHax,
  getScrHaxFarm,
  HAXFARM_LIST,
  HAX_LIST,
} from "/haxlib/constants";
import {
  getMaxScriptThreads,
  waitForScript,
  getHgwRatio,
  freeRam,
} from "/haxlib/utils";

export async function main(ns: NS): Promise<void> {
  const farms = ns.getPurchasedServers();

  if (ns.args[0] === "kill") {
    for (const f of farms) {
      ns.killall(f);
      await ns.asleep(100);
    }
    return;
  }

  const target = ns.args[0] as string;
  const ratio = (ns.args[1] as string).split(":").map((s) => parseInt(s));

  for (;;) {
    await zerg(ns, ratio, farms, target);
  }
}

async function zerg(
  ns: NS,
  ratio: number[], // { hack: number; grow: number; weaken: number },
  farms: string[],
  victim: string
) {
  const action: Record<string, string> = {
    hack: getScrHaxFarm(HAXFARM_LIST.remote_hack),
    grow: getScrHaxFarm(HAXFARM_LIST.remote_grow),
    weaken: getScrHaxFarm(HAXFARM_LIST.remote_weaken),
  };
  const PIDS = new Map<string, number[]>();

  for (const farmName of farms) {
    const free = freeRam(ns, farmName);
    const ration = getHgwRatio(free, ratio[0], ratio[1], ratio[2]);

    for (const k of Object.keys(action)) {
      if (!ration[k]) continue;
      try {
        const hackThreads = getMaxScriptThreads(
          ration[k],
          ns.getScriptRam(action[k])
        );
        const PID = ns.exec(
          action[k],
          farmName,
          { threads: hackThreads },
          victim,
          hackThreads
        );
        if (!PID) {
          ns.tprintf("%s did not exec on %s", action[k], farmName);
          continue;
        }

        if (PIDS.has(farmName)) {
          PIDS.get(farmName).push(PID)
        } else {
          PIDS.set(farmName, [PID])
        }
      } catch (error) {
        ns.tprintf("Skipping %s", farmName);
      }
    }
  }

  if (!PIDS.size) return;

  await waitForScript(ns, PIDS);
}
