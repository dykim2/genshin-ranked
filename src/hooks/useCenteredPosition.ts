import { useState, useEffect } from "react";

interface CenterPosition { 
  top: number;
  viewportHeight: number;
  totalHeight: number;
  isCropped: boolean;
}

const useCenteredPosition = () => {
  const [position, setPosition] = useState<CenterPosition>({
    top: 0,
    viewportHeight: window.innerHeight,
    totalHeight: document.documentElement.scrollHeight,
    isCropped: false
  });

  useEffect(() => {
    const updatePosition = () => {
      const viewportHeight = window.innerHeight;
      const totalHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
      const isCropped = totalHeight > viewportHeight;

      // True center accounts for the actual total page height
      // If cropped, we center relative to the total scrollable height
      const centerTop = (totalHeight / 2) - (viewportHeight / 2);

      setPosition({
        top: centerTop,
        viewportHeight,
        totalHeight,
        isCropped
      });
    };

    updatePosition();
    window.addEventListener("resize", updatePosition);

    // Detect content changes
    const observer = new ResizeObserver(updatePosition);
    observer.observe(document.documentElement);

    return () => {
      window.removeEventListener("resize", updatePosition);
      observer.disconnect();
    };
  }, []);

  return position;
};

export default useCenteredPosition;
