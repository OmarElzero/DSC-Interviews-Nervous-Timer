import { useState, useEffect, useRef, useCallback } from 'react';

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
  // Use a ref to track if this is the first render
  const firstRenderRef = useRef(true);
  const audioRef = useRef(null);
  const lastBeepTimeRef = useRef(0);
  const intervalRef = useRef(null);
  
  // Initialize time based on mode
  const [time, setTime] = useState(() => {
    return timerMode === 'countdown' ? duration * 60 : 0;
  });
  
  // Format time to MM:SS
  const formatTime = useCallback((seconds) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  }, []);
  
  // Reset timer when timer mode or duration changes
  useEffect(() => {
    // Skip on first render
    if (firstRenderRef.current) {
      firstRenderRef.current = false;
      return;
    }
    
    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    // Reset time based on mode
    setTime(timerMode === 'countdown' ? duration * 60 : 0);
    
    // Reset last beep time
    lastBeepTimeRef.current = 0;
    
    console.log(`Mode changed to: ${timerMode}, Duration: ${duration}`);
    
  }, [timerMode, duration]);
  
  // Initialize audio
  useEffect(() => {
    if (typeof window !== 'undefined') {
      audioRef.current = new Audio(soundUrl);
    }
    
    return () => {
      // Cleanup audio on unmount
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
    };
  }, [soundUrl]);
  
  // Timer logic
  useEffect(() => {
    // Clear any existing interval first
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTime(prevTime => {
          // For countdown timer
          if (timerMode === 'countdown') {
            // Check if timer completed
            if (prevTime <= 1) {
              clearInterval(intervalRef.current);
              intervalRef.current = null;
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
                  audioRef.current.play().catch(e => console.error('Audio play error:', e));
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
                  audioRef.current.play().catch(e => console.error('Audio play error:', e));
                  lastBeepTimeRef.current = newTime;
                }
              }
            }
            return newTime;
          }
        });
      }, 1000);
    }
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isRunning, timerMode, duration, beepInterval, onTimerComplete, soundUrl]);
  
  // Handle reset
  useEffect(() => {
    if (!isRunning) {
      // This will reset the timer when it's not running (after a pause/reset)
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      
      // Only reset if we're explicitly in a reset state
      if (!isRunning && lastBeepTimeRef.current > 0) {
        setTime(timerMode === 'countdown' ? duration * 60 : 0);
        lastBeepTimeRef.current = 0;
      }
    }
  }, [isRunning, timerMode, duration]);
  
  return (
    <div 
      className="flex flex-col items-center justify-center h-screen w-full timer-component" 
      style={{ backgroundColor }}
      data-mode={timerMode}
      data-running={isRunning.toString()}
    >
      <div 
        className="text-9xl font-mono font-bold" 
        style={{ color: textColor }}
      >
        {formatTime(time)}
      </div>
      <div className="mt-4 text-xl" style={{ color: textColor }}>
        Mode: {timerMode === 'countdown' ? 'Countdown' : 'Stopwatch'}
      </div>
    </div>
  );
};

export default Timer;
