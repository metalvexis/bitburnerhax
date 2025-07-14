import { NS, Server } from "@ns";

export async function main(ns: NS): Promise<void> {
  switch(ns.args[1]) {
    case "weaken": await ns.weaken(ns.args[0]);
      break;
    case "grow": await ns.grow(ns.args[0]);
      break;
    case "hack": await ns.hack(ns.args[0]);
      break;
  }
}
