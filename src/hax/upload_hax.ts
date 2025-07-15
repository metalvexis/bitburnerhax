import { NS, Server } from "@ns";
import { uploadScripts, dfsScan } from "/haxlib/utils";

export async function main(ns: NS): Promise<void> {
  const WHITELIST_SERVERS = ["home", "darkweb"].concat(
    ns.getPurchasedServers()
  );

  ns.tprintf("%s", `Uploading to ${ns.args[0] ?? "root"}`);
  let knownServers: Server[] = [];

  if (!ns.args[0]) {
    knownServers = knownServers.concat(
      dfsScan(ns, [...WHITELIST_SERVERS], undefined, 0)
    );
    ns.tprintf("Known: %s", knownServers.map((victim) => victim.hostname).join(", "));
  } else {
    knownServers = [ns.getServer(ns.args[0] as string)];
  }

  for (const victim of knownServers) {
    const isUploaded = uploadScripts(ns, victim.hostname)

    if (!isUploaded) {
      ns.tprintf("Upload failed %s", victim.hostname);
    }
    ns.tprintf("Uploaded Hax: %s", victim.hostname);
  }
}
