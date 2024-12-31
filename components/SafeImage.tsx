import Image from "next/image";
import { useState } from "react";

interface SafeImageProps {
  src: string;
  alt: string;
  fill?: boolean;
  className?: string;
}

export function SafeImage({ src, alt, fill = false, className = "" }: SafeImageProps) {
  const [error, setError] = useState(false);
  const fallbackImage = "/api/placeholder/400/300"; // Your fallback image

  // Basic URL validation
  const isValidURL = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  // Determine final source
  const imageSrc = error || !isValidURL(src) ? fallbackImage : src;

  return (
    <Image
      src={imageSrc}
      alt={alt}
      fill={fill}
      className={className}
      onError={() => setError(true)}
      // Add sizes prop for responsive images
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
    />
  );
}