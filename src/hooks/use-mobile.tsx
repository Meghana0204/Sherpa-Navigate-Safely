import * as React from "react";

// Define breakpoints for different device sizes
const BREAKPOINTS = {
  mobile: 480,
  tablet: 768,
  laptop: 1024,
  desktop: 1200,
  largeDesktop: 1440
};

/**
 * Hook to detect if current viewport matches a specific breakpoint
 * @param {string} breakpointKey - Key from the BREAKPOINTS object
 * @param {string} comparison - Comparison type: 'max' (width <= breakpoint) or 'min' (width >= breakpoint)
 * @returns {boolean} Whether the current viewport matches the breakpoint condition
 */
export function useBreakpoint(breakpointKey, comparison = 'max') {
  const [matches, setMatches] = React.useState(false);
  
  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const breakpointValue = BREAKPOINTS[breakpointKey];
    if (!breakpointValue) {
      console.warn(`Breakpoint "${breakpointKey}" not found in BREAKPOINTS`);
      return;
    }
    
    const mediaQuery = comparison === 'min' 
      ? `(min-width: ${breakpointValue}px)`
      : `(max-width: ${breakpointValue - 1}px)`;
    
    const mql = window.matchMedia(mediaQuery);
    
    const handleChange = (e) => {
      setMatches(e.matches);
    };
    
    // Set initial value
    setMatches(mql.matches);
    
    // Modern event listener approach
    mql.addEventListener('change', handleChange);
    
    // Cleanup
    return () => {
      mql.removeEventListener('change', handleChange);
    };
  }, [breakpointKey, comparison]);
  
  return matches;
}

/**
 * Predefined hooks for common device types
 */
export function useIsMobile() {
  return useBreakpoint('mobile', 'max');
}

export function useIsTablet() {
  return useBreakpoint('tablet', 'max') && !useBreakpoint('mobile', 'max');
}

export function useIsLaptop() {
  return useBreakpoint('laptop', 'max') && !useBreakpoint('tablet', 'max');
}

export function useIsDesktop() {
  return useBreakpoint('desktop', 'max') && !useBreakpoint('laptop', 'max');
}

export function useIsLargeDesktop() {
  return useBreakpoint('largeDesktop', 'min');
}

/**
 * Hook that returns the current device type
 * @returns {string} Current device type: 'mobile', 'tablet', 'laptop', 'desktop', or 'largeDesktop'
 */
export function useDeviceType() {
  const isMobile = useBreakpoint('mobile', 'max');
  const isTablet = useBreakpoint('tablet', 'max') && !useBreakpoint('mobile', 'max');
  const isLaptop = useBreakpoint('laptop', 'max') && !useBreakpoint('tablet', 'max');
  const isDesktop = useBreakpoint('desktop', 'max') && !useBreakpoint('laptop', 'max');
  const isLargeDesktop = useBreakpoint('largeDesktop', 'min');
  
  if (isMobile) return 'mobile';
  if (isTablet) return 'tablet';
  if (isLaptop) return 'laptop';
  if (isDesktop) return 'desktop';
  if (isLargeDesktop) return 'largeDesktop';
  
  // Fallback
  return 'unknown';
}