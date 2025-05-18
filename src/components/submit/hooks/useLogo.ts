import { useState, useEffect, useRef } from "react";

/**
 * Simple hook for logo URL validation
 */
export function useLogo(logoUrl: string) {
  const [isLogoValid, setIsLogoValid] = useState(false);
  const [isLogoLoading, setIsLogoLoading] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isMounted = useRef(true);

  // Handle component unmounting
  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Validate URL when logoUrl changes
  useEffect(() => {
    // Clean up previous timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    // If no URL, mark as invalid
    if (!logoUrl) {
      setIsLogoValid(false);
      setIsLogoLoading(false);
      return;
    }

    // Basic URL format check
    if (!logoUrl.startsWith("http")) {
      setIsLogoValid(false);
      setIsLogoLoading(false);
      return;
    }

    // Start loading
    setIsLogoLoading(true);
    console.log("Validating logo URL:", logoUrl);

    // Create image object for validation
    const img = new Image();

    // Set up event handlers
    img.onload = () => {
      if (isMounted.current) {
        console.log("Logo loaded successfully:", logoUrl);
        setIsLogoValid(true);
        setIsLogoLoading(false);
      }
    };

    img.onerror = () => {
      if (isMounted.current) {
        console.log("Logo failed to load but accepting anyway:", logoUrl);
        // Accept as valid even on error for better UX
        setIsLogoValid(true);
        setIsLogoLoading(false);
      }
    };

    // Set timeout in case image loading takes too long
    timeoutRef.current = setTimeout(() => {
      if (isMounted.current) {
        console.log("Logo validation timed out - accepting as valid:", logoUrl);
        setIsLogoValid(true);
        setIsLogoLoading(false);
      }
    }, 3000);

    // Set up image for loading
    img.crossOrigin = "anonymous";
    img.src = logoUrl;

    // Cleanup
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [logoUrl]);

  return { isLogoValid, isLogoLoading, setIsLogoValid, setIsLogoLoading };
}
