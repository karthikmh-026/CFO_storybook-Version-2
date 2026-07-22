import { useCountUp } from "../hooks/useCountUp";

export default function CountUp({ value, trigger, decimals = 1, prefix = "", suffix = "" }) {
  const animated = useCountUp(value || 0, trigger);
  return (
    <span className="tabular">
      {prefix}
      {animated.toFixed(decimals)}
      {suffix}
    </span>
  );
}
