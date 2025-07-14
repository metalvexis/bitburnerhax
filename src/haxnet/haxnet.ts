import { NS } from "@ns";

export async function main(ns: NS): Promise<void> {
  ns.tprintf("%s","Hacknet Mgr!");
  ns.tprintf("%s", ns.hacknet.maxNumNodes())

  const p = ns.getPlayer();
}
