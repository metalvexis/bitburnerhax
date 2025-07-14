export enum HAX_LIST {
  crack = "crack",
  hgw = "hgw",
  scout = "scout",
}

export function getScrHax(h: HAX_LIST) {
  const DIR = "/hax";
  return joinpath(DIR, h);
}

export enum HAXFARM_LIST {
  attack_server = "attack_server",
  farm = "farm",
  remotehgw = "remotehgw",
  rename_farm = "rename_farm",
  share_farm = "share_farm",
  zerg_server = "zerg_server",
}

export function getScrHaxFarm(h: HAXFARM_LIST) {
  const DIR = "/haxfarm";
  return joinpath(DIR, h);
}

export enum HAXLIB_LIST {
  constants = "constants",
  utils = "utils",
}

export function getScrHaxLib(h: HAXLIB_LIST) {
  const DIR = "/haxlib"
  return joinpath(DIR,h)
}


function joinpath(dir: string, f: string, ext = ".js") {
  return [dir, f + ext].join("/");
}
