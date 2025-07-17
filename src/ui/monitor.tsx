import { NS } from "@ns";
// import React from '@react';
import { Root } from "./root";
import React, { ReactDOM } from "./react";

const UI_NODES = {
  customhaxnode: "customhaxnode",
};

export async function main(ns: NS) {
  const terminalContainer = document.getElementById("terminal")?.parentElement;

  if (ns.args[0] === "close") {
    document.getElementById(UI_NODES.customhaxnode)?.replaceChildren();
    document.getElementById(UI_NODES.customhaxnode)?.remove();

    terminalContainer.style =
      "height: 100vh;";

    ns.tprint("Closed monitor");
    ns.scriptKill("ui/monitor.js", "home");
    return;
  }

  if (document.getElementById(UI_NODES.customhaxnode)) {
    // rendered already
    return;
  }

  ns.tprint("Rendering Monitor");
  const frag = document.createDocumentFragment();
  const newNode = frag.appendChild(document.createElement("div"));
  newNode.id = UI_NODES.customhaxnode;
  newNode.style =
    "display:flex; flex-direction: column; overflow: scroll; border: 1px solid gray; max-height: 600px;";

  if (!terminalContainer) {
    ns.tprint("Monitor failed");
    return;
  }
  terminalContainer.style =
    "overflow: hidden; height: 300px;";

  terminalContainer?.parentElement?.appendChild(frag);

  ReactDOM.render(
    <Root ns={ns} />,
    document.getElementById(UI_NODES.customhaxnode) as Element
  );

  ns.disableLog("asleep");

  // keep running as long as rendered
  for (;;) {
    if (!document.getElementById(UI_NODES.customhaxnode)) break;
    await ns.asleep(5000);
  }
}
