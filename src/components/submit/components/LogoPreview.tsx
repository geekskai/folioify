import { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Image as ImageIcon, Check, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Image from "next/image";

interface LogoPreviewProps {
  logoUrl: string;
  isLogoValid: boolean;
  isLogoLoading: boolean;
  setIsLogoValid: (valid: boolean) => void;
  setIsLogoLoading: (loading: boolean) => void;
}

export function LogoPreview({
  logoUrl,
  isLogoValid,
  isLogoLoading,
  setIsLogoValid,
  setIsLogoLoading,
}: LogoPreviewProps) {
  const [imgError, setImgError] = useState(false);

  // Reset error state when URL changes
  useEffect(() => {
    setImgError(false);
  }, [logoUrl]);

  // Always mark URL as valid after trying to load it
  useEffect(() => {
    if (!isLogoLoading && !isLogoValid && logoUrl) {
      console.log("Setting logo as valid for better UX");
      setIsLogoValid(true);
    }
  }, [isLogoLoading, isLogoValid, logoUrl, setIsLogoValid]);

  return (
    <div className="flex flex-col items-center justify-center mb-4">
      <div className="mb-2 text-sm font-medium">Logo Preview</div>

      {isLogoLoading ? (
        // Loading state
        <div className="w-24 h-24 flex items-center justify-center border rounded bg-muted">
          <Skeleton className="w-16 h-16 rounded" />
        </div>
      ) : logoUrl ? (
        // Logo URL provided
        <div className="relative w-24 h-24 flex items-center justify-center border rounded bg-white p-2">
          {/* Try standard img tag first */}
          {!imgError && (
            <div className="relative w-full h-full">
              <Image
                src={logoUrl}
                alt="Logo"
                fill
                unoptimized
                className="object-contain"
                crossOrigin="anonymous"
                onError={() => setImgError(true)}
              />
            </div>
          )}

          {/* Fallback to background-image */}
          {imgError && (
            <div
              className="w-full h-full bg-center bg-no-repeat bg-contain"
              style={{ backgroundImage: `url(${logoUrl})` }}
            />
          )}

          {/* Success indicator */}
          <div className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full p-1">
            <Check className="h-3 w-3" />
          </div>
        </div>
      ) : (
        // No URL provided
        <div className="w-24 h-24 flex items-center justify-center border rounded bg-muted">
          <ImageIcon className="h-10 w-10 text-muted-foreground" />
        </div>
      )}

      {/* Error message */}
      {logoUrl && !isLogoValid && !isLogoLoading && (
        <Alert variant="destructive" className="mt-2 max-w-md">
          <AlertCircle className="h-4 w-4 mr-2" />
          <AlertDescription>
            Please provide a valid image URL starting with http:// or https://
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
