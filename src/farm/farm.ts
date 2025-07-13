import { NS } from "@ns";

const PATH = "/farm";
const SCRIPTS = new Map([
  ["rename_farm", "rename_farm.js"],
  ["share_farm", "share_farm.js"],
]);
const SCRIPT_PATH = new Map<string, string>(
  Array.from(SCRIPTS).map((scr): [string, string] => {
    return [scr[0], [PATH, scr[1]].join("/")];
  })
);

export async function main(ns: NS): Promise<void> {
  ns.tprint("Managing farms");

  const newFarmCosts = [8, 16, 32, 64, 128].map((ram) => [
    ram,
    ns.getPurchasedServerCost(ram),
  ]);

  ns.tprintf(
    "Purchaseable farms:\n %s",
    newFarmCosts.map((c) => `${c[0]}GB: ${c[1]}`).join("\n")
  );

  const farmMap = new Map<string, Record<string, any>>();
  const farms = ["home", ...ns.getPurchasedServers()];

  const totalSharableRam = farms.map((f) => {
    const farm = ns.getServer(f);
    const freeRam = farm.maxRam - farm.ramUsed;
    return freeRam;
  });

  const sharePower = ns.getSharePower();

  ns.tprintf(
    "Farm stats: %s",
    JSON.stringify({
      farms: farms.length,
      totalSharableRam,
      sharePower,
    }, null, "")
  );

  for (const f of farms) {
    Array.from(SCRIPT_PATH.keys()).forEach((k) => {
      ns.scp(SCRIPT_PATH.get(k), f);
    });

    const isShareFarm = (ns.args[0] as string) == "share";
    const isShared = ns.scriptRunning(SCRIPT_PATH.get("share_farm"), f);

    if (isShareFarm && isShared) {
      ns.scriptKill(SCRIPT_PATH.get("share_farm"), f);
    }

    if(isShareFarm) {
      ns.exec(PATH + SCRIPT_PATH.get("share_farm"), f, 1, 6) > 0;
    }

    farmMap.set(f, {
      isManaged: true,
      isShared: ns.scriptRunning(SCRIPT_PATH.get("share_farm"), f),
    });
  }

  for (const [k, v] of farmMap.entries()) {
    ns.tprintf("%s", `${k} ${JSON.stringify(v)}`);
  }
}
