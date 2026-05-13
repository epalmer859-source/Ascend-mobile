import { useState } from 'react';

interface ImageWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  /** Shown when the image fails to load (e.g. product name or "Image") */
  fallback?: React.ReactNode;
  /** Called when the image fails to load */
  onError?: () => void;
}

export function ImageWithFallback({ src, alt, fallback, onError, className, ...props }: ImageWithFallbackProps) {
  const [failed, setFailed] = useState(false);

  const handleError = () => {
    setFailed(true);
    onError?.();
  };

  if (failed && fallback !== undefined) {
    return <div className={className} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 80 }}>{fallback}</div>;
  }

  if (failed) {
    return (
      <div 
        className={className}
        style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          minHeight: 80, 
          background: 'rgba(255,255,255,0.04)', 
          color: 'rgba(255,255,255,0.4)', 
          fontSize: 12,
          fontFamily: 'var(--header)'
        }}
      >
        {alt || 'Image'}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt ?? ''}
      className={className}
      onError={handleError}
      {...props}
    />
  );
}
