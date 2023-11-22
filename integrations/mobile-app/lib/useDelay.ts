import { useEffect, useRef, useState } from "react";

export default function useDelay({
  active = false,
  delay = 100,
}: {
  active?: boolean;
  delay?: number;
}) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>();
  const [delayPassed, setDelayPassed] = useState(false);

  useEffect(() => {
    setDelayPassed(false);
    if (timerRef.current) clearTimeout(timerRef.current);

    if (active) {
      timerRef.current = setTimeout(() => {
        timerRef.current = undefined;
        setDelayPassed(true);
      }, delay);
    }
  }, [active, delay, timerRef, setDelayPassed]);

  return active && delayPassed;
}
