import React from "../react";

export function useInterval(int: number) {
  const [time, setTime] = React.useState(new Date());
  React.useEffect(() => {
    const id = window.setInterval( () => setTime(new Date()), int);
    return () => {
      window.clearInterval(id);
    };
  }, []);
  return time;
}
