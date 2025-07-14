
import { NS } from "@ns";

export async function main(ns: NS): Promise<void> {
  ns.tprintf("Renaming server %s to %s", ns.args[0], ns.args[1]);

  ns.renamePurchasedServer(ns.args[0] as string, ns.args[1] as string);
}
