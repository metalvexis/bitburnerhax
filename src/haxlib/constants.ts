export const TARGET_HACK = 0.20; // x% of max money

export enum HGW {
  hack = "hack",
  grow = "grow",
  weaken = "weaken",
}

export enum HAX_LIST {
  crack = "crack",
  hgw = "hgw",
  scout = "scout",
  upload_hax = "upload_hax",
}

export function getScrHax(h: HAX_LIST) {
  const DIR = "hax";
  return joinpath(DIR, h);
}

export enum HAXFARM_LIST {
  farm = "farm",
  remote_hack = "remote_hack",
  remote_grow = "remote_grow",
  remote_weaken = "remote_weaken",
  rename_farm = "rename_farm",
  share_farm = "share_farm",
  zerg_server = "zerg_server",
  snipe_hgw = "snipe_hgw",
  batch_hgw = "batch_hgw",
}

export enum HAXFARM_RAM {
  share_farm = 4,
  snipe_hgw = 4,
  remote_hack = 1.7,
  remote_grow = 1.75,
  remote_weaken = 1.75,
}

export function getScrHaxFarm(h: HAXFARM_LIST) {
  const DIR = "haxfarm";
  return joinpath(DIR, h);
}

export enum HAXLIB_LIST {
  constants = "constants",
  utils = "utils",
}

export function getScrHaxLib(h: HAXLIB_LIST) {
  const DIR = "haxlib";
  return joinpath(DIR, h);
}

function joinpath(dir: string, f: string, ext = ".js") {
  return [dir, f + ext].join("/");
}
