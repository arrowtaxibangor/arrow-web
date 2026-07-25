import { useEffect, useState } from 'react';

// this will return us the active window width accroding to the viewport
export default function useWindowSize() {
  const [windowSize, setWindowSize] = useState({
    width: 0,
    height: 0,
  });

  function handleResize() {
    setWindowSize({
      width: window?.innerWidth,
      height: window?.innerHeight,
    });
  }

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window?.addEventListener('resize', handleResize);
      handleResize();
      return () => window?.removeEventListener('resize', handleResize);
    }
    // Cleanup function (runs whne the component unmounts)
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return windowSize;
}
