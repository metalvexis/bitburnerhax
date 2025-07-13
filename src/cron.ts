import { NS } from "@ns";

export async function main(ns: NS): Promise<void> {
  for (;;) {
    ns.tprint("Redeploying");
    ns.run("deploy.js", 1);
    await ns.asleep(60000);
  }
}
