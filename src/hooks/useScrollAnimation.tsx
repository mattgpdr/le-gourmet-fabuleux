import { useEffect, useRef, useState } from "react";

export const useScrollAnimation = () => {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const [isVisible, setIsVisible] = useState(prefersReducedMotion);

  useEffect(() => {
    // Si l'utilisateur préfère moins d'animations, toujours visible
    if (prefersReducedMotion) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -30px 0px",
      }
    );

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [prefersReducedMotion]);

  return { ref, isVisible };
};
