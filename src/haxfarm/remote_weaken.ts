import { NS } from "@ns";

export async function main(ns: NS): Promise<void> {
  await ns.weaken(ns.args[0] as string, {
    threads: ns.args[1] as number,
    stock: true,
  });
  await ns.asleep(100)
  
}
