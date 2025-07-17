import { NS } from "@ns";

export async function main(ns: NS): Promise<void> {
  for (;;) {
    ns.tprint("Redeploying");
    ns.run("deploy.js", 1);
    await ns.asleep(1000*60*30);
  }

  const stockSym = "FSIG";
  const stockAmt = 3_560_000_000;
  ns.stock.buyStock();
  ns.stock.getSaleGain()
  ns.stock.getPrice(stockSym)
  ns.stock.sellStock()
}
