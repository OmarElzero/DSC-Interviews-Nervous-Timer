import { useState, useEffect, useRef } from 'react';

const Timer = ({ 
  timerMode, 
  duration, 
  backgroundColor, 
  textColor, 
  soundUrl, 
  beepInterval,
  isRunning, 
  onTimerComplete
}) => {
  const [time, setTime] = useState(timerMode === 'countdown' ? duration * 60 : 0);
  const audioRef = useRef(null);
  const lastBeepTimeRef = useRef(0);
  
  // Reset timer when timer mode or duration changes
  useEffect(() => {
    setTime(timerMode === 'countdown' ? duration * 60 : 0);
  }, [timerMode, duration]);
  
  // Format time to MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };
  
  // Initialize audio
  useEffect(() => {
    if (typeof window !== 'undefined') {
      audioRef.current = new Audio(soundUrl);
    }
  }, [soundUrl]);
  
  // Timer logic
  useEffect(() => {
    let interval;
    
    if (isRunning) {
      interval = setInterval(() => {
        setTime(prevTime => {
          // For countdown timer
          if (timerMode === 'countdown') {
            // Check if timer completed
            if (prevTime <= 1) {
              clearInterval(interval);
              onTimerComplete();
              return 0;
            }
            
            // Check if we need to beep
            const newTime = prevTime - 1;
            if (newTime > 0 && beepInterval > 0) {
              const secondsElapsed = duration * 60 - newTime;
              if (secondsElapsed % beepInterval === 0 && secondsElapsed !== lastBeepTimeRef.current) {
                if (audioRef.current) {
                  audioRef.current.currentTime = 0;
                  audioRef.current.play();
                  lastBeepTimeRef.current = secondsElapsed;
                }
              }
            }
            
            return newTime;
          } 
          // For stopwatch
          else {
            const newTime = prevTime + 1;
            // Check if we need to beep
            if (beepInterval > 0) {
              if (newTime % beepInterval === 0 && newTime !== lastBeepTimeRef.current) {
                if (audioRef.current) {
                  audioRef.current.currentTime = 0;
                  audioRef.current.play();
                  lastBeepTimeRef.current = newTime;
                }
              }
            }
            return newTime;
          }
        });
      }, 1000);
    }
    
    return () => clearInterval(interval);
  }, [isRunning, timerMode, duration, beepInterval, onTimerComplete, soundUrl]);
  
  return (
    <div 
      className="flex flex-col items-center justify-center h-screen w-full" 
      style={{ backgroundColor }}
    >
      <div 
        className="text-9xl font-mono font-bold" 
        style={{ color: textColor }}
      >
        {formatTime(time)}
      </div>
    </div>
  );
};

export default Timer;
