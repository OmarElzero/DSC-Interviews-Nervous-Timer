import { useState, useCallback, useRef, useEffect } from 'react';
import Head from 'next/head';
import Timer from '../components/Timer';
import Settings from '../components/Settings';

export default function Home() {
  // Timer state
  const [isRunning, setIsRunning] = useState(false);
  const [timerMode, setTimerMode] = useState('countdown'); // 'countdown' or 'stopwatch'
  const [duration, setDuration] = useState(30); // minutes
  
  // Use a key to force Timer component re-render when needed
  const [timerKey, setTimerKey] = useState(0);
  
  // Appearance settings
  const [backgroundColor, setBackgroundColor] = useState('#1a1a1a');
  const [textColor, setTextColor] = useState('#ffffff');
  
  // Audio settings
  const [soundUrl, setSoundUrl] = useState('https://assets.mixkit.co/active_storage/sfx/212/212-preview.mp3');
  const [beepInterval, setBeepInterval] = useState(60); // seconds
  
  // Settings panel state
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
  // Keep track of previous values to detect changes
  const prevTimerModeRef = useRef(timerMode);
  const prevDurationRef = useRef(duration);
  
  // Force re-render when important settings change
  useEffect(() => {
    const modeChanged = prevTimerModeRef.current !== timerMode;
    const durationChanged = prevDurationRef.current !== duration;
    
    if (modeChanged || durationChanged) {
      setIsRunning(false); // Stop the timer on mode/duration change
      setTimerKey(prev => prev + 1); // Force Timer component to re-render
      
      // Update refs with new values
      prevTimerModeRef.current = timerMode;
      prevDurationRef.current = duration;
      
      console.log(`Settings changed - Mode: ${timerMode}, Duration: ${duration}`);
    }
  }, [timerMode, duration]);
  
  // Handle settings close with save
  const handleSettingsSave = useCallback(() => {
    setIsSettingsOpen(false);
    
    // Force Timer component to re-render after settings change
    setTimerKey(prev => prev + 1);
  }, []);
  
  // Handle timer completion
  const handleTimerComplete = useCallback(() => {
    setIsRunning(false);
    const audio = new Audio(soundUrl);
    audio.play().catch(e => console.error('Audio play error:', e));
    // You could add more completion actions here
  }, [soundUrl]);
  
  // Control buttons
  const handleStart = () => {
    setIsRunning(true);
  };
  
  const handlePause = () => {
    setIsRunning(false);
  };
  
  const handleReset = () => {
    setIsRunning(false);
    // Force re-render of Timer component to reset the state
    setTimerKey(prev => prev + 1);
  };
  
  return (
    <div>
      <Head>
        <title>Interview Timer</title>
        <meta name="description" content="Customizable Interview Timer" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <main>
        <Timer
          key={timerKey} // This key forces re-render when needed
          timerMode={timerMode}
          duration={duration}
          backgroundColor={backgroundColor}
          textColor={textColor}
          soundUrl={soundUrl}
          beepInterval={beepInterval}
          isRunning={isRunning}
          onTimerComplete={handleTimerComplete}
        />
        
        {/* Control buttons */}
        <div className="fixed bottom-0 left-0 right-0 p-6 flex justify-center space-x-4">
          {!isRunning ? (
            <button 
              onClick={handleStart}
              className="bg-green-500 hover:bg-green-600 text-white py-3 px-8 rounded-full text-lg font-semibold shadow-lg transition-colors"
            >
              Start
            </button>
          ) : (
            <button 
              onClick={handlePause}
              className="bg-yellow-500 hover:bg-yellow-600 text-white py-3 px-8 rounded-full text-lg font-semibold shadow-lg transition-colors"
            >
              Pause
            </button>
          )}
          
          <button 
            onClick={handleReset}
            className="bg-red-500 hover:bg-red-600 text-white py-3 px-8 rounded-full text-lg font-semibold shadow-lg transition-colors"
          >
            Reset
          </button>
          
          <button 
            onClick={() => setIsSettingsOpen(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white py-3 px-8 rounded-full text-lg font-semibold shadow-lg transition-colors"
          >
            Settings
          </button>
        </div>
        
        {/* Settings panel */}
        <Settings
          timerMode={timerMode}
          setTimerMode={setTimerMode}
          duration={duration}
          setDuration={setDuration}
          backgroundColor={backgroundColor}
          setBackgroundColor={setBackgroundColor}
          textColor={textColor}
          setTextColor={setTextColor}
          soundUrl={soundUrl}
          setSoundUrl={setSoundUrl}
          beepInterval={beepInterval}
          setBeepInterval={setBeepInterval}
          isOpen={isSettingsOpen}
          onClose={handleSettingsSave} // Use our custom handler that forces a re-render
        />
      </main>
    </div>
  );
}
