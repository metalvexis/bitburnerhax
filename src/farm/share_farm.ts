
import { NS } from "@ns";

export async function main(ns: NS): Promise<void> {
  if (!ns.args[0]) throw new Error('Iterations required')

  const iterations = parseInt(ns.args[0] as string);

  ns.tprintf("Sharing farm %s cycles", iterations);

  for (let index = 0; index < iterations; index++) {
    await ns.share();
  }
}
