import { NS } from "@ns";

const HAXSCRIPTS = [
  "hax/hgw",
  "hax/crack",
  "hax/scout"
];

export async function main(ns: NS) {
  ns.clearLog();
  const player = ns.getPlayer();
  const targetHost: string = ns.args[0] as string || 'n00dles';
  ns.tprintf('%s' ,`Scouting: ${targetHost}`);

  const targetServer = ns.getServer(targetHost);

  const isHaxable = player.skills.hacking >= (targetServer.requiredHackingSkill ?? 0);
  const isMissingHax = HAXSCRIPTS.some((scr) => !ns.fileExists(`${scr}.js`, targetHost))
  
  ns.tprintf('%s' ,`Hax: ` + JSON.stringify({
    isHaxable,
    isMissingHax
  }, null, ' '))

  ns.tprintf('%s' ,`ServerInfo: ` + JSON.stringify(targetServer, null, ' '));
  
  ns.tprintf('value %s' ,`012123456`)
}