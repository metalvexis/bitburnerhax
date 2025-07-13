import { NS } from "@ns";

/** @param {NS} ns */
export async function main(ns: NS) {
  const target = ns.args[0] as string;
  let openPort = 0;

  if (ns.fileExists("BruteSSH.exe", "home")) {
    const res = ns.brutessh(target);
    if (res) openPort++;
  }

  if (ns.fileExists("FTPCrack.exe", "home")) {
    const res = ns.ftpcrack(target);
    if (res) openPort++;
  }

  if (ns.fileExists("relaySMTP.exe", "home")) {
    const res = ns.relaysmtp(target);
    if (res) openPort++;
  }

  if (ns.fileExists("HTTPWorm.exe", "home")) {
    const res = ns.httpworm(target);
    if (res) openPort++;
  }

  if (ns.fileExists("SQLInject.exe", "home")) {
    const res = ns.sqlinject(target);
    if (res) openPort++;
  }

  let result;
  // if (!openPort) {
  //   ns.tprintf("Cannot crack %s", target);
  //   return;
  // }
  try {
    result = ns.nuke(target);
  } catch (error) {
    ns.tprintf(
      "NUKE failed on %s: %s",
      target,
      JSON.stringify(error, null, "")
    );
    return false;
  }

  ns.tprint("Nuke complete on " + target + ".");

  return result;
}
