import React from "./react";
import { NS, Server } from "@ns";
import { dfsScan } from "/haxlib/utils";
import { scoutAll, ScoutMeta } from "/hax/scout";
import { useInterval } from "./hooks/useInterval";

export interface RootProps {
  ns: NS;
}
type Delta = {
  dmoneyPercent: number;
  dmoneyAvailable: number;
  dhackDifficulty: number;
};

type RenderDelta = Delta &
  Pick<
    ScoutMeta,
    | "hostname"
    | "isHaxable"
    | "isHaxUploaded"
    | "moneyMax"
    | "moneyAvailable"
    | "hackDifficulty"
    | "minDifficulty"
    | "serverGrowth"
    | "maxRam"
    | "ramUsed"
    | "requiredHackingSkill"
    | "numOpenPortsRequired"
  >;

export function Root({ ns }: RootProps) {
  const time = useInterval(3000); // re-render every xth of a second
  const [victims, setVictims] = React.useState<ScoutMeta[]>([]);
  const [victimsDelta, setVictimsDelta] = React.useState(
    new Map<string, RenderDelta>()
  );
  const renderData = [
    "hostname",
    "isHaxable",
    "isHaxUploaded",
    "dmoneyPercent",
    "moneyMax",
    "dmoneyAvailable",
    "moneyAvailable",
    "hackDifficulty",
    "dhackDifficulty",
    "minDifficulty",
    "serverGrowth",
    "maxRam",
    "ramUsed",
    "requiredHackingSkill",
    "numOpenPortsRequired"
  ];

  React.useEffect(() => {
    // ns.tprint("Scouting...")
    setVictims(scoutAll(ns));
  }, [time]);

  React.useMemo(() => {
    // ns.tprint("Analyzing...")

    const newDelta = new Map(victimsDelta);
    victims.map((v) => {
      const hasPrev = victimsDelta.get(v.hostname);

      let dmoneyPercent = 0;
      let dmoneyAvailable = 0;
      let dhackDifficulty = 0;

      if (v && hasPrev) {
        dmoneyPercent =
          ((v?.moneyAvailable / v?.moneyMax) * 100);
        dmoneyAvailable = (v?.moneyAvailable - hasPrev?.moneyAvailable);
        dhackDifficulty = (v?.hackDifficulty - hasPrev?.hackDifficulty);
      }

      newDelta.set(v.hostname, {
        ...v,

        moneyMax: v.moneyMax?.toFixed(2),
        hackDifficulty: v.hackDifficulty?.toFixed(2),
        minDifficulty: v.minDifficulty?.toFixed(2),
        moneyAvailable: v.moneyAvailable?.toFixed(2),
        dmoneyPercent: dmoneyPercent.toFixed(2),
        dmoneyAvailable: dmoneyAvailable.toFixed(2),
        dhackDifficulty: dhackDifficulty.toFixed(2),
        requiredHackingSkill: v.requiredHackingSkill,
        numOpenPortsRequired: v.numOpenPortsRequired,
      });
    });

    setVictimsDelta(newDelta);
  }, [victims]);

  return (
    <>
      <div
        style={{
          zIndex: 4000,
          backgroundColor: "black",
          color: "#72e0d1",
          border: "1px solid grey",
          userSelect: "all",
          display: "flex",
          flexDirection: "column",
          overflow: "scroll",
          width: "1600px",
        }}
      >
        <div
          style={{
            height: "20px",
            cursor: "grab",
          }}
        >
          Scout
        </div>

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
