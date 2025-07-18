import { NS } from "@ns";

export async function main(ns: NS): Promise<void> {
  const maxRam = parseInt(ns.args[0] as string) || 64;
  const reserve = parseInt(ns.args[1] as string) || 10_000_000;

  while (ns.getPlayer().money > reserve) {
    const farms = ns.getPurchasedServers();
    const farmIdx = farms
      .map((s) => parseInt(s.split("_")[1]))
      .sort((a, b) => a - b);
    // const firstIdx = farmIdx[0] ?? 0;
    const lastIdx = farmIdx[farmIdx.length - 1] ?? 0;

    const isMaxPurch = farms.length === ns.getPurchasedServerLimit();

    if (isMaxPurch) {
      for (const f of farms) {
        const delServer = ns.getServer(f);
        const isLessRam = delServer.maxRam < maxRam;

        ns.tprintf(
          "Max purchase reached, target delete: %s %sGB",
          delServer.hostname,
          delServer.maxRam
        );

        if (isLessRam) {
          ns.tprintf("Deleting old server %s", delServer.hostname);
          ns.killall(delServer.hostname);
          ns.deleteServer(delServer.hostname);
          break;
        }
      }
    }

    const isAfford =
      ns.getPlayer().money - ns.getPurchasedServerCost(maxRam) > reserve;
    if (!isAfford) {
      await ns.asleep(5000);
      continue;
    }
    ns.tprint("Purchasing new server");
    const newServer = ns.purchaseServer(`farm_${lastIdx + 1}`, maxRam);

    if (!newServer) break;

    ns.tprintf("New server: %s", newServer);
    await ns.asleep(2000);
  }
}
