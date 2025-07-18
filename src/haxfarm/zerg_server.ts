import { NS } from "@ns";
import {
  getScrHax,
  getScrHaxFarm,
  HAXFARM_LIST,
  HAX_LIST,
} from "/haxlib/constants";
import { getMaxScriptThreads, waitForScript } from "/haxlib/utils";

export async function main(ns: NS): Promise<void> {
  const farms = ns.getPurchasedServers();

  if (ns.args[0] === "kill") {
    for (const f of farms) {
      ns.killall(f);
      await ns.asleep(100);
    }
    return;
  }

  const task = ns.args[0] as string;
  const target = ns.args[1] as string;
  // const ratio = (ns.args[2] as string).split(':');
  // const to

  const action: Record<string, string> = {
    hack: getScrHaxFarm(HAXFARM_LIST.remote_hack),
    grow: getScrHaxFarm(HAXFARM_LIST.remote_grow),
    weaken: getScrHaxFarm(HAXFARM_LIST.remote_weaken),
  };

  for (;;) {
    await zerg(ns, action[task], farms, target);

    ns.tprintf("Waiting for %s:  %s", task, target);
  }
}

async function zerg(ns: NS, script: string, farms: string[], victim: string) {
  const PIDS = [];
  for (const farmName of farms) {
    const farm = ns.getServer(farmName);
    const maxThreads = getMaxScriptThreads(
      farm.maxRam - farm.ramUsed,
      ns.getScriptRam(script)
    );
    ns.tprintf("%s Threads: %s", farmName, maxThreads);
    try {
      const PID = ns.exec(
        script,
        farmName,
        { threads: maxThreads },
        victim,
        maxThreads
      );
      if (!PID) {
        ns.tprintf("%s did not exec on %s", script, farmName);
        continue;
      }
      PIDS.push(PID);
    } catch (error) {
      ns.tprintf("Skipping %s", farmName)
    }
  }

  if (!PIDS.length) return;

  await waitForScript(ns, PIDS, farms);
}
