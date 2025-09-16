// a hook to display according to screen size , so i can limit viewing to 80% of screen size horizontally
import { useState, useEffect } from "react";
const useScreenSize = () => {
    const [size, setSize] = useState({
        width: window.innerWidth,
        height: window.innerHeight
    })
    useEffect(() => {
        const handleResize = () => {
            // resize window
            setSize({
                width: window.innerWidth,
                height: window.innerHeight
            })
        }
        window.addEventListener("resize", handleResize);
        return () => {
          window.removeEventListener("resize", handleResize);
        };
    }, [])
    return size;
}
export default useScreenSize;