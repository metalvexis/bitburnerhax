import { NS } from "@ns";
import { HAXFARM_LIST, getScrHaxFarm } from "/haxlib/constants";
import { isScriptsUploaded, uploadScripts } from "/haxlib/utils";
// const PATH = "/haxfarm";
// const SCRIPTS = new Map([
//   ["rename_farm", "rename_farm.js"],
//   ["share_farm", "share_farm.js"],
//   ["attack_server", "attack_server.js"],
//   ["farm", "farm.js"],
// ]);

// const SCRIPT_PATH = new Map<string, string>(
//   Array.from(SCRIPTS).map((scr): [string, string] => {
//     return [scr[0], [PATH, scr[1]].join("/")];
//   })
// );

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

  for (const f of farms) {
    const isScriptsUploadOk = uploadScripts(ns, f);
    // Array.from(Object.values(HAXFARM_LIST)).forEach((k) => {
    //   ns.scp(getScrHaxFarm(HAXFARM_LIST[k]), f);
    // });
    
    // const isMissingScript = Array.from(Object.values(HAXFARM_LIST))
    //   .map((k) => ns.fileExists(getScrHaxFarm(HAXFARM_LIST[k]), f))
    //   .includes(false);
    const isScriptsExists = isScriptsUploaded(ns, f)
    const isShareFarm = (ns.args[0] as string) == "share";
    const isShared = ns.scriptRunning(getScrHaxFarm(HAXFARM_LIST.share_farm), f);

    if (isShareFarm && isShared) {
      ns.tprintf("Stop sharing %s", f);
      ns.scriptKill(getScrHaxFarm(HAXFARM_LIST.share_farm), f);
    }

    if (isShareFarm) {
      (await ns.exec(
        getScrHaxFarm(HAXFARM_LIST.share_farm),
        f,
        1,
        ns.args[1] as string
      )) > 0;
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