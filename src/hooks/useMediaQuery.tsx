"use client";

import { useState, useEffect } from "react";

// Custom hook to check if the media query matches
export function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mediaQueryList = window.matchMedia(query);
    const handleChange = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    // Set the initial match
    setMatches(mediaQueryList.matches);

    // Add the listener for future changes
    mediaQueryList.addEventListener("change", handleChange);

    // Cleanup on unmount
    return () => {
      mediaQueryList.removeEventListener("change", handleChange);
    };
  }, [query]);

  return matches;
}
