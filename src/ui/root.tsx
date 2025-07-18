import React from "./react";
import { NS, Server } from "@ns";
import { dfsScan } from "/haxlib/utils";
import { scoutAll, ScoutMeta } from "/hax/scout";
import { useInterval } from "./hooks/useInterval";

export interface RootProps {
  ns: NS;
}
type Delta = {
  dmoneyPercent: string;
  dmoneyAvailable: string;
  dhackDifficulty: string;
};

type RenderDelta = {
  hostname: string;
  isHaxable: boolean;
  isHaxUploaded: boolean;
  moneyMax: string;
  moneyAvailable: string;
  hackDifficulty: string;
  minDifficulty: string;
  serverGrowth: string;
  maxRam: string;
  ramUsed: string;
  requiredHackingSkill: string;
  numOpenPortsRequired: string;
};

export function Root({ ns }: RootProps) {
  const time = useInterval(3000); // re-render every xth of a second
  const [victims, setVictims] = React.useState<ScoutMeta[]>([]);
  const [victimsDelta, setVictimsDelta] = React.useState<RenderDelta[]>([]);
  const renderData = [
    "hostname",
    "isHaxable",
    "isHaxUploaded",
    // "dmoneyPercent",
    "moneyMax",
    // "dmoneyAvailable",
    "moneyAvailable",
    "hackDifficulty",
    // "dhackDifficulty",
    "minDifficulty",
    "serverGrowth",
    "maxRam",
    "ramUsed",
    "requiredHackingSkill",
    "numOpenPortsRequired",
  ];

  React.useEffect(() => {
    // ns.tprint("Scouting...")
    setVictims(scoutAll(ns));
  }, [time]);

  React.useMemo(() => {
    // ns.tprint("Analyzing...")

    const newDelta: RenderDelta[] = [];
    victims.map((v) => {
      // const prevDelta = victimsDelta.find((dV) => (dV.hostname = v.hostname));

      // let dmoneyPercent = (v?.moneyAvailable / v?.moneyMax) * 100;
      // let dmoneyAvailable = v?.moneyAvailable;
      // let dhackDifficulty = v?.hackDifficulty;

      // if (prevDelta) {
      //   dmoneyPercent = prevDelta.dmoneyPercent - dmoneyPercent;
      //   dmoneyAvailable = prevDelta?.moneyAvailable - dmoneyAvailable;
      //   dhackDifficulty = prevDelta?.hackDifficulty - dhackDifficulty;
      // }

      newDelta.push({
        ...v,
        serverGrowth: `${v.serverGrowth}`,
        ramUsed: `${v.ramUsed}`,
        maxRam: `${v.maxRam}`,
        moneyMax: v.moneyMax?.toFixed(2) ?? "",
        hackDifficulty: v.hackDifficulty?.toFixed(2) ?? "",
        minDifficulty: v.minDifficulty?.toFixed(2) ?? "",
        moneyAvailable: v.moneyAvailable?.toFixed(2) ?? "",
        requiredHackingSkill: `${v.requiredHackingSkill}`,
        numOpenPortsRequired: `${v.numOpenPortsRequired}`,
      });
    });

    setVictimsDelta(
      newDelta.sort((a, b) => a.numOpenPortsRequired - b.numOpenPortsRequired)
    );
  }, [victims]);

  return (
    <>
      <div
        style={{
          zIndex: 4000,
          backgroundColor: "black",
          color: "#0ee41c",
          border: "1px solid grey",
          userSelect: "all",
          display: "flex",
          flexDirection: "column",
          overflow: "scroll",
          fontSize: "18px",
        }}
      >
        <div
          style={{
            height: "20px",
            cursor: "grab",
          }}
        ></div>

        <table style={{ borderCollapse: "collapse", width: "100%" }}>
          <thead>
            {renderData.map((k) => (
              <th
                key={k}
                style={{
                  border: "1px solid gray",
                  padding: "4px",
                  fontWeight: "bold",
                }}
              >
                {k}
              </th>
            ))}
          </thead>
          <tbody>
            {victimsDelta &&
              victimsDelta.values().map((v, idx) => (
                <tr key={idx}>
                  {renderData.map((k, idx) => (
                    <td
                      key={idx}
                      style={{ border: "1px solid gray", padding: "4px" }}
                    >
                      {v[k as keyof RenderDelta]?.toString()}
                    </td>
                  ))}
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
