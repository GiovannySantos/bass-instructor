import { useCallback, useState } from "react";

const DEFAULT_INITIAL_BPM = 92;
const MIN_INTERVAL = 120;
const MAX_INTERVAL = 2000;
const MAX_INTERVALS = 4;

const useTapTempo = ({
  initialBpm = DEFAULT_INITIAL_BPM,
  minBpm = 40,
  maxBpm = Number.POSITIVE_INFINITY,
} = {}) => {
  const [bpm, setBpm] = useState(initialBpm);
  const [taps, setTaps] = useState([]);

  const tap = useCallback(() => {
    const now = Date.now();
    let computed = null;
    setTaps((prev) => {
      if (prev.length === 0) return [now];
      const last = prev[prev.length - 1];
      const interval = now - last;
      if (interval < MIN_INTERVAL || interval > MAX_INTERVAL) {
        return [now];
      }
      const next = [...prev, now].slice(-(MAX_INTERVALS + 1));
      const intervals = next.slice(1).map((time, idx) => time - next[idx]);
      const recent = intervals.slice(-MAX_INTERVALS);
      const avg = recent.reduce((acc, val) => acc + val, 0) / recent.length;
      const nextBpm = Math.round(60000 / avg);
      const clamped = Math.min(maxBpm, Math.max(minBpm, nextBpm));
      setBpm(clamped);
      computed = clamped;
      return next;
    });
    return computed;
  }, [minBpm, maxBpm]);

  const reset = useCallback(() => {
    setTaps([]);
  }, []);

  return {
    bpm,
    tap,
    reset,
    setBpm,
  };
};

export default useTapTempo;
