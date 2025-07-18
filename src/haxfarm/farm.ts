import { NS } from "@ns";
import { HAXFARM_LIST, getScrHaxFarm, HAXFARM_RAM } from "/haxlib/constants";
import { isScriptsUploaded, uploadScripts } from "/haxlib/utils";

export async function main(ns: NS): Promise<void> {
  ns.tprint("Managing farms");

  const newFarmCosts = [64, 128, 256, 512, 1024].map((ram) => [
    ram,
    ns.getPurchasedServerCost(ram),
  ]);

  ns.tprintf(
    "Purchaseable farms:\n %s",
    newFarmCosts.map((c) => `${c[0]}GB: ${c[1]}`).join("\n")
  );

  const farmMap = new Map<string, Record<string, any>>();
  const farms = [...ns.getPurchasedServers()];

  const totalSharableRam = farms.map((f) => {
    const farm = ns.getServer(f);
    const freeRam = farm.maxRam - farm.ramUsed;
    return freeRam;
  });

  for (const f of farms) {
    const isScriptsUploadOk = uploadScripts(ns, f);
    const isScriptsExists = isScriptsUploaded(ns, f);
    const isShareFarm = (ns.args[0] as string) == "share";
    const isShared = ns.scriptRunning(
      getScrHaxFarm(HAXFARM_LIST.share_farm),
      f
    );

    if (isShareFarm && isShared) {
      ns.tprintf("Stop sharing %s", f);
      ns.scriptKill(getScrHaxFarm(HAXFARM_LIST.share_farm), f);
    }

    if (isShareFarm) {
      const shareFarm = ns.getServer(f);
      const free = shareFarm.maxRam - shareFarm.ramUsed;
      const isShareSuccess =
        ns.exec(
          getScrHaxFarm(HAXFARM_LIST.share_farm),
          f,
          Math.max(1, Math.ceil(free / HAXFARM_RAM.share_farm)),
          ns.args[1] as string
        ) > 0;

      if (!isShareSuccess) ns.tprintf("Share failed: %s", f);
    }

    farmMap.set(f, {
      isScriptsUploadOk,
      isScriptsExists,
      isShared: ns.scriptRunning(getScrHaxFarm(HAXFARM_LIST.share_farm), f),
    });
  }

  for (const [k, v] of farmMap.entries()) {
    ns.tprintf("%s", `${k} ${JSON.stringify(v)}`);
  }

  const sharePower = ns.getSharePower();

  ns.tprintf(
    "Farm stats: %s",
    JSON.stringify(
      {
        farms: farms.length,
        totalSharableRam,
        sharePower,
      },
      null,
      ""
    )
  );
}
