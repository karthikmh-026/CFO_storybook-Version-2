import { useEffect, useRef, useState } from "react";

// Wraps IntersectionObserver: returns a ref to attach and whether the
// element has scrolled into view. Stays true once triggered (no re-hide on
// scroll-away) so numbers don't reset mid-demo.
export function useScrollReveal(threshold = 0.35) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setInView(true);
            observer.unobserve(node);
          }
        });
      },
      { threshold }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold]);

  return [ref, inView];
}
