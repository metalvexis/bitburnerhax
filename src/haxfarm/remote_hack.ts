import { NS } from "@ns";

export async function main(ns: NS): Promise<void> {
  let maxIter = parseInt(ns.args[2] as string) || null;
  for (;;) {
    await ns.hack(ns.args[0] as string, {
      threads: ns.args[1] as number,
      stock: true,
    });
    ns.asleep(500);

    if (maxIter) --maxIter;
    if (maxIter === 0) break;
  }
}
