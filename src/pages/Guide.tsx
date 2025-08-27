import React from 'react'
import useScreenSize from '../hooks/useScreenSize.ts';
export const Guide = () => {
    const size = useScreenSize();
    let maxWidth = 1060;
    if (size.width / 2 < 1060) {
      maxWidth = size.width / 2;
    }
    let maxHeight = 615;
    if (size.height / 2 < 615) {
      maxHeight = size.height / 2;
    }
    return (
      <div>
        <h1>Ranked Website Guide (outdated, still accurate though)</h1>
        <iframe
          width={maxWidth}
          height={maxHeight}
          src="https://www.youtube.com/embed/dIa1D4AwZVU?si=Xze_ZDa2k-BxmcXa"
          title="Ranked Website Guide"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        />
      </div>
    );
}