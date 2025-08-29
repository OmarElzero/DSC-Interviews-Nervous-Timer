import { useState } from 'react';
import { HexColorPicker } from 'react-colorful';

const Settings = ({ 
  timerMode, 
  setTimerMode, 
  duration, 
  setDuration, 
  backgroundColor, 
  setBackgroundColor, 
  textColor, 
  setTextColor, 
  soundUrl, 
  setSoundUrl, 
  beepInterval, 
  setBeepInterval,
  isOpen,
  onClose 
}) => {
  const [showBgColorPicker, setShowBgColorPicker] = useState(false);
  const [showTextColorPicker, setShowTextColorPicker] = useState(false);
  
  const audioOptions = [
    { name: 'Standard Beep', url: 'https://assets.mixkit.co/active_storage/sfx/212/212-preview.mp3' },
    { name: 'Bell Sound', url: 'https://assets.mixkit.co/active_storage/sfx/270/270-preview.mp3' },
    { name: 'Digital Alarm', url: 'https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3' }
  ];
  
  const beepIntervalOptions = [
    { label: 'Every 15 seconds', value: 15 },
    { label: 'Every 30 seconds', value: 30 },
    { label: 'Every 1 minute', value: 60 },
  ];
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Timer Settings</h2>
        
        {/* Timer Mode */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Timer Mode</label>
          <div className="flex">
            <button 
              onClick={() => setTimerMode('countdown')}
              className={`flex-1 py-2 px-4 mr-2 rounded-md ${timerMode === 'countdown' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            >
              Countdown
            </button>
            <button 
              onClick={() => setTimerMode('stopwatch')}
              className={`flex-1 py-2 px-4 rounded-md ${timerMode === 'stopwatch' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            >
              Stopwatch
            </button>
          </div>
        </div>
        
        {/* Duration (for countdown) */}
        {timerMode === 'countdown' && (
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Duration (minutes)</label>
            <input 
              type="number" 
              min="1" 
              max="120" 
              value={duration}
              onChange={(e) => setDuration(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-full p-2 border rounded-md"
            />
          </div>
        )}
        
        {/* Beep Interval */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Beep Interval</label>
          <select 
            value={beepInterval}
            onChange={(e) => setBeepInterval(parseInt(e.target.value))}
            className="w-full p-2 border rounded-md"
          >
            {beepIntervalOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        
        {/* Sound Selection */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Notification Sound</label>
          <select 
            value={soundUrl}
            onChange={(e) => setSoundUrl(e.target.value)}
            className="w-full p-2 border rounded-md"
          >
            {audioOptions.map(option => (
              <option key={option.url} value={option.url}>
                {option.name}
              </option>
            ))}
          </select>
          <button 
            onClick={() => {
              const audio = new Audio(soundUrl);
              audio.play();
            }}
            className="mt-2 bg-gray-200 px-3 py-1 rounded-md text-sm"
          >
            Test Sound
          </button>
        </div>
        
        {/* Background Color */}
        <div className="mb-4 relative">
          <label className="block text-sm font-medium mb-2">Background Color</label>
          <div className="flex items-center">
            <div 
              className="w-10 h-10 rounded-md border cursor-pointer mr-3"
              style={{ backgroundColor }}
              onClick={() => setShowBgColorPicker(!showBgColorPicker)}
            ></div>
            <input 
              type="text" 
              value={backgroundColor}
              onChange={(e) => setBackgroundColor(e.target.value)}
              className="flex-1 p-2 border rounded-md"
            />
          </div>
          {showBgColorPicker && (
            <div className="absolute z-10 mt-2">
              <HexColorPicker color={backgroundColor} onChange={setBackgroundColor} />
              <button 
                className="w-full mt-2 bg-gray-200 py-1 rounded-md text-sm"
                onClick={() => setShowBgColorPicker(false)}
              >
                Close
              </button>
            </div>
          )}
        </div>
        
        {/* Text Color */}
        <div className="mb-4 relative">
          <label className="block text-sm font-medium mb-2">Text Color</label>
          <div className="flex items-center">
            <div 
              className="w-10 h-10 rounded-md border cursor-pointer mr-3"
              style={{ backgroundColor: textColor }}
              onClick={() => setShowTextColorPicker(!showTextColorPicker)}
            ></div>
            <input 
              type="text" 
              value={textColor}
              onChange={(e) => setTextColor(e.target.value)}
              className="flex-1 p-2 border rounded-md"
            />
          </div>
          {showTextColorPicker && (
            <div className="absolute z-10 mt-2">
              <HexColorPicker color={textColor} onChange={setTextColor} />
              <button 
                className="w-full mt-2 bg-gray-200 py-1 rounded-md text-sm"
                onClick={() => setShowTextColorPicker(false)}
              >
                Close
              </button>
            </div>
          )}
        </div>
        
        {/* Buttons */}
        <div className="flex justify-end mt-6">
          <button 
            onClick={onClose}
            className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
