import { NS } from "@ns";

/** @param {NS} ns */
export async function main(ns: NS) {
  const target = ns.args[0] as string;

  if (ns.fileExists("BruteSSH.exe", "home")) {
    ns.brutessh(target);
  }

  if (ns.fileExists("FTPCrack.exe", "home")) {
    ns.ftpcrack(target);
  }

  if (ns.fileExists("relaySMTP.exe", "home")) {
    ns.relaysmtp(target);
  }

  if (ns.fileExists("HTTPWorm.exe", "home")) {
    ns.httpworm(target);
  }

  if (ns.fileExists("SQLInject.exe", "home")) {
    ns.sqlinject(target);
  }

  const result = ns.nuke(target);

  ns.tprint("Nuke complete on " + target + ".");
  
  return result;
}
