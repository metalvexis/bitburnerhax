import React from "./react";
import { NS } from "@ns";
export interface FloatingWindowProps {
  node: React.ReactNode | React.JSX.Element;
  ns: NS;
}
export function FloatingWindow({ ns, node }: FloatingWindowProps) {
  const windRef = React.useRef(null);
  const dragRef = React.useRef(null);
  const startPos = 10;
  const [isDragging, setIsDragging] = React.useState(false);
  // const [transformT, setTransformT] = React.useState("translate(0px,0px)");
  // const [position, setPosition] = React.useState({ x: 10, y: 10 });
  const [translateX, setTranslateX] = React.useState(0);
  const [translateY, setTranslateY] = React.useState(0);
  const position = React.useRef({ x: 10, y: 10 });
  const offset = React.useRef({ x: 0, y: 0 });

  const handleGrab: React.EventHandler<any> = (e) => {
    ns.tprint("GRAB");
    offset.current.x = e.clientX - position.current.x;
    offset.current.y = e.clientY - position.current.y;
    ns.tprintf("x: %s , y: %s", offset.current.x, offset.current.y);
    setIsDragging(true);

    e.preventDefault();
  };

  const handleRelease: React.EventHandler<any> = (e: React.MouseEvent) => {
    ns.tprint("RELEASE");
    setIsDragging(false);
    e.preventDefault();
  };

  const handleMouseMove: React.EventHandler<any> = (e: React.MouseEvent) => {
    // ns.tprint("MOVE")
    e.stopPropagation();

    if (isDragging) {
      const dX = e.clientX - offset.current.x;
      const dY = e.clientY - offset.current.y;
      // offset.current.x = dX;
      // offset.current.y = dY;
      ns.tprintf("dX: %s , dY: %s", dX, dY);

      setTranslateX(dX);
      setTranslateY(dY);
      position .current = { x: dX - position.current.x, y: dY - position.current.y };
    }

    e.preventDefault();
  };

  // React.useEffect(() => {
  //   dragRef.current?.addEventListener("mousedown", handleGrab);
  //   dragRef.current?.addEventListener("mouseup", handleRelease);
  //   dragRef.current?.addEventListener("mousemove", handleMouseMove);
  //   return () => {
  //     dragRef.current?.removeEventListener("mousedown", handleGrab);
  //     dragRef.current?.removeEventListener("mouseup", handleRelease);
  //     dragRef.current?.removeEventListener("mousemove", handleMouseMove);
  //   };
  // }, [isDragging]);

  return (
    <>
      <div
        ref={windRef}
        style={{
          zIndex: 4000,
          position: "fixed",
          transform: `translate(${translateX}px, ${translateY}px)`,
          top: 10,
          left: 10,
          backgroundColor: "black",
          color: "green",
          border: "1px solid grey",
          userSelect: "none",
          width: "250px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          ref={dragRef}
          style={{
            color: "green",
            height: "20px",
            cursor: "grab",
          }}
          onMouseOut={handleRelease}
          onMouseUp={handleRelease}
          onMouseDown={handleGrab}
          onMouseMove={handleMouseMove}
        >
          Floating Window
        </div>
        {node}
      </div>
    </>
  );
}
