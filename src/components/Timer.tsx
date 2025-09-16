import { useState, useEffect, useRef } from "react";

const Timer = () => {
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef: any = useRef(null); // replace any with something else
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isRunning]);

  const startTimer = () => setIsRunning(true);
  const pauseTimer = () => setIsRunning(false);
  const resetTimer = () => {
    setIsRunning(false);
    setSeconds(0);
  };

  return (
    <div className="p-4 rounded-xl shadow-md w-60 bg-white text-center">
      <h2 className="text-xl font-bold mb-2">Timer: {seconds}s</h2>
      <div className="space-x-2">
        <button
          onClick={startTimer}
          className="px-3 py-1 bg-green-500 text-white rounded"
        >
          Start
        </button>
        <button
          onClick={pauseTimer}
          className="px-3 py-1 bg-yellow-500 text-white rounded"
        >
          Pause
        </button>
        <button
          onClick={resetTimer}
          className="px-3 py-1 bg-red-500 text-white rounded"
        >
          Reset
        </button>
      </div>
    </div>
  );
};

export default Timer;
