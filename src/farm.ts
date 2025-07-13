import { NS } from "@ns";

const PATH = "/";
const SCRIPTS = new Map([
  ["rename_farm", "rename_farm.js"],
  ["share_farm", "share_farm.js"],
]);

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
    Array.from(SCRIPTS.values()).forEach((s) => {
      ns.scp(PATH + s, f);
    });

    const isShareFarm = (ns.args[0] as string) == "share";
    const isShared = ns.scriptRunning(SCRIPTS.get("share_farm"), f);

    if (isShareFarm && isShared) {
      ns.scriptKill(SCRIPTS.get("share_farm"), f);
    }

    if(isShareFarm) {
      ns.exec(PATH + SCRIPTS.get("share_farm"), f, 1, 6) > 0;
    }

    farmMap.set(f, {
      isManaged: true,
      isShared: ns.scriptRunning(SCRIPTS.get("share_farm"), f),
    });
  }

  for (const [k, v] of farmMap.entries()) {
    ns.tprintf("%s", `${k} ${JSON.stringify(v)}`);
  }
}
