import { NS } from "@ns";

export async function main(ns: NS): Promise<void> {
  const reserve = parseInt(ns.args[0] as string) || 1_000_000;
  const maxRam = parseInt(ns.args[1] as string) || 16;
  ns.tprintf("max servers: %s", ns.getPurchasedServerLimit());
  while (ns.getPlayer().money > reserve) {
    const farmIdx = ns
      .getPurchasedServers()
      .map((s) => parseInt(s.split("_")[1]))
      .sort((a, b) => a - b);
    const firstIdx = farmIdx[0];
    const lastIdx = farmIdx[farmIdx.length - 1];

    const delServer = ns.getServer(`farm_${firstIdx}`);
    const isLessRam = delServer.maxRam < maxRam;
    const isMaxPurch =
      ns.getPurchasedServers().length === ns.getPurchasedServerLimit();

    if (isMaxPurch && isLessRam) {
      ns.tprintf("Deleting old server %s", delServer);
      ns.killall(delServer.hostname);
      ns.deleteServer(delServer.hostname);
    }

    const isAfford =
      ns.getPlayer().money - ns.getPurchasedServerCost(512) > reserve;
    if (!isAfford) {
      await ns.asleep(5000);
      continue;
    }
    ns.tprint("Purchasing new server");
    const newServer = ns.purchaseServer(`farm_${lastIdx + 1}`, maxRam);
    ns.tprintf("New server: %s", newServer)
    await ns.asleep(500);
  }
}
