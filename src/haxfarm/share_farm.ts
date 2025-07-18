
import { NS } from "@ns";
import { assert } from "/haxlib/utils";
export async function main(ns: NS): Promise<void> {
  assert(!!ns.args[0], "iterations required")

  const iterations = parseInt(ns.args[0] as string);

  ns.tprintf("Sharing farm %s cycles", iterations);

  for (let index = 0; index < iterations; index++) {
    await ns.share();
  }
}
